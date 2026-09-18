#!/usr/bin/env node
/**
 * Partner traffic + conversion report for a campaign landing page (e.g. /icg).
 *
 * Two independent halves, because no single system knows both:
 *   Traffic     — nginx access logs on the frontend host, read over SSH. Chosen
 *                 over the GA4 API deliberately: ad blockers are common in this
 *                 audience and silently drop the gtag beacon, so GA undercounts
 *                 top-of-funnel traffic. The web server sees every request.
 *   Conversions — the admin API, which already filters users by acquisition
 *                 source and carries their request/token/deposit totals.
 *
 * Either half degrades on its own: no admin credentials still prints traffic.
 *
 * Usage:
 *   node scripts/partner-report.mjs --source=icg --days=14
 *   node scripts/partner-report.mjs --source=icg --days=30 --csv=/tmp/icg.csv
 *   node scripts/partner-report.mjs --source=icg --logfile=./access.log
 *
 * Credentials come from the environment, never from flags (flags land in shell
 * history and in `ps` output):
 *   ADMIN_USERNAME, ADMIN_PASSWORD   admin API login (optional)
 *   API_BASE                         default https://api.gonkarouter.io
 *   REPORT_SSH_TARGET                default root@8.217.233.52
 *   REPORT_NGINX_LOGS                default /var/log/nginx/access.log*
 */

import { execFile } from 'node:child_process'
import { readFileSync, writeFileSync } from 'node:fs'
import { promisify } from 'node:util'

const execFileAsync = promisify(execFile)

const API_BASE = (process.env.API_BASE || 'https://api.gonkarouter.io').replace(/\/$/, '')
const SSH_TARGET = process.env.REPORT_SSH_TARGET || 'root@8.217.233.52'
const NGINX_LOGS = process.env.REPORT_NGINX_LOGS || '/var/log/nginx/access.log*'

// nginx keeps 14 rotated files on this host, so a longer window silently
// reports less traffic than actually happened. Warn rather than pretend.
const LOG_RETENTION_DAYS = 14
const SSH_TIMEOUT_MS = 120_000
const ADMIN_PAGE_SIZE = 100
const ADMIN_MAX_PAGES = 100

// Crawlers and uptime monitors would otherwise inflate a partner's numbers.
const BOT_UA = /bot|crawler|spider|slurp|curl|wget|python-requests|okhttp|headless|monitor|uptime|axios|go-http-client|scrapy|facebookexternalhit|bingpreview/i

// nginx "combined": ip - user [time] "METHOD path proto" status bytes "referer" "ua"
const LOG_LINE =
  /^(\S+) \S+ \S+ \[([^\]]+)\] "(\w+) ([^" ]*)[^"]*" (\d{3}) \S+ "([^"]*)" "([^"]*)"/

function parseArgs(argv) {
  const args = { source: 'icg', days: 14, path: '', csv: '', logfile: '' }
  for (const raw of argv.slice(2)) {
    const [key, value = ''] = raw.replace(/^--/, '').split('=')
    if (key in args) args[key] = key === 'days' ? Number(value) : value
  }
  if (!Number.isFinite(args.days) || args.days < 1) {
    throw new Error('--days must be a positive number')
  }
  // The landing path defaults to the source tag: source 'icg' → path '/icg'.
  if (!args.path) args.path = `/${args.source}`
  return args
}

// "18/Sep/2026:00:00:04 +0800" → Date
const MONTHS = {
  Jan: 0, Feb: 1, Mar: 2, Apr: 3, May: 4, Jun: 5,
  Jul: 6, Aug: 7, Sep: 8, Oct: 9, Nov: 10, Dec: 11
}
function parseLogDate(stamp) {
  const m = /^(\d{2})\/(\w{3})\/(\d{4}):(\d{2}):(\d{2}):(\d{2}) ([+-]\d{4})$/.exec(stamp)
  if (!m) return null
  const [, d, mon, y, hh, mm, ss, tz] = m
  const iso = `${y}-${String(MONTHS[mon] + 1).padStart(2, '0')}-${d}T${hh}:${mm}:${ss}${tz.slice(0, 3)}:${tz.slice(3)}`
  const date = new Date(iso)
  return Number.isNaN(date.getTime()) ? null : date
}

const dayKey = (date) => date.toISOString().slice(0, 10)

async function fetchAccessLines(path, logfile) {
  // A local copy of the log skips SSH entirely — handy for re-running a report
  // against archived logs, or on a machine without access to the host.
  if (logfile) {
    return readFileSync(logfile, 'utf8').split('\n').filter(Boolean)
  }

  // zcat -f transparently handles both plain and .gz rotated files. The grep
  // runs server-side so only matching lines cross the network.
  const remote = `zcat -f ${NGINX_LOGS} 2>/dev/null | grep -F ' ${path}' || true`
  const { stdout } = await execFileAsync(
    'ssh',
    ['-o', 'BatchMode=yes', '-o', 'ConnectTimeout=10', SSH_TARGET, remote],
    { timeout: SSH_TIMEOUT_MS, maxBuffer: 256 * 1024 * 1024 }
  )
  return stdout.split('\n').filter(Boolean)
}

function summarizeTraffic(lines, { path, since }) {
  const buckets = new Map() // utm_content → stats
  const daily = new Map() // YYYY-MM-DD → hits
  const referers = new Map()
  let bots = 0
  let outOfWindow = 0

  for (const line of lines) {
    const m = LOG_LINE.exec(line)
    if (!m) continue
    const [, ip, stamp, method, url, status, referer, ua] = m

    // grep matched anywhere in the line; confirm it is really this page and
    // not, say, a referer that happens to contain the path.
    const [urlPath, queryString = ''] = url.split('?')
    if (urlPath !== path || method !== 'GET') continue
    // 3xx/4xx are not page views; a redirect chain would double-count.
    if (!status.startsWith('2')) continue

    const at = parseLogDate(stamp)
    if (!at) continue
    if (at < since) {
      outOfWindow += 1
      continue
    }

    if (BOT_UA.test(ua)) {
      bots += 1
      continue
    }

    const params = new URLSearchParams(queryString)
    const tag = params.get('utm_content') || params.get('utm_campaign') || '(no utm)'

    if (!buckets.has(tag)) buckets.set(tag, { hits: 0, ips: new Set() })
    const bucket = buckets.get(tag)
    bucket.hits += 1
    bucket.ips.add(ip)

    daily.set(dayKey(at), (daily.get(dayKey(at)) || 0) + 1)

    if (referer && referer !== '-') {
      try {
        const host = new URL(referer).hostname
        referers.set(host, (referers.get(host) || 0) + 1)
      } catch {
        // Malformed referer header — not worth failing the report over.
      }
    }
  }

  return { buckets, daily, referers, bots, outOfWindow }
}

async function adminLogin(username, password) {
  const res = await fetch(`${API_BASE}/admin/login`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ username, password })
  })
  if (!res.ok) throw new Error(`admin login failed: HTTP ${res.status}`)
  const data = await res.json()
  const token = data?.token || data?.data?.token
  if (!token) throw new Error('admin login returned no token')
  return token
}

async function fetchUsersBySource(token, source) {
  const users = []
  for (let page = 1; page <= ADMIN_MAX_PAGES; page += 1) {
    const url = `${API_BASE}/admin/users?source=${encodeURIComponent(source)}&page=${page}&page_size=${ADMIN_PAGE_SIZE}`
    const res = await fetch(url, { headers: { authorization: `Bearer ${token}` } })
    if (!res.ok) throw new Error(`admin users failed: HTTP ${res.status}`)
    const body = await res.json()
    const items = body?.items || body?.data?.items || []
    users.push(...items)
    const total = body?.total ?? body?.data?.total ?? users.length
    if (users.length >= total || items.length === 0) break
  }
  return users
}

function summarizeUsers(users, since) {
  const inWindow = users.filter((u) => new Date(u.created_at) >= since)
  const totals = inWindow.reduce(
    (acc, u) => ({
      requests: acc.requests + Number(u.chat_requests || 0),
      tokens: acc.tokens + Number(u.chat_tokens || 0),
      active: acc.active + (Number(u.chat_requests || 0) > 0 ? 1 : 0)
    }),
    { requests: 0, tokens: 0, active: 0 }
  )
  const deposited = inWindow.filter((u) =>
    Object.values(u.deposits_total || {}).some((v) => Number(v) > 0)
  ).length
  return { all: users.length, signups: inWindow.length, deposited, ...totals }
}

const num = (n) => Number(n).toLocaleString('en-US')
const pct = (part, whole) => (whole > 0 ? `${((part / whole) * 100).toFixed(1)}%` : 'n/a')

function printReport({ args, since, traffic, conversions, warnings }) {
  const totalHits = [...traffic.buckets.values()].reduce((s, b) => s + b.hits, 0)
  const totalVisitors = new Set([...traffic.buckets.values()].flatMap((b) => [...b.ips])).size

  console.log(`\n=== ${args.path} — last ${args.days} days (since ${dayKey(since)}) ===\n`)

  console.log('TRAFFIC (nginx access logs, bots excluded)')
  console.log(`  Page views      ${num(totalHits)}`)
  console.log(`  Unique visitors ${num(totalVisitors)}`)
  console.log(`  Bot requests    ${num(traffic.bots)} (excluded above)`)

  if (traffic.buckets.size > 0) {
    console.log('\n  By utm_content:')
    const rows = [...traffic.buckets.entries()].sort((a, b) => b[1].hits - a[1].hits)
    for (const [tag, b] of rows) {
      console.log(`    ${tag.padEnd(24)} ${String(num(b.hits)).padStart(7)} views  ${String(num(b.ips.size)).padStart(6)} visitors`)
    }
  }

  if (traffic.daily.size > 0) {
    console.log('\n  By day:')
    for (const [day, hits] of [...traffic.daily.entries()].sort()) {
      console.log(`    ${day}  ${String(num(hits)).padStart(6)}`)
    }
  }

  if (traffic.referers.size > 0) {
    console.log('\n  Top referrers:')
    for (const [host, hits] of [...traffic.referers.entries()].sort((a, b) => b[1] - a[1]).slice(0, 8)) {
      console.log(`    ${host.padEnd(32)} ${num(hits)}`)
    }
  }

  if (conversions) {
    console.log(`\nCONVERSIONS (source = ${args.source})`)
    console.log(`  Sign-ups in window  ${num(conversions.signups)}   (${pct(conversions.signups, totalVisitors)} of unique visitors)`)
    console.log(`  Sign-ups all time   ${num(conversions.all)}`)
    console.log(`  Made API calls      ${num(conversions.active)}   (${pct(conversions.active, conversions.signups)} of new sign-ups)`)
    console.log(`  Topped up balance   ${num(conversions.deposited)}`)
    console.log(`  API requests        ${num(conversions.requests)}`)
    console.log(`  Tokens used         ${num(conversions.tokens)}`)
  }

  for (const w of warnings) console.log(`\n!  ${w}`)
  console.log()
}

function writeCsv(file, { args, traffic, conversions }) {
  const rows = [['metric', 'segment', 'value']]
  for (const [tag, b] of traffic.buckets) {
    rows.push(['page_views', tag, b.hits], ['unique_visitors', tag, b.ips.size])
  }
  for (const [day, hits] of [...traffic.daily.entries()].sort()) {
    rows.push(['page_views_by_day', day, hits])
  }
  rows.push(['bot_requests', 'all', traffic.bots])
  if (conversions) {
    rows.push(
      ['signups_in_window', args.source, conversions.signups],
      ['signups_all_time', args.source, conversions.all],
      ['users_with_api_calls', args.source, conversions.active],
      ['users_with_deposit', args.source, conversions.deposited],
      ['api_requests', args.source, conversions.requests],
      ['tokens_used', args.source, conversions.tokens]
    )
  }
  const csv = rows.map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(',')).join('\n')
  writeFileSync(file, `${csv}\n`)
  console.log(`CSV written to ${file}\n`)
}

async function main() {
  const args = parseArgs(process.argv)
  const since = new Date(Date.now() - args.days * 24 * 60 * 60 * 1000)
  const warnings = []

  if (args.days > LOG_RETENTION_DAYS) {
    warnings.push(
      `nginx keeps only ~${LOG_RETENTION_DAYS} days of logs on ${SSH_TARGET}; traffic before that is not counted.`
    )
  }

  const lines = await fetchAccessLines(args.path, args.logfile)
  const traffic = summarizeTraffic(lines, { path: args.path, since })

  let conversions = null
  const { ADMIN_USERNAME, ADMIN_PASSWORD } = process.env
  if (ADMIN_USERNAME && ADMIN_PASSWORD) {
    try {
      const token = await adminLogin(ADMIN_USERNAME, ADMIN_PASSWORD)
      conversions = summarizeUsers(await fetchUsersBySource(token, args.source), since)
    } catch (error) {
      // Traffic is still worth printing, so this is a warning, not a failure.
      warnings.push(`Conversion data unavailable: ${error.message}`)
    }
  } else {
    warnings.push('ADMIN_USERNAME / ADMIN_PASSWORD not set — conversion section skipped.')
  }

  printReport({ args, since, traffic, conversions, warnings })
  if (args.csv) writeCsv(args.csv, { args, traffic, conversions })
}

main().catch((error) => {
  console.error(`\nReport failed: ${error.message}\n`)
  process.exit(1)
})

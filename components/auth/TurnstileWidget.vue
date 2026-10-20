<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'

// Cloudflare Turnstile in execute-on-demand mode. The parent calls getToken()
// right before each "send code" request and gets a fresh token back.
//
// Why on demand rather than solving once on mount: a Turnstile token is
// single-use and expires after 300s, and the modal can send twice (initial send
// + "Resend code" from the code step). Executing per send means every request
// carries a token that has never been used, so the backend's siteverify never
// rejects a legitimate resend as a replay.
//
// appearance=interaction-only keeps the widget invisible for normal visitors;
// Cloudflare only draws the checkbox when it actually needs a human to click.
//
// With no site key configured this renders nothing and getToken() resolves "",
// which the backend treats as "no challenge configured" — so dev and any
// environment without keys behave exactly as before.

// Safety net only, for a script that never calls back. When Cloudflare shows the
// interactive checkbox the user may take a while; Turnstile reports a genuinely
// abandoned challenge itself via timeout-callback. A short timer here would
// reject first and then discard the token from the user's late click.
const TOKEN_TIMEOUT_MS = 300_000

const config = useRuntimeConfig()
const siteKey = config.public.turnstileSiteKey as string
const enabled = computed(() => !!siteKey)

const container = ref<HTMLElement | null>(null)
let widgetId: string | null = null
let pending: { resolve: (t: string) => void; reject: (e: Error) => void } | null = null
let timer: ReturnType<typeof setTimeout> | null = null

function settle(fn: (p: NonNullable<typeof pending>) => void) {
  if (timer) {
    clearTimeout(timer)
    timer = null
  }
  const p = pending
  pending = null
  if (p) fn(p)
}

async function ensureWidget(): Promise<string> {
  if (widgetId) return widgetId
  await loadTurnstileScript()
  const ts = (window as any).turnstile
  if (!container.value) throw new Error('Turnstile container not mounted')
  widgetId = ts.render(container.value, {
    sitekey: siteKey,
    execution: 'execute',
    appearance: 'interaction-only',
    theme: 'dark',
    callback: (token: string) => settle((p) => p.resolve(token)),
    'error-callback': () => {
      settle((p) => p.reject(new Error('Human verification failed. Please try again.')))
      // Returning true tells Turnstile we handled it, so it doesn't also throw.
      return true
    },
    'expired-callback': () => settle((p) => p.reject(new Error('Verification expired. Please try again.'))),
    'timeout-callback': () => settle((p) => p.reject(new Error('Verification timed out. Please try again.')))
  }) as string
  return widgetId
}

async function getToken(): Promise<string> {
  if (!enabled.value) return ''
  const id = await ensureWidget()
  const ts = (window as any).turnstile
  // A previous caller still waiting would otherwise hang forever once we reset.
  settle((p) => p.reject(new Error('Verification superseded')))
  return new Promise<string>((resolve, reject) => {
    pending = { resolve, reject }
    timer = setTimeout(
      () => settle((p) => p.reject(new Error('Verification timed out. Please try again.'))),
      TOKEN_TIMEOUT_MS
    )
    // reset() discards any token from an earlier send; execute() starts a new
    // challenge whose result arrives via callback above.
    ts.reset(id)
    ts.execute(id)
  })
}

onMounted(() => {
  // Pre-warm so the first click doesn't wait on the script download.
  if (enabled.value) ensureWidget().catch(() => {})
})

onBeforeUnmount(() => {
  settle((p) => p.reject(new Error('Verification cancelled')))
  const ts = (window as any).turnstile
  if (widgetId && ts) ts.remove(widgetId)
  widgetId = null
})

defineExpose({ getToken })
</script>

<template>
  <!-- Empty until Cloudflare decides it needs an interactive check. -->
  <div v-if="enabled" ref="container" class="mt-4 flex justify-center empty:mt-0"></div>
</template>

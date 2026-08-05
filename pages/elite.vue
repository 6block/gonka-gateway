<template>
  <div class="el">
    <!-- Top bar (overlays the hero) -->
    <header class="el-topbar">
      <div class="el-topbar-inner">
        <NuxtLink to="/" class="el-brand" @click="tagSource">
          <span class="el-brand-dot"></span>GonkaRouter
        </NuxtLink>
        <NuxtLink to="/" class="el-back" @click="tagSource">Back to GonkaRouter</NuxtLink>
      </div>
    </header>

    <main class="el-main">
      <!-- ===================== HERO (cursor-reveal) ===================== -->
      <section ref="heroEl" class="el-hero">
        <!-- Base = barren rock; Reveal = the same ground, alive, shown only
             inside the soft circle that trails the cursor. -->
        <div class="el-hero-base hero-zoom" aria-hidden="true"></div>
        <div class="el-hero-reveal hero-zoom" aria-hidden="true"></div>
        <div class="el-hero-scrim" aria-hidden="true"></div>

        <div class="el-hero-content">
          <div class="el-hero-top">
            <span class="el-badge hero-anim hero-fade" style="animation-delay: 0.15s">
              <i class="el-badge-dot"></i>AI Research Elite Program
            </span>
            <h1 class="el-h1">
              <span class="hero-anim hero-reveal-line" style="animation-delay: 0.25s">Incubate The Next</span>
              <span class="hero-anim hero-reveal-line" style="animation-delay: 0.4s"><span class="el-grad">AI Research Elite</span></span>
            </h1>
            <p class="el-subtitle hero-anim hero-fade" style="animation-delay: 0.6s">
              8 Weeks Of Building, Powered By Free Inference Tokens
            </p>
          </div>

          <div class="el-hero-corner el-hero-left hero-anim hero-fade" style="animation-delay: 0.75s">
            <p class="el-lead">
              An 8-week online incubation plus two Hong Kong summits, hosted with
              PolyU Business School, Uweb Business School and Techub News. Every
              participant builds on Gonka Router with
              <span class="el-hl">free inference credits</span>.
            </p>
          </div>

          <div class="el-hero-corner el-hero-right hero-anim hero-fade" style="animation-delay: 0.9s">
            <p class="el-hero-hint">
              <LucideGraduationCap :size="13" /> Where research talent compounds
            </p>
            <div class="el-cta-row">
              <button type="button" class="el-btn el-btn-primary" @click="goRegister">Register</button>
              <a href="#apply" class="el-btn el-btn-ghost">Apply for more credits</a>
            </div>
          </div>
        </div>
      </section>

      <!-- ===================== PROGRAM FACTS ===================== -->
      <section class="el-wrap el-facts-wrap">
        <dl class="el-facts">
          <div v-for="fact in programFacts" :key="fact.label" class="el-fact">
            <dt class="el-fact-label">{{ fact.label }}</dt>
            <dd class="el-fact-value">{{ fact.value }}</dd>
          </div>
        </dl>
      </section>

      <!-- ===================== REWARDS ===================== -->
      <section class="el-wrap el-rewards">
        <div class="el-section-head">
          <span class="el-eyebrow">The Program</span>
          <h2 class="el-section-title">How participants earn credits</h2>
        </div>
        <div class="el-grid">
          <article v-for="(rule, i) in creditRules" :key="i" class="el-card">
            <div class="el-num" :data-step="i + 1">{{ String(i + 1).padStart(2, '0') }}</div>
            <span class="el-card-stage">{{ rule.stage }}</span>
            <h3 class="el-card-title">{{ rule.title }}</h3>
            <p class="el-card-text">{{ rule.text }}</p>
          </article>
        </div>
      </section>

      <!-- ===================== CLOSING ===================== -->
      <section class="el-wrap el-closing">
        <p class="el-closing-text">
          Research, build, and ship with <span class="el-grad">Gonka Router</span>.
        </p>
      </section>

      <!-- ===================== APPLY FORM ===================== -->
      <section id="apply" class="el-wrap el-apply-wrap">
        <div class="el-apply">
          <div class="el-apply-grid">
            <div class="el-apply-intro">
              <span class="el-eyebrow">More credits</span>
              <h2 class="el-apply-title">Apply for more credits</h2>
              <p class="el-apply-copy">
                Submit your registered email and a short note about your research
                project to apply for more credits.
              </p>
            </div>

            <div>
              <div v-if="status === 'success'" class="el-success">
                <div class="el-success-icon"><LucideCheck :size="26" /></div>
                <h3 class="el-success-title">Request sent.</h3>
                <p class="el-success-copy">The team will review your application soon.</p>
                <button type="button" class="el-success-again" @click="resetForm">Submit another →</button>
              </div>

              <form v-else class="el-form" novalidate @submit.prevent="submit">
                <div class="el-field">
                  <label class="el-label">Registered email</label>
                  <input
                    v-model="form.email"
                    type="email"
                    placeholder="you@example.com"
                    autocomplete="email"
                    class="el-input"
                    :class="{ 'el-input-error': errors.email }"
                  />
                  <p v-if="errors.email" class="el-err">{{ errors.email }}</p>
                </div>

                <div class="el-field">
                  <label class="el-label">Research notes</label>
                  <textarea
                    v-model="form.message"
                    rows="4"
                    placeholder="Tell us what you are researching or building, which model you use, and where extra credits would help."
                    class="el-input el-textarea"
                    :class="{ 'el-input-error': errors.message }"
                  ></textarea>
                  <p v-if="errors.message" class="el-err">{{ errors.message }}</p>
                </div>

                <div v-if="status === 'error'" class="el-error-banner">
                  <LucideAlertCircle :size="16" />
                  Something went wrong. Please try again.
                </div>

                <button type="submit" class="el-btn el-btn-primary el-submit" :disabled="status === 'submitting'">
                  <span v-if="status === 'submitting'" class="el-submit-loading">
                    <LucideLoader2 :size="16" class="el-spin" />
                    Sending…
                  </span>
                  <span v-else>Submit request</span>
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </main>
  </div>
</template>

<script setup>
import { reactive, ref, onMounted, onBeforeUnmount } from 'vue'
import {
  LucideCheck,
  LucideLoader2,
  LucideAlertCircle,
  LucideGraduationCap
} from 'lucide-vue-next'
import { useLoginModal } from '~/composables/useLoginModal'
import { useSignupSource } from '~/composables/useSignupSource'

// Standalone page: no app header/footer. It carries its own top bar.
definePageMeta({ layout: false })

// Campaign attribution tag for everyone who signs up through this page.
const ELITE_SOURCE = 'elite'

const config = useRuntimeConfig()
const siteUrl = config.public.siteUrl || 'https://gonkarouter.io'

useSeoMeta({
  title: 'AI Research Elite Program — Build on Gonka Router',
  description:
    'An 8-week AI investment-research incubation with two Hong Kong summits. Participants build on Gonka Router with free inference token support.',
  ogTitle: 'Incubate The Next AI Research Elite',
  ogDescription: '8 weeks of building, powered by free inference tokens on Gonka Router.',
  ogUrl: `${siteUrl}/elite`
})
useHead({ link: [{ rel: 'canonical', href: `${siteUrl}/elite` }] })

const router = useRouter()
const { open: openLoginModal } = useLoginModal()
const signupSource = useSignupSource()

// Tag this browser as an Elite-program visitor. Any registration that follows
// in this session is attributed to `elite` and stored on the new user record
// for reporting.
const tagSource = () => {
  signupSource.set(ELITE_SOURCE)
}

const goRegister = async () => {
  tagSource()
  await router.push('/')
  openLoginModal()
}

const programFacts = [
  { label: 'Incubation', value: '8 weeks online' },
  { label: 'Summits', value: '2 in Hong Kong' },
  { label: 'Participants', value: '~50 selected' },
  { label: 'Elite track', value: '~10 finalists' }
]

const creditRules = [
  {
    stage: 'Week 0',
    title: 'Join the program',
    text: 'Register with your program email, create an API key, and complete your first real API call to get $20.'
  },
  {
    stage: 'Week 1–8',
    title: 'Ship weekly missions',
    text: 'Keep running your research workflows on Gonka Router through the weekly tasks to unlock another $20.'
  },
  {
    stage: 'Demo day',
    title: 'Show your work',
    text: 'Present your AI research workflow or tool demo at the summits. Selected demos earn extra credits.'
  },
  {
    stage: 'Elite track',
    title: 'Go further',
    text: 'Finalists move onto the elite track with dedicated credit support for turning the work into a real product.'
  }
]

// ---- Apply form (reuses the /feedback API endpoint) ----
const defaultForm = () => ({ email: '', message: '' })
const form = reactive(defaultForm())
const errors = ref({})
const status = ref('idle') // idle | submitting | success | error

const apiBase = (config.public.apiBase || '').replace(/\/$/, '')

const validate = () => {
  const e = {}
  if (!form.email.trim()) {
    e.email = 'Email is required.'
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
    e.email = 'Please enter a valid email address.'
  }
  if (!form.message.trim()) {
    e.message = 'Research notes are required.'
  } else if (form.message.trim().length < 10) {
    e.message = 'Please add at least 10 characters.'
  }
  return e
}

const submit = async () => {
  errors.value = validate()
  if (Object.keys(errors.value).length > 0) return
  if (!apiBase) {
    status.value = 'error'
    return
  }

  status.value = 'submitting'
  try {
    // Same endpoint and shape as /feedback. Topic is fixed to 'elite'.
    await $fetch(`${apiBase}/api/feedback`, {
      method: 'POST',
      body: {
        name: 'Elite Applicant',
        email: form.email.trim(),
        topic: 'elite',
        model: 'Not model specific',
        message: form.message.trim(),
        image: ''
      },
      timeout: 15000
    })
    status.value = 'success'
  } catch {
    status.value = 'error'
  }
}

const resetForm = () => {
  Object.assign(form, defaultForm())
  errors.value = {}
  status.value = 'idle'
}

// ============================================================================
// Cursor-reveal spotlight — the second (lush) image is shown only inside a soft
// circle that eases toward the pointer. Implemented with a CSS radial-gradient
// mask driven by two custom properties (cheap; no per-frame canvas encoding).
// On touch / reduced-motion the alive image is simply revealed in full.
// ============================================================================
const heroEl = ref(null)
const raw = { x: -1000, y: -1000 }
const smooth = { x: -1000, y: -1000 }
let raf = 0

function onMove(e) {
  const el = heroEl.value
  if (!el) return
  const rect = el.getBoundingClientRect()
  raw.x = e.clientX - rect.left
  raw.y = e.clientY - rect.top
}

function loop() {
  smooth.x += (raw.x - smooth.x) * 0.14
  smooth.y += (raw.y - smooth.y) * 0.14
  const el = heroEl.value
  if (el) {
    el.style.setProperty('--mx', smooth.x + 'px')
    el.style.setProperty('--my', smooth.y + 'px')
  }
  raf = requestAnimationFrame(loop)
}

onMounted(() => {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const coarse = window.matchMedia('(hover: none), (pointer: coarse)').matches
  if (reduce || coarse) {
    // No pointer to follow → reveal the alive version outright.
    heroEl.value?.classList.add('el-hero-revealed')
    return
  }
  window.addEventListener('pointermove', onMove, { passive: true })
  raf = requestAnimationFrame(loop)
})

onBeforeUnmount(() => {
  cancelAnimationFrame(raf)
  window.removeEventListener('pointermove', onMove)
})
</script>

<style scoped>
/* ============================================================================
   ELITE — AI research incubation landing. Shares the cursor-reveal hero
   mechanic with /fff but runs a warm gold/amber accent so the two campaign
   pages read as siblings, not duplicates.
   ========================================================================== */
.el {
  --el-bg: #07060a;
  --el-text: #f8f5f0;
  --el-muted: rgba(240, 234, 224, 0.62);
  --el-accent: #f7cb6b;
  --el-accent-2: #ffa46b;
  --el-ink: #17110a;
  --el-glass: rgba(255, 255, 255, 0.045);
  --el-glass-line: rgba(255, 255, 255, 0.1);
  --el-maxw: 1120px;
  --el-contentw: 960px;

  position: relative;
  isolation: isolate;
  overflow: hidden;
  min-height: 100vh;
  padding-bottom: clamp(4rem, 3rem + 4vw, 6.5rem);
  background: var(--el-bg);
  color: var(--el-text);
  font-family: 'Inter', system-ui, sans-serif;
}

/* ---------- TOP BAR (over hero) ---------- */
.el-topbar {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  z-index: 30;
}
.el-topbar-inner {
  max-width: var(--el-maxw);
  margin: 0 auto;
  min-height: 66px;
  padding: 0 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 18px;
}
.el-brand {
  display: inline-flex;
  align-items: center;
  gap: 9px;
  font-family: 'Plus Jakarta Sans', Inter, sans-serif;
  font-weight: 900;
  font-size: 21px;
  letter-spacing: -0.03em;
  color: var(--el-text);
  text-decoration: none;
}
.el-brand-dot {
  width: 9px;
  height: 9px;
  border-radius: 999px;
  background: var(--el-accent);
  box-shadow: 0 0 14px rgba(247, 203, 107, 0.9);
  animation: el-pulse 2.4s ease-in-out infinite;
}
.el-back {
  display: inline-flex;
  align-items: center;
  min-height: 38px;
  padding: 0 16px;
  border-radius: 999px;
  border: 1px solid var(--el-glass-line);
  background: rgba(10, 8, 6, 0.35);
  backdrop-filter: blur(10px);
  color: rgba(248, 245, 240, 0.82);
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  white-space: nowrap;
  text-decoration: none;
  transition: color 0.2s ease, background 0.2s ease, border-color 0.2s ease;
}
.el-back:hover {
  color: var(--el-ink);
  background: var(--el-accent);
  border-color: var(--el-accent);
}
@media (max-width: 560px) {
  .el-topbar-inner { min-height: 56px; padding: 0 16px; gap: 10px; }
  .el-brand { font-size: 18px; }
  .el-back { min-height: 34px; padding: 0 12px; font-size: 10.5px; letter-spacing: 0.05em; }
}

/* ---------- HERO ---------- */
.el-hero {
  --mx: -1000px;
  --my: -1000px;
  --r: clamp(180px, 22vw, 300px);
  position: relative;
  width: 100%;
  height: 100vh;
  height: 100svh;
  min-height: 620px;
  overflow: hidden;
  background: #000;
}
.el-hero-base,
.el-hero-reveal {
  position: absolute;
  inset: 0;
  background-position: center;
  background-size: cover;
  background-repeat: no-repeat;
  will-change: transform;
}
.el-hero-base {
  z-index: 1;
  background-image: url('/fff-rock-base.webp');
}
.el-hero-reveal {
  z-index: 2;
  background-image: url('/fff-rock-lush.webp');
  /* Reveal only inside the soft, cursor-trailing circle. */
  -webkit-mask-image: radial-gradient(
    circle var(--r) at var(--mx) var(--my),
    #000 0%,
    #000 38%,
    rgba(0, 0, 0, 0.78) 58%,
    rgba(0, 0, 0, 0.42) 74%,
    rgba(0, 0, 0, 0.14) 88%,
    transparent 100%
  );
  mask-image: radial-gradient(
    circle var(--r) at var(--mx) var(--my),
    #000 0%,
    #000 38%,
    rgba(0, 0, 0, 0.78) 58%,
    rgba(0, 0, 0, 0.42) 74%,
    rgba(0, 0, 0, 0.14) 88%,
    transparent 100%
  );
}
/* Touch / reduced-motion: show the alive version outright. */
.el-hero-revealed .el-hero-reveal {
  -webkit-mask-image: none;
  mask-image: none;
}
/* Scrim keeps the top headline legible, plus a warm wash so the gold accent
   sits on the imagery instead of fighting it. */
.el-hero-scrim {
  position: absolute;
  inset: 0;
  z-index: 3;
  pointer-events: none;
  background: linear-gradient(to bottom, rgba(0, 0, 0, 0.58), transparent 30%),
    radial-gradient(120% 80% at 50% 120%, rgba(0, 0, 0, 0.55), transparent 60%),
    linear-gradient(180deg, rgba(90, 55, 10, 0.16), rgba(20, 10, 0, 0.2));
}

.el-hero-content {
  position: absolute;
  inset: 0;
  z-index: 10;
  pointer-events: none;
}
.el-hero-top {
  position: absolute;
  top: clamp(96px, 15vh, 170px);
  left: 0;
  right: 0;
  padding: 0 20px;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.el-hero-corner {
  position: absolute;
  bottom: clamp(28px, 6vh, 72px);
  max-width: 320px;
}
.el-hero-left {
  left: clamp(20px, 5vw, 56px);
}
.el-hero-right {
  right: clamp(20px, 5vw, 56px);
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 16px;
}
.el-hero-hint {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  margin: 0;
  color: rgba(248, 245, 240, 0.72);
  font-family: 'JetBrains Mono', ui-monospace, monospace;
  font-size: 11px;
  letter-spacing: 0.06em;
  text-transform: uppercase;
}
@media (max-width: 767px) {
  .el-hero-left { display: none; }
  .el-hero-right {
    left: clamp(20px, 5vw, 56px);
    right: clamp(20px, 5vw, 56px);
    max-width: none;
  }
  .el-hero-hint { display: none; }
}

.el-badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 7px 15px;
  border-radius: 999px;
  border: 1px solid rgba(247, 203, 107, 0.32);
  background: rgba(247, 203, 107, 0.1);
  backdrop-filter: blur(8px);
  color: var(--el-accent);
  font-family: 'JetBrains Mono', ui-monospace, monospace;
  font-size: 11.5px;
  font-weight: 700;
  letter-spacing: 0.16em;
  text-transform: uppercase;
}
.el-badge-dot {
  width: 6px;
  height: 6px;
  border-radius: 999px;
  background: var(--el-accent);
  box-shadow: 0 0 10px rgba(247, 203, 107, 0.9);
  animation: el-pulse 2s ease-in-out infinite;
}
.el-h1 {
  margin: 22px 0 0;
  font-family: 'Plus Jakarta Sans', Inter, sans-serif;
  font-weight: 800;
  font-size: clamp(2.4rem, 1rem + 6vw, 5.2rem);
  line-height: 0.98;
  letter-spacing: -0.04em;
  text-shadow: 0 2px 40px rgba(0, 0, 0, 0.5);
}
.el-h1 span {
  display: block;
}
.el-grad {
  display: inline;
  background: linear-gradient(110deg, var(--el-accent), var(--el-accent-2) 60%, #ffd9a8);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}
.el-subtitle {
  margin: 18px 0 0;
  font-family: 'Plus Jakarta Sans', Inter, sans-serif;
  font-weight: 700;
  font-size: clamp(1.05rem, 0.9rem + 0.85vw, 1.45rem);
  letter-spacing: -0.01em;
  color: var(--el-text);
  text-shadow: 0 2px 20px rgba(0, 0, 0, 0.6);
}
.el-lead {
  margin: 0;
  font-size: 14px;
  line-height: 1.6;
  color: rgba(248, 245, 240, 0.82);
  text-shadow: 0 1px 16px rgba(0, 0, 0, 0.8);
}
.el-hl {
  color: var(--el-accent);
  font-weight: 600;
}
.el-cta-row {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  pointer-events: auto;
}

/* ---------- BUTTONS ---------- */
.el-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 48px;
  padding: 0 24px;
  border-radius: 999px;
  font-size: 12.5px;
  font-weight: 800;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  cursor: pointer;
  border: 1px solid transparent;
  transition: transform 0.2s ease, box-shadow 0.25s ease, background 0.2s ease,
    border-color 0.2s ease, color 0.2s ease;
}
.el-btn-primary {
  background: linear-gradient(120deg, var(--el-accent), var(--el-accent-2));
  color: var(--el-ink);
  box-shadow: 0 10px 34px rgba(247, 203, 107, 0.3);
}
.el-btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 14px 46px rgba(247, 203, 107, 0.45);
}
.el-btn-primary:active {
  transform: scale(0.98);
}
.el-btn-ghost {
  background: rgba(14, 11, 8, 0.42);
  border-color: var(--el-glass-line);
  color: var(--el-text);
  backdrop-filter: blur(10px);
}
.el-btn-ghost:hover {
  border-color: rgba(247, 203, 107, 0.45);
  background: rgba(247, 203, 107, 0.1);
}

/* ---------- SECTION HEAD ---------- */
.el-section-head {
  text-align: center;
  margin-bottom: clamp(1.8rem, 1rem + 2vw, 2.6rem);
}
.el-eyebrow {
  display: inline-block;
  font-family: 'JetBrains Mono', ui-monospace, monospace;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: var(--el-accent);
}
.el-section-title {
  margin: 12px 0 0;
  font-family: 'Plus Jakarta Sans', Inter, sans-serif;
  font-weight: 800;
  font-size: clamp(1.7rem, 1.1rem + 2vw, 2.6rem);
  letter-spacing: -0.03em;
}

/* Content sections sit in a narrower, centered column (the hero stays
   full-bleed) so the page reads as a focused landing, not a wide dashboard. */
.el-wrap {
  width: 100%;
  max-width: var(--el-contentw);
  margin: 0 auto;
  padding-left: 24px;
  padding-right: 24px;
}

/* ---------- PROGRAM FACTS ---------- */
.el-facts-wrap {
  padding-top: clamp(2.5rem, 1.5rem + 3vw, 4rem);
}
.el-facts {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1px;
  margin: 0;
  border: 1px solid var(--el-glass-line);
  border-radius: 20px;
  overflow: hidden;
  background: var(--el-glass-line);
}
@media (min-width: 768px) {
  .el-facts { grid-template-columns: repeat(4, minmax(0, 1fr)); }
}
.el-fact {
  padding: 20px 18px;
  background: var(--el-bg);
}
.el-fact-label {
  margin: 0;
  font-family: 'JetBrains Mono', ui-monospace, monospace;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: rgba(248, 245, 240, 0.45);
}
.el-fact-value {
  margin: 10px 0 0;
  font-family: 'Plus Jakarta Sans', Inter, sans-serif;
  font-weight: 800;
  font-size: clamp(1rem, 0.85rem + 0.5vw, 1.25rem);
  letter-spacing: -0.02em;
  color: var(--el-text);
}

/* ---------- REWARDS GRID ---------- */
.el-rewards {
  padding-top: clamp(3rem, 2rem + 3.5vw, 5rem);
}
.el-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 16px;
}
@media (min-width: 640px) {
  .el-grid {
    grid-template-columns: 1fr 1fr;
  }
}
.el-card {
  position: relative;
  overflow: hidden;
  padding: 24px 22px 26px;
  border-radius: 22px;
  background: var(--el-glass);
  border: 1px solid var(--el-glass-line);
  backdrop-filter: blur(14px);
  box-shadow: 0 20px 44px rgba(0, 0, 0, 0.38), inset 0 1px 0 rgba(255, 255, 255, 0.06);
  transition: transform 0.28s cubic-bezier(0.16, 1, 0.3, 1), border-color 0.28s ease,
    box-shadow 0.28s ease;
}
.el-card::after {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: inherit;
  background: radial-gradient(120% 80% at 50% -10%, rgba(247, 203, 107, 0.14), transparent 60%);
  opacity: 0;
  transition: opacity 0.28s ease;
  pointer-events: none;
}
.el-card:hover {
  transform: translateY(-6px);
  border-color: rgba(247, 203, 107, 0.35);
  box-shadow: 0 30px 60px rgba(0, 0, 0, 0.5), 0 0 40px rgba(247, 203, 107, 0.14);
}
.el-card:hover::after {
  opacity: 1;
}
.el-num {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 46px;
  height: 46px;
  border-radius: 14px;
  font-family: 'JetBrains Mono', ui-monospace, monospace;
  font-size: 14px;
  font-weight: 800;
  color: var(--el-ink);
  background: linear-gradient(135deg, var(--el-accent), #f0b04d);
  box-shadow: 0 8px 20px rgba(247, 203, 107, 0.28);
}
.el-num[data-step='2'] {
  background: linear-gradient(135deg, #ffb07a, #f4894f);
  box-shadow: 0 8px 20px rgba(255, 176, 122, 0.3);
}
.el-num[data-step='3'] {
  background: linear-gradient(135deg, #c3a6ff, #9b7bf0);
  box-shadow: 0 8px 20px rgba(195, 166, 255, 0.28);
}
.el-num[data-step='4'] {
  background: linear-gradient(135deg, #ffe3a8, #ffc46b);
  box-shadow: 0 8px 20px rgba(255, 227, 168, 0.28);
}
.el-card-stage {
  display: block;
  margin: 18px 0 0;
  font-family: 'JetBrains Mono', ui-monospace, monospace;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--el-accent);
}
.el-card-title {
  margin: 8px 0 0;
  font-family: 'Plus Jakarta Sans', Inter, sans-serif;
  font-weight: 800;
  font-size: 18px;
  letter-spacing: -0.02em;
  color: var(--el-text);
}
.el-card-text {
  margin: 8px 0 0;
  font-size: 14px;
  line-height: 1.55;
  color: var(--el-muted);
}

/* ---------- CLOSING ---------- */
.el-closing {
  margin-top: clamp(3.5rem, 2rem + 4vw, 6.5rem);
  text-align: center;
}
.el-closing-text {
  max-width: 20ch;
  margin: 0 auto;
  padding: clamp(2.5rem, 1.5rem + 3vw, 4rem) 0;
  border-top: 1px solid var(--el-glass-line);
  border-bottom: 1px solid var(--el-glass-line);
  font-family: 'Plus Jakarta Sans', Inter, sans-serif;
  font-weight: 800;
  font-size: clamp(2rem, 1rem + 4.2vw, 3.6rem);
  line-height: 1.04;
  letter-spacing: -0.035em;
}

/* ---------- APPLY ---------- */
.el-apply-wrap {
  margin-top: clamp(3rem, 2rem + 3vw, 5rem);
  scroll-margin-top: 90px;
}
.el-apply {
  position: relative;
  overflow: hidden;
  border-radius: 30px;
  padding: clamp(24px, 3.5vw, 44px);
  background: linear-gradient(135deg, rgba(247, 203, 107, 0.1), rgba(0, 0, 0, 0) 40%),
    var(--el-glass);
  border: 1px solid var(--el-glass-line);
  backdrop-filter: blur(16px);
  box-shadow: 0 40px 90px rgba(0, 0, 0, 0.5);
}
.el-apply-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: clamp(24px, 4vw, 48px);
  align-items: center;
}
@media (min-width: 1024px) {
  .el-apply-grid {
    grid-template-columns: minmax(0, 0.82fr) minmax(360px, 0.66fr);
  }
}
.el-apply-title {
  margin: 12px 0 0;
  font-family: 'Plus Jakarta Sans', Inter, sans-serif;
  font-weight: 800;
  font-size: clamp(1.9rem, 1.2rem + 2.4vw, 2.9rem);
  line-height: 1.02;
  letter-spacing: -0.03em;
}
.el-apply-copy {
  margin: 14px 0 0;
  max-width: 24rem;
  font-size: 15px;
  line-height: 1.62;
  color: var(--el-muted);
}

/* ---------- FORM ---------- */
.el-form {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.el-field {
  display: flex;
  flex-direction: column;
}
.el-label {
  font-family: 'JetBrains Mono', ui-monospace, monospace;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: rgba(248, 245, 240, 0.5);
  margin-bottom: 9px;
}
.el-input {
  width: 100%;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid var(--el-glass-line);
  border-radius: 14px;
  padding: 14px 15px;
  font-family: 'Inter', system-ui, sans-serif;
  font-size: 15px;
  font-weight: 500;
  color: var(--el-text);
  transition: border-color 0.2s ease, box-shadow 0.2s ease, background 0.2s ease;
}
.el-input::placeholder {
  color: rgba(248, 245, 240, 0.34);
}
.el-input:focus {
  outline: none;
  background: rgba(255, 255, 255, 0.08);
  border-color: rgba(247, 203, 107, 0.55);
  box-shadow: 0 0 0 3px rgba(247, 203, 107, 0.15);
}
.el-textarea {
  resize: vertical;
  min-height: 128px;
  line-height: 1.5;
}
.el-input-error {
  border-color: rgba(248, 113, 113, 0.6);
}
.el-err {
  color: #fca5a5;
  font-size: 12px;
  margin: 6px 0 0;
}
.el-error-banner {
  display: flex;
  align-items: center;
  gap: 12px;
  color: #fca5a5;
  font-size: 14px;
  background: rgba(239, 68, 68, 0.12);
  border: 1px solid rgba(239, 68, 68, 0.24);
  border-radius: 14px;
  padding: 12px 16px;
}
.el-submit {
  width: 100%;
  margin-top: 4px;
}
.el-submit:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
.el-submit-loading {
  display: inline-flex;
  align-items: center;
  gap: 8px;
}
.el-spin {
  animation: el-spin 0.8s linear infinite;
}

/* ---------- SUCCESS ---------- */
.el-success {
  text-align: center;
  padding: 44px 0;
}
.el-success-icon {
  width: 56px;
  height: 56px;
  margin: 0 auto 20px;
  border-radius: 18px;
  background: linear-gradient(120deg, var(--el-accent), var(--el-accent-2));
  color: var(--el-ink);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 12px 30px rgba(247, 203, 107, 0.3);
}
.el-success-title {
  font-family: 'Plus Jakarta Sans', Inter, sans-serif;
  font-weight: 800;
  font-size: 20px;
  margin: 0 0 8px;
}
.el-success-copy {
  color: var(--el-muted);
  font-size: 14px;
  margin: 0;
}
.el-success-again {
  margin-top: 24px;
  background: none;
  border: none;
  color: var(--el-accent);
  font-size: 12px;
  font-weight: 700;
  cursor: pointer;
}
.el-success-again:hover {
  text-decoration: underline;
}

/* ---------- Motion ---------- */
.hero-anim {
  opacity: 0;
  animation-fill-mode: forwards;
  animation-timing-function: cubic-bezier(0.16, 1, 0.3, 1);
}
.hero-reveal-line {
  animation-name: el-hero-reveal;
  animation-duration: 1.1s;
}
.hero-fade {
  animation-name: el-hero-fade;
  animation-duration: 1s;
}
.hero-zoom {
  animation: el-hero-zoom 1.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}
@keyframes el-hero-reveal {
  0% { opacity: 0; transform: translateY(26px); filter: blur(12px); }
  100% { opacity: 1; transform: translateY(0); filter: blur(0); }
}
@keyframes el-hero-fade {
  0% { opacity: 0; transform: translateY(18px); }
  100% { opacity: 1; transform: translateY(0); }
}
@keyframes el-hero-zoom {
  0% { transform: scale(1.12); }
  100% { transform: scale(1); }
}
@keyframes el-pulse {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.5; transform: scale(0.8); }
}
@keyframes el-spin {
  to { transform: rotate(360deg); }
}
@media (prefers-reduced-motion: reduce) {
  .hero-anim,
  .hero-zoom { animation: none; opacity: 1; }
  .el-card,
  .el-btn,
  .el-input,
  .el-card:hover,
  .el-btn-primary:hover { transition: none; transform: none; }
  .el-brand-dot,
  .el-badge-dot,
  .el-spin { animation: none; }
}
</style>

<template>
  <div ref="rootEl" class="icg">
    <!-- Top bar (overlays the hero) -->
    <header class="icg-topbar">
      <div class="icg-topbar-inner">
        <NuxtLink to="/" class="icg-brand" @click="tagSource">
          <span class="icg-brand-dot"></span>GonkaRouter
        </NuxtLink>
        <NuxtLink to="/" class="icg-back" @click="tagSource">Back to GonkaRouter</NuxtLink>
      </div>
    </header>

    <main class="icg-main">
      <!-- ===================== HERO (cursor-reveal) ===================== -->
      <section ref="heroEl" class="icg-hero">
        <!-- Base = barren rock; Reveal = the same ground, alive, shown only
             inside the soft circle that trails the cursor. -->
        <div class="icg-hero-base hero-zoom" aria-hidden="true"></div>
        <div class="icg-hero-reveal hero-zoom" aria-hidden="true"></div>
        <div class="icg-hero-scrim" aria-hidden="true"></div>

        <div class="icg-hero-content">
          <div class="icg-hero-top">
            <span class="icg-badge hero-anim hero-fade" style="animation-delay: 0.15s">
              <i class="icg-badge-dot"></i>ICG Community Exclusive
            </span>
            <h1 class="icg-h1">
              <span class="hero-anim hero-reveal-line" style="animation-delay: 0.25s">Build Your AI Product</span>
              <span class="hero-anim hero-reveal-line" style="animation-delay: 0.4s">With <span class="icg-grad">Gonka Router</span></span>
            </h1>
            <p class="icg-subtitle hero-anim hero-fade" style="animation-delay: 0.6s">
              Extra Free Inference Credits for ICG Builders
            </p>
          </div>

          <div class="icg-hero-corner icg-hero-left hero-anim hero-fade" style="animation-delay: 0.75s">
            <p class="icg-lead">
              ICG builders get everything in our standard credit program, plus an
              <span class="icg-hl">extra $20 in credits</span> reserved just for the ICG community.
            </p>
          </div>

          <div class="icg-hero-corner icg-hero-right hero-anim hero-fade" style="animation-delay: 0.9s">
            <p class="icg-hero-hint">
              <LucideSprout :size="13" /> Referred by ICG
            </p>
            <div class="icg-cta-row">
              <button type="button" class="icg-btn icg-btn-primary" @click="goRegister">Register</button>
              <a href="#apply" class="icg-btn icg-btn-ghost">Claim ICG credits</a>
            </div>
          </div>
        </div>
      </section>

      <!-- ===================== REWARDS ===================== -->
      <section class="icg-wrap icg-rewards">
        <div class="icg-section-head">
          <span class="icg-eyebrow">The Program</span>
          <h2 class="icg-section-title">How ICG builders earn credits</h2>
        </div>
        <div class="icg-grid">
          <article v-for="(rule, i) in creditRules" :key="i" class="icg-card">
            <div class="icg-num" :data-step="i + 1">{{ String(i + 1).padStart(2, '0') }}</div>
            <h3 class="icg-card-title">{{ rule.title }}</h3>
            <p class="icg-card-text">{{ rule.text }}</p>
          </article>
        </div>
      </section>

      <!-- ===================== CLOSING ===================== -->
      <section class="icg-wrap icg-closing">
        <p class="icg-closing-text">
          Test, ship, and scale your project with <span class="icg-grad">Gonka Router</span>.
        </p>
      </section>

      <!-- ===================== APPLY FORM ===================== -->
      <section id="apply" class="icg-wrap icg-apply-wrap">
        <div class="icg-apply">
          <div class="icg-apply-grid">
            <div class="icg-apply-intro">
              <span class="icg-eyebrow">ICG bonus</span>
              <h2 class="icg-apply-title">Claim your ICG credits</h2>
              <p class="icg-apply-copy">
                Register first, then submit your registered email and a short note about your project.
                The team reviews every request and adds your ICG credits to your account.
              </p>
            </div>

            <div>
              <div v-if="status === 'success'" class="icg-success">
                <div class="icg-success-icon"><LucideCheck :size="26" /></div>
                <h3 class="icg-success-title">Request sent.</h3>
                <p class="icg-success-copy">The team will review your application soon.</p>
                <button type="button" class="icg-success-again" @click="resetForm">Submit another →</button>
              </div>

              <form v-else class="icg-form" novalidate @submit.prevent="submit">
                <div class="icg-field">
                  <label class="icg-label">Registered email</label>
                  <input
                    v-model="form.email"
                    type="email"
                    placeholder="you@example.com"
                    autocomplete="email"
                    class="icg-input"
                    :class="{ 'icg-input-error': errors.email }"
                  />
                  <p v-if="errors.email" class="icg-err">{{ errors.email }}</p>
                </div>

                <div class="icg-field">
                  <label class="icg-label">Build notes</label>
                  <textarea
                    v-model="form.message"
                    rows="4"
                    placeholder="Tell us what you are building, which model you use, and where extra credits would help."
                    class="icg-input icg-textarea"
                    :class="{ 'icg-input-error': errors.message }"
                  ></textarea>
                  <p v-if="errors.message" class="icg-err">{{ errors.message }}</p>
                </div>

                <div v-if="status === 'error'" class="icg-error-banner">
                  <LucideAlertCircle :size="16" />
                  Something went wrong. Please try again.
                </div>

                <button type="submit" class="icg-btn icg-btn-primary icg-submit" :disabled="status === 'submitting'">
                  <span v-if="status === 'submitting'" class="icg-submit-loading">
                    <LucideLoader2 :size="16" class="icg-spin" />
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
  LucideSprout
} from 'lucide-vue-next'
import { useLoginModal } from '~/composables/useLoginModal'
import { useSignupSource } from '~/composables/useSignupSource'

// Standalone page: no app header/footer. It carries its own top bar.
definePageMeta({ layout: false })

// Campaign attribution tag for everyone who signs up through this page.
const ICG_SOURCE = 'icg'

const config = useRuntimeConfig()
const siteUrl = config.public.siteUrl || 'https://gonkarouter.io'

useSeoMeta({
  title: 'Build Your AI Product With Gonka Router — ICG Community',
  description:
    'ICG community exclusive: build your AI product on Gonka Router and get an extra $20 in free inference credits on top of the standard program.',
  ogTitle: 'Build Your AI Product With Gonka Router',
  ogDescription: 'Extra free inference credits for ICG builders.',
  ogUrl: `${siteUrl}/icg`
})
useHead({ link: [{ rel: 'canonical', href: `${siteUrl}/icg` }] })

const router = useRouter()
const { open: openLoginModal } = useLoginModal()
const signupSource = useSignupSource()

// Tag this browser as an ICG visitor. Any registration that follows within the
// attribution window is stored on the new user record as source 'icg'.
const tagSource = () => {
  signupSource.set(ICG_SOURCE)
}

const goRegister = async () => {
  tagSource()
  await router.push('/')
  openLoginModal()
}

const creditRules = [
  {
    title: 'ICG welcome bonus',
    text: 'Register through this page and claim below to receive an extra $20 reserved for the ICG community.'
  },
  {
    title: 'First call bonus',
    text: 'Register, create an API key, and complete your first real API call to get $20.'
  },
  {
    title: 'Stay active',
    text: 'Actively use Gonka Router within 30 days to unlock another $20.'
  },
  {
    title: 'Hit milestones',
    text: 'Keep using Gonka Router and unlock more credits at the 60, 90, and 120-day milestones.'
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
    e.message = 'Build notes are required.'
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
    // Same endpoint and shape as /feedback. Topic is fixed to 'icg' so these
    // credit claims can be picked out in the admin feedback list for review.
    await $fetch(`${apiBase}/api/feedback`, {
      method: 'POST',
      body: {
        name: 'ICG Applicant',
        email: form.email.trim(),
        topic: 'icg',
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
const rootEl = ref(null)
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
  // Tag on arrival, not only on the Register button: a partner visitor who
  // wanders to the home page and signs up from the nav must still count as ICG.
  tagSource()

  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const coarse = window.matchMedia('(hover: none), (pointer: coarse)').matches
  if (reduce || coarse) {
    // No pointer to follow → reveal the alive version outright.
    heroEl.value?.classList.add('icg-hero-revealed')
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
   ICG — partner landing page, cloned from /fff. Cursor-reveal hero. A barren volcanic ground (base image) blooms into
   moss + wildflowers (reveal image) inside a soft light that trails the cursor.
   Brand-dark palette; Gonka green for UI accents. Editorial full-screen hero,
   then reward grid + glass apply form below.
   ========================================================================== */
.icg {
  --ig-bg: #04070a;
  --ig-text: #f4f8f6;
  --ig-muted: rgba(228, 240, 235, 0.62);
  --ig-accent: #00ffa3;
  --ig-accent-2: #34e7c6;
  --ig-ink: #04130d;
  --ig-glass: rgba(255, 255, 255, 0.045);
  --ig-glass-line: rgba(255, 255, 255, 0.1);
  --ig-maxw: 1120px;
  --ig-contentw: 960px;

  position: relative;
  isolation: isolate;
  overflow: hidden;
  min-height: 100vh;
  padding-bottom: clamp(4rem, 3rem + 4vw, 6.5rem);
  background: var(--ig-bg);
  color: var(--ig-text);
  font-family: 'Inter', system-ui, sans-serif;
}

/* ---------- TOP BAR (over hero) ---------- */
.icg-topbar {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  z-index: 30;
}
.icg-topbar-inner {
  max-width: var(--ig-maxw);
  margin: 0 auto;
  min-height: 66px;
  padding: 0 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 18px;
}
.icg-brand {
  display: inline-flex;
  align-items: center;
  gap: 9px;
  font-family: 'Plus Jakarta Sans', Inter, sans-serif;
  font-weight: 900;
  font-size: 21px;
  letter-spacing: -0.03em;
  color: var(--ig-text);
  text-decoration: none;
}
.icg-brand-dot {
  width: 9px;
  height: 9px;
  border-radius: 999px;
  background: var(--ig-accent);
  box-shadow: 0 0 14px rgba(0, 255, 163, 0.9);
  animation: icg-pulse 2.4s ease-in-out infinite;
}
.icg-back {
  display: inline-flex;
  align-items: center;
  min-height: 38px;
  padding: 0 16px;
  border-radius: 999px;
  border: 1px solid var(--ig-glass-line);
  background: rgba(7, 11, 14, 0.35);
  backdrop-filter: blur(10px);
  color: rgba(244, 248, 246, 0.82);
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  white-space: nowrap;
  text-decoration: none;
  transition: color 0.2s ease, background 0.2s ease, border-color 0.2s ease;
}
.icg-back:hover {
  color: var(--ig-ink);
  background: var(--ig-accent);
  border-color: var(--ig-accent);
}
@media (max-width: 560px) {
  .icg-topbar-inner { min-height: 56px; padding: 0 16px; gap: 10px; }
  .icg-brand { font-size: 18px; }
  .icg-back { min-height: 34px; padding: 0 12px; font-size: 10.5px; letter-spacing: 0.05em; }
}

/* ---------- HERO ---------- */
.icg-hero {
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
.icg-hero-base,
.icg-hero-reveal {
  position: absolute;
  inset: 0;
  background-position: center;
  background-size: cover;
  background-repeat: no-repeat;
  will-change: transform;
}
.icg-hero-base {
  z-index: 1;
  background-image: url('/fff-rock-base.webp');
}
.icg-hero-reveal {
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
.icg-hero-revealed .icg-hero-reveal {
  -webkit-mask-image: none;
  mask-image: none;
}
/* Scrim keeps the top headline legible and deepens the frame edges. */
.icg-hero-scrim {
  position: absolute;
  inset: 0;
  z-index: 3;
  pointer-events: none;
  background: linear-gradient(to bottom, rgba(0, 0, 0, 0.55), transparent 30%),
    radial-gradient(120% 80% at 50% 120%, rgba(0, 0, 0, 0.5), transparent 60%);
}

.icg-hero-content {
  position: absolute;
  inset: 0;
  z-index: 10;
  pointer-events: none;
}
.icg-hero-top {
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
.icg-hero-corner {
  position: absolute;
  bottom: clamp(28px, 6vh, 72px);
  max-width: 300px;
}
.icg-hero-left {
  left: clamp(20px, 5vw, 56px);
}
.icg-hero-right {
  right: clamp(20px, 5vw, 56px);
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 16px;
}
.icg-hero-hint {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  margin: 0;
  color: rgba(244, 248, 246, 0.72);
  font-family: 'JetBrains Mono', ui-monospace, monospace;
  font-size: 11px;
  letter-spacing: 0.06em;
  text-transform: uppercase;
}
@media (max-width: 767px) {
  .icg-hero-left { display: none; }
  .icg-hero-right {
    left: clamp(20px, 5vw, 56px);
    right: clamp(20px, 5vw, 56px);
    max-width: none;
  }
  .icg-hero-hint { display: none; }
}

.icg-badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 7px 15px;
  border-radius: 999px;
  border: 1px solid rgba(0, 255, 163, 0.3);
  background: rgba(0, 255, 163, 0.1);
  backdrop-filter: blur(8px);
  color: var(--ig-accent);
  font-family: 'JetBrains Mono', ui-monospace, monospace;
  font-size: 11.5px;
  font-weight: 700;
  letter-spacing: 0.16em;
  text-transform: uppercase;
}
.icg-badge-dot {
  width: 6px;
  height: 6px;
  border-radius: 999px;
  background: var(--ig-accent);
  box-shadow: 0 0 10px rgba(0, 255, 163, 0.9);
  animation: icg-pulse 2s ease-in-out infinite;
}
.icg-h1 {
  margin: 22px 0 0;
  font-family: 'Plus Jakarta Sans', Inter, sans-serif;
  font-weight: 800;
  font-size: clamp(2.6rem, 1rem + 6.4vw, 5.4rem);
  line-height: 0.98;
  letter-spacing: -0.04em;
  text-shadow: 0 2px 40px rgba(0, 0, 0, 0.5);
}
.icg-h1 span {
  display: block;
}
.icg-grad {
  display: inline;
  background: linear-gradient(110deg, var(--ig-accent), var(--ig-accent-2) 60%, #7bd0ff);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}
.icg-subtitle {
  margin: 18px 0 0;
  font-family: 'Plus Jakarta Sans', Inter, sans-serif;
  font-weight: 700;
  font-size: clamp(1.1rem, 0.9rem + 0.9vw, 1.5rem);
  letter-spacing: -0.01em;
  color: var(--ig-text);
  text-shadow: 0 2px 20px rgba(0, 0, 0, 0.6);
}
.icg-lead {
  margin: 0;
  font-size: 14px;
  line-height: 1.6;
  color: rgba(244, 248, 246, 0.82);
  text-shadow: 0 1px 16px rgba(0, 0, 0, 0.8);
}
.icg-hl {
  color: var(--ig-accent);
  font-weight: 600;
}
.icg-cta-row {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  pointer-events: auto;
}

/* ---------- BUTTONS ---------- */
.icg-btn {
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
.icg-btn-primary {
  background: linear-gradient(120deg, var(--ig-accent), var(--ig-accent-2));
  color: var(--ig-ink);
  box-shadow: 0 10px 34px rgba(0, 255, 163, 0.32);
}
.icg-btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 14px 46px rgba(0, 255, 163, 0.48);
}
.icg-btn-primary:active {
  transform: scale(0.98);
}
.icg-btn-ghost {
  background: rgba(10, 14, 12, 0.42);
  border-color: var(--ig-glass-line);
  color: var(--ig-text);
  backdrop-filter: blur(10px);
}
.icg-btn-ghost:hover {
  border-color: rgba(0, 255, 163, 0.45);
  background: rgba(0, 255, 163, 0.1);
}

/* ---------- SECTION HEAD ---------- */
.icg-section-head {
  text-align: center;
  margin-bottom: clamp(1.8rem, 1rem + 2vw, 2.6rem);
}
.icg-eyebrow {
  display: inline-block;
  font-family: 'JetBrains Mono', ui-monospace, monospace;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: var(--ig-accent);
}
.icg-section-title {
  margin: 12px 0 0;
  font-family: 'Plus Jakarta Sans', Inter, sans-serif;
  font-weight: 800;
  font-size: clamp(1.7rem, 1.1rem + 2vw, 2.6rem);
  letter-spacing: -0.03em;
}

/* Content sections sit in a narrower, centered column (the hero stays
   full-bleed) so the page reads as a focused landing, not a wide dashboard. */
.icg-wrap {
  width: 100%;
  max-width: var(--ig-contentw);
  margin: 0 auto;
  padding-left: 24px;
  padding-right: 24px;
}

/* ---------- REWARDS GRID ---------- */
.icg-rewards {
  padding-top: clamp(3.5rem, 2rem + 4vw, 6rem);
}
.icg-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 16px;
}
@media (min-width: 640px) {
  .icg-grid {
    grid-template-columns: 1fr 1fr;
  }
}
.icg-card {
  position: relative;
  overflow: hidden;
  padding: 24px 22px 26px;
  border-radius: 22px;
  background: var(--ig-glass);
  border: 1px solid var(--ig-glass-line);
  backdrop-filter: blur(14px);
  box-shadow: 0 20px 44px rgba(0, 0, 0, 0.38), inset 0 1px 0 rgba(255, 255, 255, 0.06);
  transition: transform 0.28s cubic-bezier(0.16, 1, 0.3, 1), border-color 0.28s ease,
    box-shadow 0.28s ease;
}
.icg-card::after {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: inherit;
  background: radial-gradient(120% 80% at 50% -10%, rgba(0, 255, 163, 0.12), transparent 60%);
  opacity: 0;
  transition: opacity 0.28s ease;
  pointer-events: none;
}
.icg-card:hover {
  transform: translateY(-6px);
  border-color: rgba(0, 255, 163, 0.35);
  box-shadow: 0 30px 60px rgba(0, 0, 0, 0.5), 0 0 40px rgba(0, 255, 163, 0.14);
}
.icg-card:hover::after {
  opacity: 1;
}
.icg-num {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 46px;
  height: 46px;
  border-radius: 14px;
  font-family: 'JetBrains Mono', ui-monospace, monospace;
  font-size: 14px;
  font-weight: 800;
  color: var(--ig-ink);
  background: linear-gradient(135deg, var(--ig-accent), #22d3a0);
  box-shadow: 0 8px 20px rgba(0, 255, 163, 0.28);
}
.icg-num[data-step='2'] {
  background: linear-gradient(135deg, #6ba5fb, #4f7ef7);
  box-shadow: 0 8px 20px rgba(107, 165, 251, 0.3);
}
.icg-num[data-step='3'] {
  background: linear-gradient(135deg, #ff92de, #f76bd0);
  box-shadow: 0 8px 20px rgba(255, 146, 222, 0.28);
}
.icg-num[data-step='4'] {
  background: linear-gradient(135deg, #b3f6af, #7fe08a);
  box-shadow: 0 8px 20px rgba(179, 246, 175, 0.28);
}
.icg-card-title {
  margin: 18px 0 0;
  font-family: 'Plus Jakarta Sans', Inter, sans-serif;
  font-weight: 800;
  font-size: 18px;
  letter-spacing: -0.02em;
  color: var(--ig-text);
}
.icg-card-text {
  margin: 8px 0 0;
  font-size: 14px;
  line-height: 1.55;
  color: var(--ig-muted);
}

/* ---------- CLOSING ---------- */
.icg-closing {
  margin-top: clamp(3.5rem, 2rem + 4vw, 6.5rem);
  text-align: center;
}
.icg-closing-text {
  max-width: 20ch;
  margin: 0 auto;
  padding: clamp(2.5rem, 1.5rem + 3vw, 4rem) 0;
  border-top: 1px solid var(--ig-glass-line);
  border-bottom: 1px solid var(--ig-glass-line);
  font-family: 'Plus Jakarta Sans', Inter, sans-serif;
  font-weight: 800;
  font-size: clamp(2rem, 1rem + 4.2vw, 3.6rem);
  line-height: 1.04;
  letter-spacing: -0.035em;
}

/* ---------- APPLY ---------- */
.icg-apply-wrap {
  margin-top: clamp(3rem, 2rem + 3vw, 5rem);
  scroll-margin-top: 90px;
}
.icg-apply {
  position: relative;
  overflow: hidden;
  border-radius: 30px;
  padding: clamp(24px, 3.5vw, 44px);
  background: linear-gradient(135deg, rgba(0, 255, 163, 0.1), rgba(0, 0, 0, 0) 40%),
    var(--ig-glass);
  border: 1px solid var(--ig-glass-line);
  backdrop-filter: blur(16px);
  box-shadow: 0 40px 90px rgba(0, 0, 0, 0.5);
}
.icg-apply-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: clamp(24px, 4vw, 48px);
  align-items: center;
}
@media (min-width: 1024px) {
  .icg-apply-grid {
    grid-template-columns: minmax(0, 0.82fr) minmax(360px, 0.66fr);
  }
}
.icg-apply-title {
  margin: 12px 0 0;
  font-family: 'Plus Jakarta Sans', Inter, sans-serif;
  font-weight: 800;
  font-size: clamp(1.9rem, 1.2rem + 2.4vw, 2.9rem);
  line-height: 1.02;
  letter-spacing: -0.03em;
}
.icg-apply-copy {
  margin: 14px 0 0;
  max-width: 24rem;
  font-size: 15px;
  line-height: 1.62;
  color: var(--ig-muted);
}

/* ---------- FORM ---------- */
.icg-form {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.icg-field {
  display: flex;
  flex-direction: column;
}
.icg-label {
  font-family: 'JetBrains Mono', ui-monospace, monospace;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: rgba(244, 248, 246, 0.5);
  margin-bottom: 9px;
}
.icg-input {
  width: 100%;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid var(--ig-glass-line);
  border-radius: 14px;
  padding: 14px 15px;
  font-family: 'Inter', system-ui, sans-serif;
  font-size: 15px;
  font-weight: 500;
  color: var(--ig-text);
  transition: border-color 0.2s ease, box-shadow 0.2s ease, background 0.2s ease;
}
.icg-input::placeholder {
  color: rgba(244, 248, 246, 0.34);
}
.icg-input:focus {
  outline: none;
  background: rgba(255, 255, 255, 0.08);
  border-color: rgba(0, 255, 163, 0.55);
  box-shadow: 0 0 0 3px rgba(0, 255, 163, 0.15);
}
.icg-textarea {
  resize: vertical;
  min-height: 128px;
  line-height: 1.5;
}
.icg-input-error {
  border-color: rgba(248, 113, 113, 0.6);
}
.icg-err {
  color: #fca5a5;
  font-size: 12px;
  margin: 6px 0 0;
}
.icg-error-banner {
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
.icg-submit {
  width: 100%;
  margin-top: 4px;
}
.icg-submit:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
.icg-submit-loading {
  display: inline-flex;
  align-items: center;
  gap: 8px;
}
.icg-spin {
  animation: icg-spin 0.8s linear infinite;
}

/* ---------- SUCCESS ---------- */
.icg-success {
  text-align: center;
  padding: 44px 0;
}
.icg-success-icon {
  width: 56px;
  height: 56px;
  margin: 0 auto 20px;
  border-radius: 18px;
  background: linear-gradient(120deg, var(--ig-accent), var(--ig-accent-2));
  color: var(--ig-ink);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 12px 30px rgba(0, 255, 163, 0.3);
}
.icg-success-title {
  font-family: 'Plus Jakarta Sans', Inter, sans-serif;
  font-weight: 800;
  font-size: 20px;
  margin: 0 0 8px;
}
.icg-success-copy {
  color: var(--ig-muted);
  font-size: 14px;
  margin: 0;
}
.icg-success-again {
  margin-top: 24px;
  background: none;
  border: none;
  color: var(--ig-accent);
  font-size: 12px;
  font-weight: 700;
  cursor: pointer;
}
.icg-success-again:hover {
  text-decoration: underline;
}

/* ---------- Motion ---------- */
.hero-anim {
  opacity: 0;
  animation-fill-mode: forwards;
  animation-timing-function: cubic-bezier(0.16, 1, 0.3, 1);
}
.hero-reveal-line {
  animation-name: icg-hero-reveal;
  animation-duration: 1.1s;
}
.hero-fade {
  animation-name: icg-hero-fade;
  animation-duration: 1s;
}
.hero-zoom {
  animation: icg-hero-zoom 1.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}
@keyframes icg-hero-reveal {
  0% { opacity: 0; transform: translateY(26px); filter: blur(12px); }
  100% { opacity: 1; transform: translateY(0); filter: blur(0); }
}
@keyframes icg-hero-fade {
  0% { opacity: 0; transform: translateY(18px); }
  100% { opacity: 1; transform: translateY(0); }
}
@keyframes icg-hero-zoom {
  0% { transform: scale(1.12); }
  100% { transform: scale(1); }
}
@keyframes icg-pulse {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.5; transform: scale(0.8); }
}
@keyframes icg-spin {
  to { transform: rotate(360deg); }
}
@media (prefers-reduced-motion: reduce) {
  .hero-anim,
  .hero-zoom { animation: none; opacity: 1; }
  .icg-card,
  .icg-btn,
  .icg-input,
  .icg-card:hover,
  .icg-btn-primary:hover { transition: none; transform: none; }
  .icg-brand-dot,
  .icg-badge-dot,
  .icg-spin { animation: none; }
}
</style>

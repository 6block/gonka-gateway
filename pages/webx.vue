<template>
  <div class="webx">
    <!-- Top bar: brand + back link (self-contained, no app header/footer) -->
    <header class="webx-topbar">
      <div class="webx-topbar-inner">
        <NuxtLink to="/" class="webx-brand text-xl md:text-4xl" >GonkaRouter</NuxtLink>
        <NuxtLink to="/" class="webx-back">
          Back to GonkaRouter
        </NuxtLink>
      </div>
    </header>

    <!-- ===================== HERO ===================== -->
    <section class="webx-wrap webx-hero">
      <div class="webx-hero-grid">
        <!-- Left: headline + CTAs -->
        <div class="webx-hero-left">
          <span class="webx-badge">WebX Japan</span>
          <h1 class="webx-h1">Build AI on Gonka Router at WebX Japan</h1>

          <div class="webx-subhead">
            <h2 class="webx-subhead-title">Build with Gonka, Unlock Up to $40 Credits</h2>
            <p class="webx-subhead-copy">
              Start building with Gonka Router and get up to $40 in free inference credits.
            </p>
          </div>

          <div class="webx-cta-row">
            <button type="button" class="webx-btn webx-btn-primary" @click="goRegister">Register</button>
            <a href="#apply" class="webx-btn webx-btn-ghost">Apply for more credits</a>
          </div>
        </div>

        <!-- Right: numbered credit rule cards -->
        <div class="webx-rules">
          <article v-for="(rule, i) in creditRules" :key="i" class="webx-rule">
            <p>{{ rule }}</p>
          </article>
        </div>
      </div>
    </section>

    <!-- ===================== CLOSING ===================== -->
    <section class="webx-wrap webx-closing">
      <p class="webx-closing-text">Test, ship, and scale your AI product with Gonka Router.</p>
    </section>

    <!-- ===================== APPLY FORM ===================== -->
    <section id="apply" class="webx-wrap webx-apply-wrap">
      <div class="webx-apply">
        <div class="webx-apply-grid">
          <!-- Left: heading -->
          <div class="webx-apply-intro">
            <h2 class="webx-apply-title">Apply for more credits</h2>
            <p class="webx-apply-copy">
              Send the registered email and a short note about what you are building with Gonka Router.
            </p>
          </div>

          <!-- Right: form / success -->
          <div>
            <div v-if="status === 'success'" class="webx-success">
              <div class="webx-success-icon"><LucideCheck :size="26" /></div>
              <h3 class="webx-success-title">Request sent.</h3>
              <p class="webx-success-copy">The team will review your application soon.</p>
              <button type="button" class="webx-success-again" @click="resetForm">Submit another →</button>
            </div>

            <form v-else class="webx-form" novalidate @submit.prevent="submit">
              <div class="webx-field">
                <label class="webx-label">Registered email</label>
                <input
                  v-model="form.email"
                  type="email"
                  placeholder="you@example.com"
                  autocomplete="email"
                  class="webx-input"
                  :class="{ 'webx-input-error': errors.email }"
                />
                <p v-if="errors.email" class="webx-err">{{ errors.email }}</p>
              </div>

              <div class="webx-field">
                <label class="webx-label">Build notes</label>
                <textarea
                  v-model="form.message"
                  rows="4"
                  placeholder="Tell us what you are building, which model you use, and where extra credits would help."
                  class="webx-input webx-textarea"
                  :class="{ 'webx-input-error': errors.message }"
                ></textarea>
                <p v-if="errors.message" class="webx-err">{{ errors.message }}</p>
              </div>

              <div v-if="status === 'error'" class="webx-error-banner">
                <LucideAlertCircle :size="16" />
                Something went wrong. Please try again.
              </div>

              <button type="submit" class="webx-btn webx-btn-primary webx-submit" :disabled="status === 'submitting'">
                <span v-if="status === 'submitting'" class="webx-submit-loading">
                  <LucideLoader2 :size="16" class="webx-spin" />
                  Sending…
                </span>
                <span v-else>Submit request</span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<!-- PLACEHOLDER_SCRIPT -->
<script setup>
import { reactive, ref } from 'vue'
import { LucideCheck, LucideLoader2, LucideAlertCircle, LucideArrowLeft } from 'lucide-vue-next'
import { useLoginModal } from '~/composables/useLoginModal'

// Standalone page: no app header/footer. It carries its own top bar.
definePageMeta({ layout: false })

const config = useRuntimeConfig()
const siteUrl = config.public.siteUrl || 'https://gonkarouter.io'

useSeoMeta({
  title: 'Build AI on Gonka Router at WebX Japan',
  description:
    'Build with Gonka Router at WebX Japan and unlock up to $40 in free inference credits. Register, ship, and scale your AI product.',
  ogTitle: 'Build AI on Gonka Router at WebX Japan',
  ogDescription: 'Unlock up to $40 in free inference credits at WebX Japan.',
  ogUrl: `${siteUrl}/webx`
})
useHead({ link: [{ rel: 'canonical', href: `${siteUrl}/webx` }] })

const router = useRouter()
const { open: openLoginModal } = useLoginModal()

// Register → go to the home page, then open the sign-in / sign-up modal
// (mounted globally in app.vue, so it works from this standalone layout too).
const goRegister = async () => {
  await router.push('/')
  openLoginModal()
}

const creditRules = [
  'Get $20 when you register, create an API key, and complete your first real API call.',
  'Unlock another $20 by using Gonka Router actively during the period from 7/13/2026 to 7/31/2026.',
  'Keep Gonka Router as one of your inference providers and unlock more credits at 30, 60, and 90-day milestones.',
  'Real builders get rewarded.'
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
    // Same endpoint and shape as /feedback. Topic is fixed to 'webx'; the fields
    // feedback requires but this form doesn't collect get defaults.
    await $fetch(`${apiBase}/api/feedback`, {
      method: 'POST',
      body: {
        name: 'WebX Applicant',
        email: form.email.trim(),
        topic: 'webx',
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
</script>
<!-- PLACEHOLDER_STYLE -->
<style scoped>
/* Design tokens captured from the reference design (webx-v2). Scoped to this
   page so the surrounding app theme is untouched. */
.webx {
  --wx-bg: #050505;
  --wx-text: #f7f7f7;
  --wx-accent: #00ffa3;
  --wx-ink: #04130d;
  --wx-card: #151515;
  --wx-border: rgba(255, 255, 255, 0.16);
  --wx-maxw: 1140px;

  background: var(--wx-bg);
  color: var(--wx-text);
  font-family: 'Inter', system-ui, sans-serif;
  min-height: 100vh;
  padding-top: 20px;
  padding-bottom: clamp(4rem, 3rem + 4vw, 6rem);
  /* Ambient page glow — matches the design: green top-right + blue mid-left. */
  background-image:
    radial-gradient(820px 420px at 82% 4%, rgba(0, 255, 163, 0.11), rgba(0, 0, 0, 0) 62%),
    radial-gradient(780px 420px at -8% 24%, rgba(107, 165, 251, 0.16), rgba(0, 0, 0, 0) 58%);
  background-repeat: no-repeat;
}

/* ---------- TOP BAR ---------- */
/* Scrolls with the page (not sticky) and is transparent so the page gradient
   shows through it, exactly like the design. */
.webx-topbar {
  position: static;
  border-bottom: 1px solid rgba(255, 255, 255, 0.16);
}
.webx-topbar-inner {
  max-width: var(--wx-maxw);
  margin: 0 auto;
  min-height: 58px;
  padding: 0 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 18px;
}
.webx-brand {
  font-family: 'Plus Jakarta Sans', Inter, sans-serif;
  font-weight: 900;
  letter-spacing: -0.03em;
  color: var(--wx-accent);
  text-decoration: none;
}
.webx-back {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  min-height: 36px;
  padding: 0 14px;
  border-radius: 999px;
  border: 1px solid rgba(255, 255, 255, 0.16);
  background: rgba(255, 255, 255, 0.04);
  color: rgba(247, 247, 247, 0.68);
  font-size: 12px;
  font-weight: 800;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  text-decoration: none;
  transition: color 0.2s ease, background 0.2s ease, border-color 0.2s ease;
}
.webx-back:hover {
  color: #061710;
  background: var(--wx-accent);
  border-color: var(--wx-accent);
}

.webx-wrap {
  width: 100%;
  max-width: var(--wx-maxw);
  margin: 0 auto;
  padding-left: 24px;
  padding-right: 24px;
}

/* ---------- HERO ---------- */
.webx-hero {
  padding-top: clamp(2rem, 1rem + 4vw, 5rem);
  padding-bottom: clamp(2rem, 1rem + 2vw, 3.4rem);
}
.webx-hero-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: clamp(2.5rem, 1.5rem + 3vw, 4.25rem);
  align-items: stretch;
}
@media (min-width: 1024px) {
  .webx-hero-grid {
    grid-template-columns: 1.27fr 1fr;
  }
}
.webx-hero-left {
  position: relative;
}
/* Soft green glow anchored to the headline, as in the design. */
.webx-hero-left::before {
  content: '';
  position: absolute;
  inset: -40px -40px auto -40px;
  height: 320px;
  background: radial-gradient(420px 240px at 18% 0%, rgba(0, 255, 163, 0.11), rgba(0, 0, 0, 0) 58%);
  pointer-events: none;
  z-index: 0;
}
.webx-hero-left > * {
  position: relative;
  z-index: 1;
}

.webx-badge {
  display: inline-block;
  background: #b3f6af;
  color: var(--wx-ink);
  font-family: 'JetBrains Mono', ui-monospace, monospace;
  font-size: 12px;
  font-weight: 800;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  padding: 5px 9px;
}
.webx-h1 {
  font-family: 'Plus Jakarta Sans', Inter, sans-serif;
  font-weight: 800;
  font-size: clamp(2.75rem, 1.2rem + 6.8vw, 6.1rem);
  line-height: 0.9;
  letter-spacing: -0.066em;
  text-transform: uppercase;
  margin: 22px 0 0;
}
.webx-subhead {
  border-left: 2px solid var(--wx-accent);
  padding-left: 22px;
  margin-top: clamp(1.75rem, 1rem + 2vw, 2.5rem);
}
.webx-subhead-title {
  font-family: 'Inter', system-ui, sans-serif;
  font-weight: 900;
  font-size: clamp(1.75rem, 1.1rem + 2vw, 2.75rem);
  line-height: 1;
  letter-spacing: -0.046em;
  margin: 0;
}
.webx-subhead-copy {
  font-size: 18px;
  font-weight: 400;
  line-height: 1.55;
  color: rgba(247, 247, 247, 0.68);
  margin: 14px 0 0;
  max-width: 26rem;
}
.webx-cta-row {
  display: flex;
  flex-wrap: wrap;
  gap: 14px;
  margin-top: clamp(1.75rem, 1rem + 2vw, 2.5rem);
}

/* ---------- BUTTONS ---------- */
.webx-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 48px;
  padding: 0 24px;
  border-radius: 999px;
  font-size: 13px;
  font-weight: 900;
  letter-spacing: 0.07em;
  text-transform: uppercase;
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease, background 0.2s ease, border-color 0.2s ease;
}
.webx-btn-primary {
  background: var(--wx-accent);
  color: var(--wx-ink);
  border: 1px solid var(--wx-accent);
}
.webx-btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 0 30px rgba(0, 255, 163, 0.35);
}
.webx-btn-primary:active {
  transform: scale(0.97);
}
.webx-btn-ghost {
  background: rgba(255, 255, 255, 0.04);
  color: var(--wx-text);
  border: 1px solid var(--wx-border);
}
.webx-btn-ghost:hover {
  border-color: rgba(0, 255, 163, 0.4);
  background: rgba(255, 255, 255, 0.07);
}

/* ---------- RULE CARDS ---------- */
.webx-rules {
  display: grid;
  gap: 10px;
  background: rgba(255, 255, 255, 0.035);
  border: 1px solid var(--wx-border);
  border-radius: 30px;
  padding: 12px;
  counter-reset: credit-step;
  /* Stretched to the left column's height (grid align-items: stretch); the
     cards share that height in the design's proportions instead of stacking. */
  grid-auto-rows: 1fr;
}
@media (min-width: 1024px) {
  .webx-rules {
    grid-template-rows: 227fr 256fr 256fr 190fr;
    grid-auto-rows: auto;
  }
}
.webx-rule {
  counter-increment: credit-step;
  display: flex;
  align-items: flex-start;
  gap: 16px;
  background: linear-gradient(rgba(255, 255, 255, 0.075), rgba(255, 255, 255, 0.03));
  border: 1px solid rgba(255, 255, 255, 0.13);
  border-radius: 22px;
  padding: 18px;
}
.webx-rule::before {
  content: counter(credit-step, decimal-leading-zero);
  flex: none;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  border-radius: 16px;
  font-family: 'JetBrains Mono', ui-monospace, monospace;
  font-size: 13px;
  font-weight: 900;
  color: var(--wx-ink);
  background: var(--wx-accent);
}
.webx-rule:nth-child(2)::before { background: #6ba5fb; }
.webx-rule:nth-child(3)::before { background: #ff92de; }
.webx-rule:nth-child(4)::before { background: #b3f6af; }
.webx-rule p {
  margin: 0;
  font-size: 16.2px;
  font-weight: 800;
  line-height: 1.42;
  letter-spacing: -0.02em;
  color: rgba(255, 255, 255, 0.88);
}

/* PLACEHOLDER_STYLE_2 */
/* ---------- CLOSING ---------- */
.webx-closing {
  margin-top: clamp(3.5rem, 2rem + 5vw, 7rem);
}
.webx-closing-text {
  border-top: 1px solid rgba(255, 255, 255, 0.08);
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  padding: clamp(2.5rem, 1.5rem + 3vw, 4rem) 0;
  margin: 0;
  font-family: 'Plus Jakarta Sans', Inter, sans-serif;
  font-weight: 900;
  font-size: clamp(2rem, 1rem + 4.4vw, 3.85rem);
  line-height: 0.96;
  letter-spacing: -0.054em;
  text-transform: uppercase;
}

/* ---------- APPLY ---------- */
.webx-apply-wrap {
  margin-top: clamp(3rem, 2rem + 3vw, 5rem);
  scroll-margin-top: 96px;
}
.webx-apply {
  /* Green corner wash over a solid panel, matching the design's apply-card. */
  background: linear-gradient(135deg, rgba(0, 255, 163, 0.12), rgba(0, 0, 0, 0) 34%), #0f0f0f;
  border: 1px solid rgba(255, 255, 255, 0.16);
  border-radius: 30px;
  padding: clamp(20px, 3.5vw, 34px);
}
.webx-apply-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: clamp(22px, 4vw, 46px);
  /* Left intro column is vertically centered against the form, as designed. */
  align-items: center;
}
@media (min-width: 1024px) {
  .webx-apply-grid {
    grid-template-columns: minmax(0, 0.84fr) minmax(360px, 0.64fr);
  }
}
.webx-apply-title {
  font-family: 'Plus Jakarta Sans', Inter, sans-serif;
  font-weight: 900;
  font-size: clamp(2rem, 1.2rem + 3vw, 3.1rem);
  line-height: 0.96;
  letter-spacing: -0.05em;
  text-transform: uppercase;
  margin: 0 0 20px;
}
.webx-apply-copy {
  font-size: 15px;
  line-height: 1.6;
  color: rgba(247, 247, 247, 0.68);
  max-width: 22rem;
  margin: 0;
}

/* ---------- FORM ---------- */
.webx-form {
  display: flex;
  flex-direction: column;
  gap: 18px;
}
.webx-field {
  display: flex;
  flex-direction: column;
}
.webx-label {
  font-family: 'JetBrains Mono', ui-monospace, monospace;
  font-size: 10px;
  font-weight: 800;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: rgba(247, 247, 247, 0.55);
  margin-bottom: 10px;
}
.webx-input {
  width: 100%;
  background: var(--wx-card);
  border: 1px solid var(--wx-border);
  border-radius: 18px;
  padding: 14px 15px;
  font-family: 'Inter', system-ui, sans-serif;
  font-size: 15px;
  font-weight: 800;
  color: var(--wx-text);
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}
.webx-input::placeholder {
  color: rgba(247, 247, 247, 0.35);
  font-weight: 500;
}
.webx-input:focus {
  outline: none;
  border-color: rgba(0, 255, 163, 0.5);
  box-shadow: 0 0 0 3px rgba(0, 255, 163, 0.12);
}
.webx-textarea {
  resize: vertical;
  min-height: 130px;
  line-height: 1.5;
}
.webx-input-error {
  border-color: rgba(248, 113, 113, 0.6);
}
.webx-err {
  color: #f87171;
  font-size: 12px;
  margin: 6px 0 0;
}
.webx-error-banner {
  display: flex;
  align-items: center;
  gap: 12px;
  color: #f87171;
  font-size: 14px;
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.2);
  border-radius: 14px;
  padding: 12px 16px;
}
.webx-submit {
  width: 100%;
  margin-top: 2px;
}
.webx-submit:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
.webx-submit-loading {
  display: inline-flex;
  align-items: center;
  gap: 8px;
}
.webx-spin {
  animation: webx-spin 0.8s linear infinite;
}
@keyframes webx-spin {
  to { transform: rotate(360deg); }
}

/* ---------- SUCCESS ---------- */
.webx-success {
  text-align: center;
  padding: 48px 0;
}
.webx-success-icon {
  width: 56px;
  height: 56px;
  margin: 0 auto 20px;
  border-radius: 18px;
  background: var(--wx-accent);
  color: var(--wx-ink);
  display: flex;
  align-items: center;
  justify-content: center;
}
.webx-success-title {
  font-family: 'Plus Jakarta Sans', Inter, sans-serif;
  font-weight: 900;
  font-size: 20px;
  margin: 0 0 8px;
}
.webx-success-copy {
  color: rgba(247, 247, 247, 0.68);
  font-size: 14px;
  margin: 0;
}
.webx-success-again {
  margin-top: 24px;
  background: none;
  border: none;
  color: var(--wx-accent);
  font-size: 12px;
  font-weight: 700;
  cursor: pointer;
}
.webx-success-again:hover {
  text-decoration: underline;
}

@media (prefers-reduced-motion: reduce) {
  .webx-btn,
  .webx-input,
  .webx-btn-primary:hover { transition: none; transform: none; }
  .webx-spin { animation: none; }
}
</style>

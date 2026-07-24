<template>
  <div class="fff">
    <!-- Top bar: brand + back link (self-contained, no app header/footer) -->
    <header class="fff-topbar">
      <div class="fff-topbar-inner">
        <NuxtLink to="/" class="fff-brand text-xl md:text-4xl" @click="tagSource">GonkaRouter</NuxtLink>
        <NuxtLink to="/" class="fff-back" @click="tagSource">Back to GonkaRouter</NuxtLink>
      </div>
    </header>

    <!-- ===================== HERO ===================== -->
    <section class="fff-wrap fff-hero">
      <div class="fff-hero-grid">
        <!-- Left: headline + CTAs -->
        <div class="fff-hero-left">
          <span class="fff-badge">Founders For Founders</span>
          <h1 class="fff-h1">Launch Your Startup With Gonka Router</h1>

          <div class="fff-subhead">
            <h2 class="fff-subhead-title">Build with Free Inference Token Support</h2>
            <p class="fff-subhead-copy">
              Startups building AI applications on Gonka Router get free inference credit support
              to launch faster.
            </p>
          </div>

          <div class="fff-cta-row">
            <button type="button" class="fff-btn fff-btn-primary" @click="goRegister">Register</button>
            <a href="#apply" class="fff-btn fff-btn-ghost">Apply for more credits</a>
          </div>
        </div>

        <!-- Right: numbered reward rule cards -->
        <div class="fff-rules">
          <article v-for="(rule, i) in creditRules" :key="i" class="fff-rule">
            <p>{{ rule }}</p>
          </article>
        </div>
      </div>
    </section>

    <!-- ===================== CLOSING ===================== -->
    <section class="fff-wrap fff-closing">
      <p class="fff-closing-text">Test, ship, and scale your project with Gonka Router.</p>
    </section>

    <!-- ===================== APPLY FORM ===================== -->
    <section id="apply" class="fff-wrap fff-apply-wrap">
      <div class="fff-apply">
        <div class="fff-apply-grid">
          <!-- Left: heading -->
          <div class="fff-apply-intro">
            <h2 class="fff-apply-title">Apply for more credits</h2>
            <p class="fff-apply-copy">
              Submit your registered email and a short note about your project to apply for more credits.
            </p>
          </div>

          <!-- Right: form / success -->
          <div>
            <div v-if="status === 'success'" class="fff-success">
              <div class="fff-success-icon"><LucideCheck :size="26" /></div>
              <h3 class="fff-success-title">Request sent.</h3>
              <p class="fff-success-copy">The team will review your application soon.</p>
              <button type="button" class="fff-success-again" @click="resetForm">Submit another →</button>
            </div>

            <form v-else class="fff-form" novalidate @submit.prevent="submit">
              <div class="fff-field">
                <label class="fff-label">Registered email</label>
                <input
                  v-model="form.email"
                  type="email"
                  placeholder="you@example.com"
                  autocomplete="email"
                  class="fff-input"
                  :class="{ 'fff-input-error': errors.email }"
                />
                <p v-if="errors.email" class="fff-err">{{ errors.email }}</p>
              </div>

              <div class="fff-field">
                <label class="fff-label">Build notes</label>
                <textarea
                  v-model="form.message"
                  rows="4"
                  placeholder="Tell us what you are building, which model you use, and where extra credits would help."
                  class="fff-input fff-textarea"
                  :class="{ 'fff-input-error': errors.message }"
                ></textarea>
                <p v-if="errors.message" class="fff-err">{{ errors.message }}</p>
              </div>

              <div v-if="status === 'error'" class="fff-error-banner">
                <LucideAlertCircle :size="16" />
                Something went wrong. Please try again.
              </div>

              <button type="submit" class="fff-btn fff-btn-primary fff-submit" :disabled="status === 'submitting'">
                <span v-if="status === 'submitting'" class="fff-submit-loading">
                  <LucideLoader2 :size="16" class="fff-spin" />
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

<script setup>
import { reactive, ref } from 'vue'
import { LucideCheck, LucideLoader2, LucideAlertCircle } from 'lucide-vue-next'
import { useLoginModal } from '~/composables/useLoginModal'
import { useSignupSource } from '~/composables/useSignupSource'

// Standalone page: no app header/footer. It carries its own top bar.
definePageMeta({ layout: false })

// Campaign attribution tag for everyone who signs up through this page.
const FFF_SOURCE = 'fff'

const config = useRuntimeConfig()
const siteUrl = config.public.siteUrl || 'https://gonkarouter.io'

useSeoMeta({
  title: 'Launch Your Startup With Gonka Router — Founders For Founders',
  description:
    'Founders For Founders: launch your startup on Gonka Router with free inference token support. Register, ship, and scale your project.',
  ogTitle: 'Launch Your Startup With Gonka Router',
  ogDescription: 'Build with free inference token support. Founders For Founders.',
  ogUrl: `${siteUrl}/fff`
})
useHead({ link: [{ rel: 'canonical', href: `${siteUrl}/fff` }] })

const router = useRouter()
const { open: openLoginModal } = useLoginModal()
const signupSource = useSignupSource()

// Tag this browser as an FFF visitor. Any registration that follows in this
// session is attributed to FFF and stored on the new user record for reporting.
// Fired both by the Register CTA and by leaving the page via the top bar (logo /
// back link) — either way the visitor arrived through the FFF campaign.
const tagSource = () => {
  signupSource.set(FFF_SOURCE)
}

// Register → tag, then go to the home page and open the global sign-in / sign-up
// modal.
const goRegister = async () => {
  tagSource()
  await router.push('/')
  openLoginModal()
}

const creditRules = [
  'Register, create an API key, and complete your first real API call to get $20.',
  'Actively use Gonka Router within 30 days to unlock another $20.',
  'Keep using Gonka Router and unlock more credits at the 60, 90, and 120-day milestones.',
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
    // Same endpoint and shape as /feedback. Topic is fixed to 'fff'; the fields
    // feedback requires but this form doesn't collect get defaults.
    await $fetch(`${apiBase}/api/feedback`, {
      method: 'POST',
      body: {
        name: 'FFF Applicant',
        email: form.email.trim(),
        topic: 'fff',
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

<style scoped>
/* Design tokens carried over from the campaign design. Scoped to this page so
   the surrounding app theme is untouched. */
.fff {
  --ff-bg: #050505;
  --ff-text: #f7f7f7;
  --ff-accent: #00ffa3;
  --ff-ink: #04130d;
  --ff-card: #151515;
  --ff-border: rgba(255, 255, 255, 0.16);
  --ff-maxw: 1140px;

  background: var(--ff-bg);
  color: var(--ff-text);
  font-family: 'Inter', system-ui, sans-serif;
  min-height: 100vh;
  padding-top: 20px;
  padding-bottom: clamp(4rem, 3rem + 4vw, 6rem);
  /* Ambient page glow — green top-right + blue mid-left. */
  background-image:
    radial-gradient(820px 420px at 82% 4%, rgba(0, 255, 163, 0.11), rgba(0, 0, 0, 0) 62%),
    radial-gradient(780px 420px at -8% 24%, rgba(107, 165, 251, 0.16), rgba(0, 0, 0, 0) 58%);
  background-repeat: no-repeat;
}

/* ---------- TOP BAR ---------- */
/* Scrolls with the page (not sticky) and is transparent so the page gradient
   shows through it. */
.fff-topbar {
  position: static;
  border-bottom: 1px solid rgba(255, 255, 255, 0.16);
}
.fff-topbar-inner {
  max-width: var(--ff-maxw);
  margin: 0 auto;
  min-height: 58px;
  padding: 0 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 18px;
}
.fff-brand {
  font-family: 'Plus Jakarta Sans', Inter, sans-serif;
  font-weight: 900;
  letter-spacing: -0.03em;
  color: var(--ff-accent);
  text-decoration: none;
}
.fff-back {
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
  white-space: nowrap;
  text-decoration: none;
  transition: color 0.2s ease, background 0.2s ease, border-color 0.2s ease;
}
.fff-back:hover {
  color: #061710;
  background: var(--ff-accent);
  border-color: var(--ff-accent);
}

/* Mobile: keep the top bar on one comfortable row. */
@media (max-width: 560px) {
  .fff-topbar-inner {
    min-height: 52px;
    padding: 0 16px;
    gap: 10px;
  }
  .fff-back {
    min-height: 34px;
    padding: 0 12px;
    font-size: 11px;
    letter-spacing: 0.06em;
  }
}

.fff-wrap {
  width: 100%;
  max-width: var(--ff-maxw);
  margin: 0 auto;
  padding-left: 24px;
  padding-right: 24px;
}

/* ---------- HERO ---------- */
.fff-hero {
  padding-top: clamp(2rem, 1rem + 4vw, 5rem);
  padding-bottom: clamp(2rem, 1rem + 2vw, 3.4rem);
}
.fff-hero-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: clamp(2.5rem, 1.5rem + 3vw, 4.25rem);
  align-items: stretch;
}
@media (min-width: 1024px) {
  .fff-hero-grid {
    grid-template-columns: 1.27fr 1fr;
  }
}
.fff-hero-left {
  position: relative;
}
/* Soft green glow anchored to the headline. */
.fff-hero-left::before {
  content: '';
  position: absolute;
  inset: -40px -40px auto -40px;
  height: 320px;
  background: radial-gradient(420px 240px at 18% 0%, rgba(0, 255, 163, 0.11), rgba(0, 0, 0, 0) 58%);
  pointer-events: none;
  z-index: 0;
}
.fff-hero-left > * {
  position: relative;
  z-index: 1;
}

.fff-badge {
  display: inline-block;
  background: #b3f6af;
  color: var(--ff-ink);
  font-family: 'JetBrains Mono', ui-monospace, monospace;
  font-size: 12px;
  font-weight: 800;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  padding: 5px 9px;
}
.fff-h1 {
  font-family: 'Plus Jakarta Sans', Inter, sans-serif;
  font-weight: 800;
  font-size: clamp(2.75rem, 1.2rem + 6.8vw, 6.1rem);
  line-height: 0.9;
  letter-spacing: -0.066em;
  text-transform: uppercase;
  margin: 22px 0 0;
}
.fff-subhead {
  border-left: 2px solid var(--ff-accent);
  padding-left: 22px;
  margin-top: clamp(1.75rem, 1rem + 2vw, 2.5rem);
}
.fff-subhead-title {
  font-family: 'Inter', system-ui, sans-serif;
  font-weight: 900;
  font-size: clamp(1.75rem, 1.1rem + 2vw, 2.75rem);
  line-height: 1;
  letter-spacing: -0.046em;
  margin: 0;
}
.fff-subhead-copy {
  font-size: 18px;
  font-weight: 400;
  line-height: 1.55;
  color: rgba(247, 247, 247, 0.68);
  margin: 14px 0 0;
  max-width: 26rem;
}
.fff-cta-row {
  display: flex;
  flex-wrap: wrap;
  gap: 14px;
  margin-top: clamp(1.75rem, 1rem + 2vw, 2.5rem);
}

/* ---------- BUTTONS ---------- */
.fff-btn {
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
.fff-btn-primary {
  background: var(--ff-accent);
  color: var(--ff-ink);
  border: 1px solid var(--ff-accent);
}
.fff-btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 0 30px rgba(0, 255, 163, 0.35);
}
.fff-btn-primary:active {
  transform: scale(0.97);
}
.fff-btn-ghost {
  background: rgba(255, 255, 255, 0.04);
  color: var(--ff-text);
  border: 1px solid var(--ff-border);
}
.fff-btn-ghost:hover {
  border-color: rgba(0, 255, 163, 0.4);
  background: rgba(255, 255, 255, 0.07);
}

/* ---------- RULE CARDS ---------- */
.fff-rules {
  display: grid;
  gap: 10px;
  background: rgba(255, 255, 255, 0.035);
  border: 1px solid var(--ff-border);
  border-radius: 30px;
  padding: 12px;
  counter-reset: credit-step;
  grid-auto-rows: 1fr;
}
@media (min-width: 1024px) {
  .fff-rules {
    grid-template-rows: 227fr 256fr 256fr 190fr;
    grid-auto-rows: auto;
  }
}
.fff-rule {
  counter-increment: credit-step;
  display: flex;
  align-items: flex-start;
  gap: 16px;
  background: linear-gradient(rgba(255, 255, 255, 0.075), rgba(255, 255, 255, 0.03));
  border: 1px solid rgba(255, 255, 255, 0.13);
  border-radius: 22px;
  padding: 18px;
}
.fff-rule::before {
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
  color: var(--ff-ink);
  background: var(--ff-accent);
}
.fff-rule:nth-child(2)::before { background: #6ba5fb; }
.fff-rule:nth-child(3)::before { background: #ff92de; }
.fff-rule:nth-child(4)::before { background: #b3f6af; }
.fff-rule p {
  margin: 0;
  font-size: 16.2px;
  font-weight: 800;
  line-height: 1.42;
  letter-spacing: -0.02em;
  color: rgba(255, 255, 255, 0.88);
}

/* ---------- CLOSING ---------- */
.fff-closing {
  margin-top: clamp(3.5rem, 2rem + 5vw, 7rem);
}
.fff-closing-text {
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
.fff-apply-wrap {
  margin-top: clamp(3rem, 2rem + 3vw, 5rem);
  scroll-margin-top: 96px;
}
.fff-apply {
  background: linear-gradient(135deg, rgba(0, 255, 163, 0.12), rgba(0, 0, 0, 0) 34%), #0f0f0f;
  border: 1px solid rgba(255, 255, 255, 0.16);
  border-radius: 30px;
  padding: clamp(20px, 3.5vw, 34px);
}
.fff-apply-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: clamp(22px, 4vw, 46px);
  align-items: center;
}
@media (min-width: 1024px) {
  .fff-apply-grid {
    grid-template-columns: minmax(0, 0.84fr) minmax(360px, 0.64fr);
  }
}
.fff-apply-title {
  font-family: 'Plus Jakarta Sans', Inter, sans-serif;
  font-weight: 900;
  font-size: clamp(2rem, 1.2rem + 3vw, 3.1rem);
  line-height: 0.96;
  letter-spacing: -0.05em;
  text-transform: uppercase;
  margin: 0 0 20px;
}
.fff-apply-copy {
  font-size: 15px;
  line-height: 1.6;
  color: rgba(247, 247, 247, 0.68);
  max-width: 22rem;
  margin: 0;
}

/* ---------- FORM ---------- */
.fff-form {
  display: flex;
  flex-direction: column;
  gap: 18px;
}
.fff-field {
  display: flex;
  flex-direction: column;
}
.fff-label {
  font-family: 'JetBrains Mono', ui-monospace, monospace;
  font-size: 10px;
  font-weight: 800;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: rgba(247, 247, 247, 0.55);
  margin-bottom: 10px;
}
.fff-input {
  width: 100%;
  background: var(--ff-card);
  border: 1px solid var(--ff-border);
  border-radius: 18px;
  padding: 14px 15px;
  font-family: 'Inter', system-ui, sans-serif;
  font-size: 15px;
  font-weight: 800;
  color: var(--ff-text);
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}
.fff-input::placeholder {
  color: rgba(247, 247, 247, 0.35);
  font-weight: 500;
}
.fff-input:focus {
  outline: none;
  border-color: rgba(0, 255, 163, 0.5);
  box-shadow: 0 0 0 3px rgba(0, 255, 163, 0.12);
}
.fff-textarea {
  resize: vertical;
  min-height: 130px;
  line-height: 1.5;
}
.fff-input-error {
  border-color: rgba(248, 113, 113, 0.6);
}
.fff-err {
  color: #f87171;
  font-size: 12px;
  margin: 6px 0 0;
}
.fff-error-banner {
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
.fff-submit {
  width: 100%;
  margin-top: 2px;
}
.fff-submit:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
.fff-submit-loading {
  display: inline-flex;
  align-items: center;
  gap: 8px;
}
.fff-spin {
  animation: fff-spin 0.8s linear infinite;
}
@keyframes fff-spin {
  to { transform: rotate(360deg); }
}

/* ---------- SUCCESS ---------- */
.fff-success {
  text-align: center;
  padding: 48px 0;
}
.fff-success-icon {
  width: 56px;
  height: 56px;
  margin: 0 auto 20px;
  border-radius: 18px;
  background: var(--ff-accent);
  color: var(--ff-ink);
  display: flex;
  align-items: center;
  justify-content: center;
}
.fff-success-title {
  font-family: 'Plus Jakarta Sans', Inter, sans-serif;
  font-weight: 900;
  font-size: 20px;
  margin: 0 0 8px;
}
.fff-success-copy {
  color: rgba(247, 247, 247, 0.68);
  font-size: 14px;
  margin: 0;
}
.fff-success-again {
  margin-top: 24px;
  background: none;
  border: none;
  color: var(--ff-accent);
  font-size: 12px;
  font-weight: 700;
  cursor: pointer;
}
.fff-success-again:hover {
  text-decoration: underline;
}

@media (prefers-reduced-motion: reduce) {
  .fff-btn,
  .fff-input,
  .fff-btn-primary:hover { transition: none; transform: none; }
  .fff-spin { animation: none; }
}
</style>

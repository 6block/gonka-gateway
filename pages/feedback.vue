<template>
  <div class="relative overflow-hidden pt-24 sm:pt-28 pb-20">
    <!-- Background glow -->
    <div class="absolute top-10 -left-40 w-[500px] h-[500px] rounded-full bg-violet-600/15 blur-3xl pointer-events-none"></div>
    <div class="absolute bottom-0 right-0 w-72 h-72 rounded-full bg-primary-container/5 blur-3xl pointer-events-none"></div>

    <!-- Back link -->
    <div class="relative z-10 px-4 sm:px-6 lg:px-8 pb-5 max-w-6xl mx-auto w-full">
      <NuxtLink
        to="/"
        class="inline-flex items-center gap-2 text-primary-container text-[11px] font-black uppercase tracking-widest hover:opacity-75 transition-opacity"
      >
        <LucideArrowLeft class="w-3.5 h-3.5" />
        Back to Home
      </NuxtLink>
    </div>

    <!-- Two-column layout -->
    <div class="relative z-10 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto w-full">
      <div class="grid grid-cols-1 lg:grid-cols-[1.7fr_1fr] gap-5 lg:gap-6 items-start">

        <!-- ===================== LEFT: form card ===================== -->
        <div class="bg-surface-container-low border border-white/5 rounded-2xl sm:rounded-3xl p-6 sm:p-9">

          <!-- Header -->
          <div class="mb-7">
            <p class="text-[10px] font-black uppercase tracking-widest text-text-muted mb-3">Feedback</p>
            <h1 class="font-headline text-3xl sm:text-4xl md:text-5xl font-black tracking-tighter mb-3">
              Send feedback
            </h1>
            <p class="text-text-muted text-sm font-body leading-relaxed max-w-md">
              Share what happened in GonkaRouter so the team can review the API, model, docs, or billing experience.
            </p>
          </div>

          <!-- Success state -->
          <div v-if="status === 'success'" class="text-center py-12">
            <div class="w-14 h-14 mx-auto mb-5 rounded-2xl kinetic-gradient flex items-center justify-center">
              <LucideCheck class="w-6 h-6 text-primary-on" />
            </div>
            <h2 class="font-headline font-black text-xl text-text-main mb-2">Feedback sent.</h2>
            <p class="text-text-muted text-sm font-body">The team will review it soon.</p>
            <button
              @click="resetForm"
              class="mt-6 text-xs font-bold text-primary-container hover:underline transition-colors"
            >
              Send another →
            </button>
          </div>

          <!-- Form -->
          <form v-else @submit.prevent="submit" class="space-y-5" novalidate>

            <!-- Name + Email -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label class="block text-[10px] font-black uppercase tracking-widest text-text-muted mb-2">Name</label>
                <input
                  v-model="form.name"
                  type="text"
                  placeholder="Your name"
                  autocomplete="name"
                  class="field"
                  :class="errors.name ? 'field-error' : 'field-base'"
                />
                <p v-if="errors.name" class="field-err-msg">{{ errors.name }}</p>
              </div>
              <div>
                <label class="block text-[10px] font-black uppercase tracking-widest text-text-muted mb-2">Email</label>
                <input
                  v-model="form.email"
                  type="email"
                  placeholder="name@company.com"
                  autocomplete="email"
                  class="field"
                  :class="errors.email ? 'field-error' : 'field-base'"
                />
                <p v-if="errors.email" class="field-err-msg">{{ errors.email }}</p>
              </div>
            </div>

            <!-- Topic + Model -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label class="block text-[10px] font-black uppercase tracking-widest text-text-muted mb-2">Topic</label>
                <UiSelect
                  v-model="form.topic"
                  :options="topics"
                  placeholder="Select topic"
                  :has-error="!!errors.topic"
                />
                <p v-if="errors.topic" class="field-err-msg">{{ errors.topic }}</p>
              </div>
              <div>
                <label class="block text-[10px] font-black uppercase tracking-widest text-text-muted mb-2">Model</label>
                <UiSelect v-model="form.model" :options="models" />
              </div>
            </div>

            <!-- Message -->
            <div>
              <label class="block text-[10px] font-black uppercase tracking-widest text-text-muted mb-2">Message</label>
              <textarea
                v-model="form.message"
                placeholder="Describe the issue, suggestion, or model behavior you want the team to review."
                rows="6"
                class="field resize-y min-h-[150px]"
                :class="errors.message ? 'field-error' : 'field-base'"
              ></textarea>
              <p v-if="errors.message" class="field-err-msg">{{ errors.message }}</p>
            </div>

            <!-- Screenshot upload -->
            <div>
              <label class="block text-[10px] font-black uppercase tracking-widest text-text-muted mb-2">Image upload</label>

              <!-- Empty: compact upload bar (matches mockup) -->
              <div
                v-if="!screenshotPreview"
                @dragover.prevent
                @drop.prevent="onDrop"
                class="flex items-center gap-4 border border-[#ffffff0d] bg-surface-container-high/60 rounded-xl p-4"
              >
                <div class="w-11 h-11 shrink-0 rounded-xl bg-primary-container/15 border border-primary-container/20 flex items-center justify-center">
                  <LucideImage class="w-5 h-5 text-primary-container" />
                </div>
                <div class="min-w-0 flex-1">
                  <p class="text-sm font-headline font-black text-text-main leading-tight">Attach a screenshot</p>
                  <p class="text-xs text-text-muted font-body mt-0.5">PNG, JPG, WebP, or GIF up to 5 MB</p>
                </div>
                <button
                  type="button"
                  @click="triggerUpload"
                  class="shrink-0 inline-flex items-center gap-1.5 px-4 py-2.5 rounded-lg bg-surface-container-high border border-white/10 text-xs font-bold text-text-main hover:border-primary-container/40 hover:bg-white/[0.04] transition-all"
                >
                  Upload image
                </button>
              </div>

              <!-- Filled: preview -->
              <div v-else class="relative rounded-xl overflow-hidden border border-white/5">
                <img :src="screenshotPreview" alt="Screenshot preview" class="w-full max-h-52 object-cover" />
                <button
                  type="button"
                  @click="removeScreenshot"
                  class="absolute top-2.5 right-2.5 w-7 h-7 rounded-full bg-black/60 backdrop-blur-sm flex items-center justify-center text-white hover:bg-black/80 transition-colors"
                  aria-label="Remove screenshot"
                >
                  <LucideX class="w-3.5 h-3.5" />
                </button>
              </div>
              <p v-if="uploadError" class="field-err-msg mt-1.5">{{ uploadError }}</p>
              <input ref="fileInput" type="file" accept="image/*" class="hidden" @change="onFileChange" />
            </div>

            <!-- Error banner -->
            <div
              v-if="status === 'error'"
              class="flex items-center gap-3 text-red-400 text-sm font-body bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3"
            >
              <LucideAlertCircle class="w-4 h-4 shrink-0" />
              Something went wrong. Please try again.
            </div>

            <!-- Submit -->
            <button
              type="submit"
              :disabled="status === 'submitting'"
              class="w-full kinetic-gradient text-primary-on py-3.5 rounded-xl font-headline font-black text-base transition-all hover:shadow-glow-emerald hover:-translate-y-0.5 active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:active:scale-100"
            >
              <span v-if="status === 'submitting'" class="inline-flex items-center gap-2 justify-center">
                <LucideLoader2 class="w-4 h-4 animate-spin" />
                Sending…
              </span>
              <span v-else>Send Feedback</span>
            </button>
          </form>
        </div>

        <!-- ===================== RIGHT: contact sidebar ===================== -->
        <aside class="space-y-5 lg:space-y-6">

          <!-- Contact the team -->
          <div class="bg-surface-container-low border border-white/5 rounded-2xl sm:rounded-3xl p-6 sm:p-7">
            <div class="w-11 h-11 rounded-xl bg-primary-container/15 border border-primary-container/20 flex items-center justify-center mb-5">
              <LucideMail class="w-5 h-5 text-primary-container" />
            </div>
            <p class="text-[10px] font-black uppercase tracking-widest text-text-muted mb-2">Email</p>
            <h2 class="font-headline text-xl sm:text-2xl font-black tracking-tight mb-3">Contact the team</h2>
            <p class="text-text-muted text-sm font-body leading-relaxed mb-5">
              Send details, screenshots, or API context directly to GonkaRouter support.
            </p>
            <a
              :href="`mailto:${CONTACT_EMAIL}`"
              class="inline-flex items-center gap-2 w-full justify-center px-4 py-3 rounded-xl bg-surface-container-high border border-white/10 text-sm font-bold text-text-main hover:border-primary-container/40 hover:bg-white/[0.04] transition-all"
            >
              <LucideMail class="w-4 h-4 text-primary-container shrink-0" />
              {{ CONTACT_EMAIL }}
            </a>
          </div>

          <!-- Social QR -->
          <div class="bg-surface-container-low border border-white/5 rounded-2xl sm:rounded-3xl p-6 sm:p-7">
            <p class="text-[10px] font-black uppercase tracking-widest text-text-muted mb-5">Social QR</p>
            <div class="grid grid-cols-2 gap-4">
              <a
                v-for="s in socials"
                :key="s.label"
                :href="s.url"
                target="_blank"
                rel="noreferrer"
                class="group rounded-2xl border border-[#ffffff0d]  bg-surface-container-high/40 p-3 hover:border-primary-container/40 transition-all"
              >
                <div class="rounded-xl bg-white p-2.5 flex items-center justify-center">
                  <ClientOnly>
                    <QrcodeVue :value="s.url" :size="112" render-as="svg" level="M" class="w-full h-auto" />
                    <template #fallback>
                      <div class="w-[112px] h-[112px]"></div>
                    </template>
                  </ClientOnly>
                </div>
                <div class="flex items-center justify-between mt-3">
                  <div class="min-w-0">
                    <p class="text-sm font-headline font-black text-text-main leading-tight">{{ s.label }}</p>
                    <p class="text-[11px] text-text-muted font-body truncate">{{ s.handle }}</p>
                  </div>
                  <span class="w-6 h-6 shrink-0 rounded-full bg-primary-container/15 border border-primary-container/20 flex items-center justify-center text-primary-container">
                    <component :is="s.icon" class="w-3 h-3" />
                  </span>
                </div>
              </a>
            </div>
          </div>
        </aside>

      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, h } from 'vue'
import QrcodeVue from 'qrcode.vue'
import {
  LucideArrowLeft,
  LucideCheck,
  LucideLoader2,
  LucideX,
  LucideImage,
  LucideMail,
  LucideSend,
  LucideAlertCircle
} from 'lucide-vue-next'

definePageMeta({ layout: 'landing' })

const config = useRuntimeConfig()
const siteUrl = config.public.siteUrl || 'https://gonkarouter.io'

useSeoMeta({
  title: 'Send Feedback — GonkaRouter',
  description:
    'Share feedback, report issues, or contact the GonkaRouter team. We read every message and use it to improve the AI model router on the Gonka network.',
  ogTitle: 'Send Feedback | GonkaRouter',
  ogDescription:
    'Share feedback, report an issue, or contact the GonkaRouter team.',
  ogUrl: `${siteUrl}/feedback`
})
useHead({ link: [{ rel: 'canonical', href: `${siteUrl}/feedback` }] })

const CONTACT_EMAIL = 'contact@gonka-router.com'

// X (Twitter) glyph as an inline render function so it sits next to lucide icons
const XGlyph = () =>
  h(
    'svg',
    { viewBox: '0 0 24 24', fill: 'currentColor', 'aria-hidden': 'true' },
    [h('path', { d: 'M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z' })]
  )

// YouTube / LinkedIn brand glyphs (lucide has no brand icons).
const YouTubeGlyph = () =>
  h(
    'svg',
    { viewBox: '0 0 24 24', fill: 'currentColor', 'aria-hidden': 'true' },
    [h('path', { d: 'M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z' })]
  )
const LinkedInGlyph = () =>
  h(
    'svg',
    { viewBox: '0 0 24 24', fill: 'currentColor', 'aria-hidden': 'true' },
    [h('path', { d: 'M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.225 0z' })]
  )

const socials = [
  { label: 'X', handle: '@gonka_cn', url: 'https://x.com/gonka_cn?s=21', icon: XGlyph },
  { label: 'Telegram', handle: 't.me/gonka_cn', url: 'https://t.me/gonka_cn', icon: LucideSend },
  { label: 'YouTube', handle: '@GonkaRouter', url: 'https://www.youtube.com/@GonkaRouter', icon: YouTubeGlyph },
  { label: 'LinkedIn', handle: 'Carol Gao', url: 'https://www.linkedin.com/in/carol-gao-71b158422/overlay/contact-info/', icon: LinkedInGlyph }
]

const topics = ['API issue', 'Model behavior', 'Docs issue', 'Billing issue', 'Feature request', 'Other']
const models = [
  'MiniMaxAI/MiniMax-M2.7',
  'moonshotai/Kimi-K2.6',
  // TEMP 2026-06-25: Qwen3-235B hidden while upstream Gonka takes it offline for
  // adjustment. Restore when it is back online.
  // 'Qwen/Qwen3-235B-A22B-Instruct-2507-FP8',
  'Not model specific'
]

const defaultForm = () => ({
  name: '',
  email: '',
  topic: '',
  model: 'MiniMaxAI/MiniMax-M2.7',
  message: ''
})

const form = reactive(defaultForm())
const errors = ref({})
const status = ref('idle') // idle | submitting | success | error

const fileInput = ref(null)
const screenshotPreview = ref(null)
const screenshotFile = ref(null)
const uploadError = ref('')

const validate = () => {
  const e = {}
  if (!form.name.trim()) e.name = 'Name is required.'
  if (!form.email.trim()) {
    e.email = 'Email is required.'
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
    e.email = 'Please enter a valid email address.'
  }
  if (!form.topic) e.topic = 'Please select a topic.'
  if (!form.message.trim()) {
    e.message = 'Message is required.'
  } else if (form.message.trim().length < 10) {
    e.message = 'Message must be at least 10 characters.'
  }
  return e
}

const runtimeConfig = useRuntimeConfig()
const apiBase = (runtimeConfig.public.apiBase || '').replace(/\/$/, '')

const submit = async () => {
  errors.value = validate()
  if (Object.keys(errors.value).length > 0) return
  if (!apiBase) {
    status.value = 'error'
    return
  }

  status.value = 'submitting'
  try {
    await $fetch(`${apiBase}/api/feedback`, {
      method: 'POST',
      body: {
        name: form.name.trim(),
        email: form.email.trim(),
        topic: form.topic,
        model: form.model,
        message: form.message.trim(),
        image: screenshotPreview.value ?? ''
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
  removeScreenshot()
}

const triggerUpload = () => fileInput.value?.click()

const processFile = (file) => {
  uploadError.value = ''
  if (!file) return
  if (!file.type.startsWith('image/')) {
    uploadError.value = 'Only image files are allowed.'
    return
  }
  if (file.size > 5 * 1024 * 1024) {
    uploadError.value = 'File size must be under 5 MB.'
    return
  }
  screenshotFile.value = file
  const reader = new FileReader()
  reader.onload = (ev) => { screenshotPreview.value = ev.target.result }
  reader.readAsDataURL(file)
}

const onFileChange = (e) => processFile(e.target.files?.[0])
const onDrop = (e) => processFile(e.dataTransfer.files?.[0])

const removeScreenshot = () => {
  screenshotPreview.value = null
  screenshotFile.value = null
  uploadError.value = ''
  if (fileInput.value) fileInput.value.value = ''
}
</script>

<style scoped>
.field {
  @apply w-full bg-surface-container-high rounded-xl px-4 py-3 text-sm font-body text-text-main placeholder:text-text-muted focus:outline-none focus:ring-1 transition-colors;
}
.field-base {
  @apply border border-white/5 hover:border-white/10 focus:border-primary-container/40 focus:ring-primary-container/30;
}
.field-error {
  @apply border border-red-500/50 focus:border-red-500/60 focus:ring-red-500/30;
}
.field-select {
  @apply appearance-none pr-9 cursor-pointer;
}
.field-err-msg {
  @apply text-red-400 text-xs mt-1.5 font-body;
}
</style>

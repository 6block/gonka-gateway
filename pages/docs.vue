<template>
  <div class="bg-surface text-text-main pt-24 sm:pt-32 pb-16 sm:pb-24 px-4 sm:px-6 md:px-8">
    <div class="max-w-5xl mx-auto space-y-10 sm:space-y-16">
      <NuxtLink
        to="/"
        class="inline-flex items-center gap-3 text-primary-container hover:text-primary-dim transition-all font-black font-headline uppercase tracking-widest text-[10px] group"
      >
        <LucideArrowLeft class="w-4 h-4 transition-transform group-hover:-translate-x-1" />
        Back to Home
      </NuxtLink>

      <!-- Header -->
      <header class="space-y-4 border-b border-white/5 pb-8 sm:pb-12">
        <div
          class="inline-flex items-center gap-2 bg-primary-container/10 border border-primary-container/20 px-4 py-1.5 rounded-full"
        >
          <span class="flex h-2 w-2 rounded-full bg-primary-container animate-pulse"></span>
          <span class="font-label text-[10px] tracking-widest uppercase text-primary-container font-bold">
            Developer Quickstart
          </span>
        </div>
        <h1 class="text-3xl sm:text-5xl md:text-6xl font-black font-headline tracking-tighter">
          Integration Guide
        </h1>
        <p class="text-text-muted text-sm sm:text-base md:text-lg leading-relaxed max-w-3xl">
          Drop your GonkaRouter key into Claude SDKs, Cursor IDE, or OpenClaw / Claude Code
          in under five minutes. Every snippet in this guide is tested end-to-end against
          <code class="font-mono text-primary-container">{{ apiBase }}</code>.
        </p>
      </header>

      <!-- Step 1: Get key -->
      <section class="space-y-5 sm:space-y-6">
        <div class="flex items-center gap-4">
          <div
            class="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-primary-container text-primary-on flex items-center justify-center font-black font-headline text-base sm:text-lg"
          >
            1
          </div>
          <h2 class="text-xl sm:text-2xl md:text-3xl font-black font-headline tracking-tight">
            Get your API Key
          </h2>
        </div>
        <div
          class="bg-surface-container-high border border-white/5 rounded-3xl p-6 sm:p-8 space-y-4"
        >
          <ol class="space-y-2 text-sm sm:text-base text-text-muted leading-relaxed list-decimal pl-5">
            <li>Open the <NuxtLink to="/dashboard" class="text-primary-container font-bold hover:underline">Dashboard</NuxtLink>, sign in with Google or wallet.</li>
            <li>Click <span class="text-text-main font-bold">Create API Key</span>, give it a label, copy the value <span class="text-text-main font-bold">immediately</span> — it is shown only once.</li>
            <li>New accounts get <span class="text-primary-container font-bold">$20 / day free credit for 7 days</span>, so you can try every model before topping up.</li>
          </ol>
          <div class="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <NuxtLink
              to="/dashboard"
              class="inline-flex items-center justify-center gap-2 kinetic-gradient text-primary-on px-6 py-3 rounded-full font-headline font-bold text-sm transition-all active:scale-95 hover:shadow-glow-emerald"
            >
              <LucideKey class="w-4 h-4" />
              Open Dashboard
            </NuxtLink>
            <NuxtLink
              to="/models"
              class="inline-flex items-center justify-center gap-2 bg-surface-container-highest text-text-main ghost-border px-6 py-3 rounded-full font-headline font-bold text-sm hover:bg-surface-container-high transition-all"
            >
              <LucideBookOpen class="w-4 h-4" />
              Browse Models
            </NuxtLink>
          </div>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <DocsInfoCard label="Base URL" :value="apiBase" />
            <DocsInfoCard label="Auth headers" value="x-api-key OR Authorization: Bearer" />
          </div>
        </div>
      </section>

      <!-- Step 2: Smoke test -->
      <section class="space-y-5 sm:space-y-6">
        <div class="flex items-center gap-4">
          <div
            class="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-primary-container text-primary-on flex items-center justify-center font-black font-headline text-base sm:text-lg"
          >
            2
          </div>
          <h2 class="text-xl sm:text-2xl md:text-3xl font-black font-headline tracking-tight">
            30-second smoke test
          </h2>
        </div>
        <div
          class="bg-surface-container-high border border-white/5 rounded-3xl p-5 sm:p-8 space-y-5"
        >
          <p class="text-sm sm:text-base text-text-muted leading-relaxed">
            Before wiring up an SDK, paste the curl below into a terminal — substitute
            your real key for <code class="font-mono text-primary-container">$KEY</code>.
            If you get back a <code class="font-mono">200</code> with a
            <code class="font-mono">content[].text</code> field, every other example
            on this page will work too.
          </p>
          <DocsCodeBlock filename="smoke-test.sh" :code="smokeCurl" />
          <div
            class="bg-primary-container/5 border border-primary-container/20 rounded-2xl p-4 sm:p-5 space-y-2"
          >
            <p class="text-[10px] font-black uppercase tracking-widest text-primary-container">
              Expected output (abridged)
            </p>
            <pre class="text-xs sm:text-sm font-mono text-text-muted overflow-x-auto custom-scrollbar">{
  "id": "msg_…",
  "type": "message",
  "role": "assistant",
  "model": "moonshotai/Kimi-K2.6",
  "content": [{"type":"text","text":" pong"}],
  "stop_reason": "end_turn",
  "usage": {"input_tokens":15,"output_tokens":43}
}</pre>
          </div>
        </div>
      </section>

      <!-- Step 3: Configure -->
      <section class="space-y-5 sm:space-y-6">
        <div class="flex items-center gap-4">
          <div
            class="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-primary-container text-primary-on flex items-center justify-center font-black font-headline text-base sm:text-lg"
          >
            3
          </div>
          <h2 class="text-xl sm:text-2xl md:text-3xl font-black font-headline tracking-tight">
            Wire it into your client
          </h2>
        </div>

        <div class="flex flex-wrap gap-2 sm:gap-3">
          <button
            v-for="tab in tabs"
            :key="tab.id"
            type="button"
            @click="activeTab = tab.id"
            class="px-5 py-2.5 rounded-full text-xs sm:text-sm font-black tracking-tight transition-all border"
            :class="
              activeTab === tab.id
                ? 'bg-primary-container text-primary-on border-primary-container shadow-lg shadow-primary-container/20'
                : 'bg-surface-container-high text-text-muted border-white/5 hover:text-text-main hover:border-primary-container/30'
            "
          >
            {{ tab.label }}
          </button>
        </div>

        <!-- ─────────────── Claude / Anthropic SDK ─────────────── -->
        <div
          v-show="activeTab === 'claude'"
          class="bg-surface-container-high border border-white/5 rounded-3xl p-5 sm:p-8 space-y-6"
        >
          <div class="space-y-2">
            <h3 class="text-lg sm:text-xl font-black font-headline tracking-tight">
              Claude / Anthropic SDK
            </h3>
            <p class="text-sm text-text-muted leading-relaxed">
              GonkaRouter implements
              <code class="font-mono text-primary-container">POST /v1/messages</code>
              with the full Anthropic Messages API surface (streaming + tool use included).
              Point an official Anthropic SDK at the gateway by overriding
              <code class="font-mono text-primary-container">base_url</code> and
              <code class="font-mono text-primary-container">api_key</code>.
            </p>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <DocsInfoCard label="Endpoint" :value="`${apiBase}/v1/messages`" />
            <DocsInfoCard label="Recommended Model" value="moonshotai/Kimi-K2.6" />
          </div>

          <!-- Install -->
          <div class="space-y-3">
            <p class="text-[10px] font-black uppercase tracking-widest text-text-muted">
              1. Install the SDK
            </p>
            <DocsCodeBlock filename="install.sh" :code="claudeInstall" />
          </div>

          <!-- Python non-stream -->
          <div class="space-y-3">
            <p class="text-[10px] font-black uppercase tracking-widest text-text-muted">
              2. Python — one-shot (tested ✓)
            </p>
            <DocsCodeBlock filename="claude_oneshot.py" :code="claudePython" />
          </div>

          <!-- Python stream -->
          <div class="space-y-3">
            <p class="text-[10px] font-black uppercase tracking-widest text-text-muted">
              3. Python — streaming (tested ✓)
            </p>
            <DocsCodeBlock filename="claude_stream.py" :code="claudeStream" />
          </div>

          <!-- TypeScript -->
          <div class="space-y-3">
            <p class="text-[10px] font-black uppercase tracking-widest text-text-muted">
              4. TypeScript / Node
            </p>
            <DocsCodeBlock filename="claude.ts" :code="claudeNode" />
          </div>

          <!-- Pitfalls -->
          <div
            class="bg-primary-container/5 border border-primary-container/20 rounded-2xl p-4 sm:p-5 space-y-3"
          >
            <p class="text-[11px] sm:text-xs font-black uppercase tracking-widest text-primary-container">
              One thing that surprises everyone
            </p>
            <ul class="space-y-2 text-xs sm:text-sm text-primary-dim leading-relaxed list-disc pl-5">
              <li>
                <span class="font-black">Set <code class="font-mono">max_tokens ≥ 1024</code>.</span>
                Kimi-K2.6 emits internal "reasoning" tokens before producing visible text.
                With a tight budget (e.g. <code class="font-mono">max_tokens=64</code>)
                you can get <code class="font-mono">stop_reason: "max_tokens"</code> and
                <code class="font-mono">content[0].text == null</code>.
              </li>
            </ul>
          </div>

          <!-- Pure curl -->
          <div class="space-y-3">
            <p class="text-[10px] font-black uppercase tracking-widest text-text-muted">
              5. Raw curl reference
            </p>
            <DocsCodeBlock filename="messages.sh" :code="claudeCurl" />
          </div>
        </div>

        <!-- ─────────────── Cursor IDE ─────────────── -->
        <div
          v-show="activeTab === 'cursor'"
          class="bg-surface-container-high border border-white/5 rounded-3xl p-5 sm:p-8 space-y-6"
        >
          <div class="space-y-2">
            <h3 class="text-lg sm:text-xl font-black font-headline tracking-tight">
              Cursor IDE
            </h3>
            <p class="text-sm text-text-muted leading-relaxed">
              Cursor speaks the OpenAI Chat Completions API. GonkaRouter exposes
              <code class="font-mono text-primary-container">POST /v1/chat/completions</code>
              one-to-one with OpenAI, so you can register it as a custom provider and
              use Gonka models from Chat, Composer, and Cmd-K inline edits.
            </p>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <DocsInfoCard label="OpenAI Base URL (Cursor field)" :value="`${apiBase}/v1`" />
            <DocsInfoCard label="API Key field" value="paste your sk-… key" />
          </div>

          <!-- Step by step -->
          <div class="space-y-4">
            <p class="text-[10px] font-black uppercase tracking-widest text-text-muted">
              Step-by-step (Cursor ≥ 0.42)
            </p>
            <ol class="space-y-4 text-sm text-text-muted leading-relaxed">
              <li class="flex gap-3">
                <span class="font-black text-primary-container shrink-0 w-7">01</span>
                <span>
                  Open <span class="text-text-main font-bold">Cursor → Settings</span>
                  (<code class="font-mono">⌘ ,</code> on macOS,
                  <code class="font-mono">Ctrl ,</code> on Windows/Linux), then go to
                  the <span class="text-text-main font-bold">Models</span> tab.
                </span>
              </li>
              <li class="flex gap-3">
                <span class="font-black text-primary-container shrink-0 w-7">02</span>
                <span>
                  Scroll to <span class="text-text-main font-bold">OpenAI API Key</span>.
                  Click <span class="text-text-main font-bold">Override OpenAI Base URL</span>
                  and paste <code class="font-mono text-primary-container">{{ apiBase }}/v1</code>.
                </span>
              </li>
              <li class="flex gap-3">
                <span class="font-black text-primary-container shrink-0 w-7">03</span>
                <span>
                  Paste your GonkaRouter key into the
                  <span class="text-text-main font-bold">OpenAI API Key</span> field
                  and click <span class="text-text-main font-bold">Verify</span>.
                  You should see a green check within a second.
                </span>
              </li>
              <li class="flex gap-3">
                <span class="font-black text-primary-container shrink-0 w-7">04</span>
                <span>
                  In the same <span class="text-text-main font-bold">Models</span> section,
                  click <span class="text-text-main font-bold">+ Add model</span> and enter
                  the model id <span class="text-text-main">exactly</span> as it appears
                  on <NuxtLink to="/models" class="text-primary-container font-bold hover:underline">/models</NuxtLink>
                  (case- and slash-sensitive). Repeat per model.
                </span>
              </li>
              <li class="flex gap-3">
                <span class="font-black text-primary-container shrink-0 w-7">05</span>
                <span>
                  <span class="text-text-main font-bold">Turn off</span> any built-in
                  Anthropic / OpenAI models you do not want Cursor to call through your
                  key — otherwise Cursor may try to verify
                  <code class="font-mono">gpt-4o</code> against the gateway and fail.
                </span>
              </li>
              <li class="flex gap-3">
                <span class="font-black text-primary-container shrink-0 w-7">06</span>
                <span>
                  Open the Chat panel (<code class="font-mono">⌘ L</code>), pick your
                  new model from the dropdown, ask <em>"Reply pong"</em>. Done.
                </span>
              </li>
            </ol>
          </div>

          <DocsCodeBlock filename="exact-values-to-paste.txt" :code="cursorValues" />

          <div
            class="bg-primary-container/5 border border-primary-container/20 rounded-2xl p-4 sm:p-5 space-y-3"
          >
            <p class="text-[11px] sm:text-xs font-black uppercase tracking-widest text-primary-container">
              Cursor-specific tips
            </p>
            <ul class="space-y-2 text-xs sm:text-sm text-primary-dim leading-relaxed list-disc pl-5">
              <li>
                Cursor sends standard OpenAI Chat Completions — no reasoning toggle,
                no Anthropic headers required.
              </li>
              <li>
                Custom models inherit Cursor's default temperature and tool-use
                behaviour. If a model emits a long <code class="font-mono">reasoning</code>
                field that fills the response, raise <span class="text-text-main">Max output tokens</span>
                in <span class="text-text-main">Settings → Models → Advanced</span> to ≥ 1024.
              </li>
              <li>
                If "Verify" fails: paste the smoke-test curl from Step 2 into a terminal
                first. If curl works but Cursor doesn't, you have a Base URL typo
                (most common: forgetting the <code class="font-mono">/v1</code> suffix).
              </li>
            </ul>
          </div>
        </div>

        <!-- ─────────────── OpenClaw / Claude Code ─────────────── -->
        <div
          v-show="activeTab === 'openclaw'"
          class="bg-surface-container-high border border-white/5 rounded-3xl p-5 sm:p-8 space-y-6"
        >
          <div class="space-y-2">
            <h3 class="text-lg sm:text-xl font-black font-headline tracking-tight">
              OpenClaw &amp; Claude Code CLIs
            </h3>
            <p class="text-sm text-text-muted leading-relaxed">
              OpenClaw, Claude Code, and most other Claude Code-derived CLIs honour the
              same two environment variables. Export them once and every
              <code class="font-mono">/v1/messages</code> call goes through GonkaRouter.
            </p>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <DocsInfoCard label="ANTHROPIC_BASE_URL" :value="apiBase" />
            <DocsInfoCard label="ANTHROPIC_AUTH_TOKEN" value="your sk-… key" />
          </div>

          <!-- Install -->
          <div class="space-y-3">
            <p class="text-[10px] font-black uppercase tracking-widest text-text-muted">
              1. Install the CLI (skip if already installed)
            </p>
            <DocsCodeBlock filename="install.sh" :code="openclawInstall" />
          </div>

          <!-- Shell config -->
          <div class="space-y-3">
            <p class="text-[10px] font-black uppercase tracking-widest text-text-muted">
              2. Add to your shell config (persistent)
            </p>
            <DocsCodeBlock filename="~/.zshrc (or ~/.bashrc)" :code="openclawEnv" />
            <p class="text-xs text-text-muted leading-relaxed">
              Reload with <code class="font-mono text-primary-container">source ~/.zshrc</code>
              (or open a new terminal). Anything launched after this point — VS Code,
              tmux, a CI runner — picks the values up automatically.
            </p>
          </div>

          <!-- Per-call -->
          <div class="space-y-3">
            <p class="text-[10px] font-black uppercase tracking-widest text-text-muted">
              3. Or set per-invocation (no shell-config changes)
            </p>
            <DocsCodeBlock filename="run.sh" :code="openclawRun" />
          </div>

          <!-- Verify -->
          <div class="space-y-3">
            <p class="text-[10px] font-black uppercase tracking-widest text-text-muted">
              4. Verify routing is active
            </p>
            <DocsCodeBlock filename="verify.sh" :code="openclawVerify" />
            <p class="text-xs text-text-muted leading-relaxed">
              The smoke-test curl uses the exact same env vars the CLI uses, so if it
              returns 200 the CLI will too.
            </p>
          </div>

          <div
            class="bg-primary-container/5 border border-primary-container/20 rounded-2xl p-4 sm:p-5 space-y-3"
          >
            <p class="text-[11px] sm:text-xs font-black uppercase tracking-widest text-primary-container">
              Gotchas
            </p>
            <ul class="space-y-2 text-xs sm:text-sm text-primary-dim leading-relaxed list-disc pl-5">
              <li>
                <span class="font-black">Domain root, no <code class="font-mono">/v1</code>.</span>
                Set <code class="font-mono">ANTHROPIC_BASE_URL={{ apiBase }}</code> —
                the CLI appends <code class="font-mono">/v1/messages</code> itself. A
                trailing <code class="font-mono">/v1</code> will produce 404s.
              </li>
              <li>
                <span class="font-black">Use <code class="font-mono">ANTHROPIC_AUTH_TOKEN</code>, not <code class="font-mono">ANTHROPIC_API_KEY</code></span>
                — the CLI maps the former to the <code class="font-mono">x-api-key</code>
                header the gateway expects.
              </li>
              <li>
                <span class="font-black">Model selection.</span>
                Some CLIs hard-code <code class="font-mono">claude-sonnet-*</code> as the
                default. Pin a Gonka model via the CLI's own setting
                (<code class="font-mono">--model moonshotai/Kimi-K2.6</code>) or via
                <code class="font-mono">ANTHROPIC_MODEL</code> if your CLI honours it.
              </li>
            </ul>
          </div>
        </div>
      </section>

      <!-- FAQ -->
      <section class="space-y-5 sm:space-y-6">
        <div class="flex items-center gap-4">
          <div
            class="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-primary-container text-primary-on flex items-center justify-center font-black font-headline text-base sm:text-lg"
          >
            4
          </div>
          <h2 class="text-xl sm:text-2xl md:text-3xl font-black font-headline tracking-tight">
            Frequently Asked Questions
          </h2>
        </div>

        <div class="space-y-3">
          <details
            v-for="(item, idx) in faqs"
            :key="idx"
            class="group bg-surface-container-high border border-white/5 rounded-2xl overflow-hidden transition-all hover:border-primary-container/30"
          >
            <summary
              class="flex items-center justify-between gap-4 p-5 sm:p-6 cursor-pointer list-none"
            >
              <span class="font-black font-headline text-sm sm:text-base tracking-tight text-text-main">
                {{ item.q }}
              </span>
              <LucideChevronDown
                class="w-5 h-5 text-text-muted shrink-0 transition-transform group-open:rotate-180"
              />
            </summary>
            <div
              class="px-5 sm:px-6 pb-5 sm:pb-6 text-sm text-text-muted leading-relaxed space-y-3"
              v-html="item.a"
            ></div>
          </details>
        </div>
      </section>

      <!-- Contact -->
      <section
        class="bg-primary-container/5 border border-primary-container/10 rounded-3xl p-6 sm:p-10 text-center space-y-4"
      >
        <h3 class="text-xl sm:text-2xl font-black font-headline tracking-tight">
          Still stuck?
        </h3>
        <p class="text-sm sm:text-base text-text-muted max-w-xl mx-auto">
          Reach the team on Telegram or send a message — we usually reply within a few hours.
        </p>
        <div class="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center pt-2">
          <a
            href="https://t.me/gonka_cn"
            target="_blank"
            rel="noreferrer"
            class="inline-flex items-center justify-center gap-2 bg-surface-container-highest text-text-main ghost-border px-6 py-3 rounded-full font-headline font-bold text-sm hover:bg-surface-container-high transition-all"
          >
            <LucideSend class="w-4 h-4" />
            Telegram
          </a>
          <a
            href="mailto:contact@gonka-router.com"
            class="inline-flex items-center justify-center gap-2 kinetic-gradient text-primary-on px-6 py-3 rounded-full font-headline font-bold text-sm transition-all active:scale-95 hover:shadow-glow-emerald"
          >
            <LucideMail class="w-4 h-4" />
            contact@gonka-router.com
          </a>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import {
  LucideArrowLeft,
  LucideKey,
  LucideBookOpen,
  LucideChevronDown,
  LucideSend,
  LucideMail
} from 'lucide-vue-next'

definePageMeta({ layout: 'landing' })

const config = useRuntimeConfig()
const apiBase = computed(() => config.public.apiBase || 'https://api.gonkascan.com')

const tabs = [
  { id: 'claude', label: 'Claude SDK' },
  { id: 'cursor', label: 'Cursor IDE' },
  { id: 'openclaw', label: 'OpenClaw / Claude Code' }
]
const activeTab = ref('claude')

const smokeCurl = computed(
  () => `KEY="sk-xxxxxx"   # paste your real key here

curl -s ${apiBase.value}/v1/messages \\
  -H "x-api-key: $KEY" \\
  -H "anthropic-version: 2023-06-01" \\
  -H "content-type: application/json" \\
  -d '{
    "model": "moonshotai/Kimi-K2.6",
    "max_tokens": 1024,
    "messages": [{"role":"user","content":"Reply with just: pong"}]
  }'
`
)

const claudeInstall = `# Python
pip install "anthropic>=0.40"

# Node / TypeScript
npm install @anthropic-ai/sdk
`

const claudePython = computed(
  () => `from anthropic import Anthropic

client = Anthropic(
    base_url="${apiBase.value}",
    api_key="sk-xxxxxx",  # your GonkaRouter key
)

msg = client.messages.create(
    model="moonshotai/Kimi-K2.6",
    max_tokens=1024,             # keep ≥ 1024 — see "reasoning tokens" note below
    messages=[
        {"role": "user", "content": "Reply with just: pong"},
    ],
)

# content is a list of blocks; grab the first text block.
text = next((b.text for b in msg.content if getattr(b, "text", None)), "")
print(text)                       # -> "pong"
print(msg.usage)                  # -> input_tokens=…, output_tokens=…
`
)

const claudeStream = computed(
  () => `from anthropic import Anthropic

client = Anthropic(
    base_url="${apiBase.value}",
    api_key="sk-xxxxxx",
)

# Idiomatic Anthropic streaming — text_stream yields each token chunk as a string.
with client.messages.stream(
    model="moonshotai/Kimi-K2.6",
    max_tokens=1024,
    messages=[{"role": "user", "content": "Say hello in exactly three words."}],
) as stream:
    for chunk in stream.text_stream:
        print(chunk, end="", flush=True)
    final = stream.get_final_message()

print()
print("usage:", final.usage)
`
)

const claudeNode = computed(
  () => `import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic({
  baseURL: "${apiBase.value}",
  apiKey: process.env.GONKA_API_KEY!,   // sk-xxxxxx
});

// One-shot
const msg = await client.messages.create({
  model: "moonshotai/Kimi-K2.6",
  max_tokens: 1024,
  messages: [{ role: "user", content: "Reply with just: pong" }],
});
const text = msg.content
  .filter((b): b is Anthropic.TextBlock => b.type === "text")
  .map((b) => b.text)
  .join("");
console.log(text);

// Streaming — idiomatic helper
const stream = client.messages.stream({
  model: "moonshotai/Kimi-K2.6",
  max_tokens: 1024,
  messages: [{ role: "user", content: "Say hello in three words." }],
});
for await (const chunk of stream) {
  if (chunk.type === "content_block_delta" && chunk.delta.type === "text_delta") {
    process.stdout.write(chunk.delta.text);
  }
}
const finalMsg = await stream.finalMessage();
console.log("\\nusage:", finalMsg.usage);
`
)

const claudeCurl = computed(
  () => `curl ${apiBase.value}/v1/messages \\
  -H "x-api-key: sk-xxxxxx" \\
  -H "anthropic-version: 2023-06-01" \\
  -H "content-type: application/json" \\
  -d '{
    "model": "moonshotai/Kimi-K2.6",
    "max_tokens": 1024,
    "messages": [
      {"role": "user", "content": "Hello!"}
    ]
  }'

# Streaming variant — add "stream": true to the JSON body and pipe to a parser.
`
)

const cursorValues = computed(
  () => `# Paste these EXACT values into Cursor → Settings → Models
OpenAI Base URL:  ${apiBase.value}/v1
OpenAI API Key:   sk-xxxxxx          # your GonkaRouter key
Model name #1:    moonshotai/Kimi-K2.6
Model name #2:    Qwen/Qwen3-235B-A22B-Instruct-2507-FP8

# Optional Settings → Models → Advanced
Max output tokens: 4096               # protects against reasoning-token starvation
`
)

const openclawInstall = `# OpenClaw (community fork)
npm install -g openclaw

# Anthropic's official Claude Code (works with the same env vars)
npm install -g @anthropic-ai/claude-code
`

const openclawEnv = computed(
  () => `# Base URL is the DOMAIN ROOT — no /v1 suffix.
export ANTHROPIC_BASE_URL="${apiBase.value}"
export ANTHROPIC_AUTH_TOKEN="sk-xxxxxx"        # your GonkaRouter key
export ANTHROPIC_MODEL="moonshotai/Kimi-K2.6"  # honoured by openclaw + claude-code

# Then just launch the CLI normally:
openclaw          # or:  claude
`
)

const openclawRun = computed(
  () => `ANTHROPIC_BASE_URL="${apiBase.value}" \\
ANTHROPIC_AUTH_TOKEN="sk-xxxxxx" \\
ANTHROPIC_MODEL="moonshotai/Kimi-K2.6" \\
openclaw "Refactor this function for readability"
`
)

const openclawVerify = computed(
  () => `# Reproduces exactly what the CLI sends on the wire.
curl -s "$ANTHROPIC_BASE_URL/v1/messages" \\
  -H "x-api-key: $ANTHROPIC_AUTH_TOKEN" \\
  -H "anthropic-version: 2023-06-01" \\
  -H "content-type: application/json" \\
  -d "{\\"model\\":\\"$ANTHROPIC_MODEL\\",\\"max_tokens\\":1024,\\"messages\\":[{\\"role\\":\\"user\\",\\"content\\":\\"ping\\"}]}" \\
  | head -c 200; echo
`
)

const faqs = [
  {
    q: 'Where do I find my API key?',
    a: 'Sign in at <a href="/dashboard" class="text-primary-container font-bold hover:underline">Dashboard</a> and open the API Keys panel. Each key is shown only once at creation — store it in a secret manager or <code class="font-mono">.env</code> file and never commit it to git.'
  },
  {
    q: 'Which models can I call?',
    a: 'The live, machine-readable list is at <code class="font-mono text-primary-container">GET /v1/models</code>. Currently: <ul class="list-disc pl-5 mt-2 space-y-1"><li><code class="font-mono text-primary-container">moonshotai/Kimi-K2.6</code> — long-context reasoning, recommended default.</li><li><code class="font-mono text-primary-container">Qwen/Qwen3-235B-A22B-Instruct-2507-FP8</code> — 235B Mixture-of-Experts, fast TTFT.</li></ul>The human-readable catalogue is at <a href="/models" class="text-primary-container font-bold hover:underline">/models</a>.'
  },
  {
    q: 'Why does my response come back with text: null?',
    a: 'You set <code class="font-mono">max_tokens</code> too low. Kimi-K2.6 spends some tokens on internal reasoning before any visible text is emitted; with e.g. <code class="font-mono">max_tokens=64</code> reasoning can consume the entire budget and leave <code class="font-mono">content[0].text</code> empty (you will also see <code class="font-mono">stop_reason: "max_tokens"</code>). <span class="font-bold">Use <code class="font-mono">max_tokens ≥ 1024</code></span> as a safe default.'
  },
  {
    q: 'Does Anthropic streaming work?',
    a: 'Yes — fully spec-compliant. <code class="font-mono">/v1/messages</code> with <code class="font-mono">"stream": true</code>, the low-level <code class="font-mono">create(stream=True)</code>, and the idiomatic <code class="font-mono">client.messages.stream(...)</code> context manager all work. SSE events emitted: <code class="font-mono">message_start</code> → <code class="font-mono">content_block_start</code> → <code class="font-mono">content_block_delta</code>* → <code class="font-mono">content_block_stop</code> → <code class="font-mono">message_delta</code> → <code class="font-mono">message_stop</code>.'
  },
  {
    q: 'OpenAI SDK or Anthropic SDK — which should I pick?',
    a: 'Both work; pick by ecosystem fit. <ul class="list-disc pl-5 mt-2 space-y-1"><li><span class="font-bold">OpenAI SDK</span> (<code class="font-mono">/v1/chat/completions</code>) — best for Cursor, LangChain, LlamaIndex, anything OpenAI-shaped.</li><li><span class="font-bold">Anthropic SDK</span> (<code class="font-mono">/v1/messages</code>) — best for Claude Code / OpenClaw, anthropic-sdk-python projects, code that uses <code class="font-mono">tool_use</code> / <code class="font-mono">tool_result</code> blocks.</li></ul>'
  },
  {
    q: 'How is usage billed?',
    a: 'Per-token at <span class="font-bold text-primary-container">$0.001 per 1M tokens</span>, debited from your prepaid balance. Open <a href="/transactions" class="text-primary-container font-bold hover:underline">Transactions</a> to see every call, token count, and deduction.'
  },
  {
    q: 'What about new-user credits?',
    a: 'Every new account receives <span class="font-bold text-primary-container">$20 daily credits for 7 days</span>. Unused daily credits expire at end of day — top up before day 7 if you want a smooth handoff to paid usage.'
  },
  {
    q: 'I get 401 / authentication_error.',
    a: '<ul class="list-disc pl-5 space-y-1"><li>Confirm the key is still active in <a href="/dashboard" class="text-primary-container font-bold hover:underline">Dashboard</a>.</li><li>OpenAI clients must send <code class="font-mono">Authorization: Bearer sk-…</code>. Anthropic clients send <code class="font-mono">x-api-key: sk-…</code>. The gateway accepts both, but make sure your SDK is configured for one of them.</li><li>For Claude Code-style CLIs, the env var is <code class="font-mono">ANTHROPIC_AUTH_TOKEN</code>, not <code class="font-mono">ANTHROPIC_API_KEY</code>.</li></ul>'
  },
  {
    q: 'I get 403 / "balance is zero, please deposit first".',
    a: 'Your prepaid balance is empty and the daily trial credits have run out. Open <a href="/dashboard" class="text-primary-container font-bold hover:underline">Dashboard → Top Up</a> to add credit; the same key resumes working as soon as the balance is positive.'
  },
  {
    q: 'I get 400 / "model not available for your channel".',
    a: 'You requested a model ID that is not enabled on your account. Hit <code class="font-mono">GET /v1/models</code> with your key to see what you can actually call. Common cause: a typo in the slash or case (<code class="font-mono">moonshotai/Kimi-K2.6</code>, not <code class="font-mono">Kimi-K2.6</code>).'
  },
  {
    q: 'Can I use this from a browser?',
    a: 'No. API keys must never live in client-side code. Proxy every call through your own backend so the secret never leaves your servers.'
  },
  {
    q: 'Is tool / function calling supported?',
    a: 'Yes on both surfaces. OpenAI <code class="font-mono">tools</code> / <code class="font-mono">tool_choice</code> work natively on <code class="font-mono">/v1/chat/completions</code>. On <code class="font-mono">/v1/messages</code>, Anthropic <code class="font-mono">tool_use</code> / <code class="font-mono">tool_result</code> blocks are translated to OpenAI tool calls upstream and back, so the official Anthropic SDK works without changes.'
  }
]
</script>

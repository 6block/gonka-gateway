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
          Drop your GonkaRouter key into Claude SDKs, Cursor IDE, OpenClaw, or WorkBuddy
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
            <li>Open the <NuxtLink to="/dashboard" class="text-primary-container font-bold hover:underline">Dashboard</NuxtLink>, sign in with email or Google.</li>
            <li>Click <span class="text-text-main font-bold">Create API Key</span>, give it a label, copy the value.</li>
            <li>New accounts get <span class="text-primary-container font-bold">a one-time $20 free credit</span>, so you can try every model before topping up.</li>
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
            Before wiring up an SDK, run the snippet below in a terminal — pick your OS
            tab and substitute your real key. If you get back a
            <code class="font-mono">200</code> with a
            <code class="font-mono">content[].text</code> field, every other example
            on this page will work too.
          </p>
          <p class="text-xs sm:text-sm text-text-muted leading-relaxed">
            On Windows, pick the <span class="font-bold text-text-main">Windows (cmd)</span> tab
            and run it in the Command Prompt (<code class="font-mono">cmd</code>) —
            <code class="font-mono">curl.exe</code> ships with Windows 10 and later, so no
            extra install is needed.
          </p>
          <DocsCodeBlock :variants="smokeCurl" />
          <div
            class="bg-surface-container-highest/40 border border-white/5 border-l-2 border-l-primary-container/50 rounded-2xl p-4 sm:p-5 space-y-2"
          >
            <p class="text-[10px] font-black uppercase tracking-widest text-text-muted">
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
            <DocsInfoCard label="Recommended Model" value="MiniMaxAI/MiniMax-M2.7" />
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
          <!-- <div
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
          </div> -->

          <!-- Pure curl -->
          <div class="space-y-3">
            <p class="text-[10px] font-black uppercase tracking-widest text-text-muted">
              5. Raw curl reference
            </p>
            <DocsCodeBlock :variants="claudeCurl" />
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

          <!-- Free Plan limitation callout -->
          <div
            class="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-4 sm:p-5 space-y-2"
          >
            <p class="text-[11px] sm:text-xs font-black uppercase tracking-widest text-amber-400">
              Heads up — Cursor Free Plan won't route to your gateway
            </p>
            <p class="text-xs sm:text-sm text-amber-200/90 leading-relaxed">
              As of late 2025, <span class="font-bold">Cursor Free</span> blocks
              <em>Named Models</em>: even if you configure Custom Base URL + API key + a
              custom model name correctly, Cursor pops up
              <em>"Named models unavailable. Free plans can only use Auto."</em>
              and silently routes the request to its own Auto provider — your gateway is
              never called. The steps below work <span class="font-bold">only on Cursor Pro</span>.
              On the Free tier, use a free OpenAI-compatible client instead: e.g.
              <a href="https://continue.dev" target="_blank" rel="noreferrer" class="font-bold underline hover:text-amber-100">Continue.dev</a>,
              <a href="https://cline.bot" target="_blank" rel="noreferrer" class="font-bold underline hover:text-amber-100">Cline</a>,
              or <a href="https://aider.chat" target="_blank" rel="noreferrer" class="font-bold underline hover:text-amber-100">Aider</a> —
              they accept the same Base URL + key with no plan gating.
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
                <span class="font-black text-text-muted shrink-0 w-7 font-mono text-xs pt-0.5">01</span>
                <span>
                  Open <span class="text-text-main font-bold">Cursor → Settings</span>
                  (<code class="font-mono">⌘ ,</code> on macOS,
                  <code class="font-mono">Ctrl ,</code> on Windows/Linux), then go to
                  the <span class="text-text-main font-bold">Models</span> tab.
                </span>
              </li>
              <li class="flex gap-3">
                <span class="font-black text-text-muted shrink-0 w-7 font-mono text-xs pt-0.5">02</span>
                <span>
                  Scroll to <span class="text-text-main font-bold">OpenAI API Key</span>.
                  Click <span class="text-text-main font-bold">Override OpenAI Base URL</span>
                  and paste <code class="font-mono text-primary-container">{{ apiBase }}/v1</code>.
                </span>
              </li>
              <li class="flex gap-3">
                <span class="font-black text-text-muted shrink-0 w-7 font-mono text-xs pt-0.5">03</span>
                <span>
                  Paste your GonkaRouter key into the
                  <span class="text-text-main font-bold">OpenAI API Key</span> field
                  and click <span class="text-text-main font-bold">Verify</span>.
                  You should see a green check within a second.
                </span>
              </li>
              <li class="flex gap-3">
                <span class="font-black text-text-muted shrink-0 w-7 font-mono text-xs pt-0.5">04</span>
                <span>
                  In the same <span class="text-text-main font-bold">Models</span> section,
                  click <span class="text-text-main font-bold">+ Add model</span> and enter
                  the model id <span class="text-text-main">exactly</span> as it appears
                  on <NuxtLink to="/models" class="text-primary-container font-bold hover:underline">/models</NuxtLink>
                  (case- and slash-sensitive). Repeat per model.
                </span>
              </li>
              <li class="flex gap-3">
                <span class="font-black text-text-muted shrink-0 w-7 font-mono text-xs pt-0.5">05</span>
                <span>
                  <span class="text-text-main font-bold">Turn off</span> any built-in
                  Anthropic / OpenAI models you do not want Cursor to call through your
                  key — otherwise Cursor may try to verify
                  <code class="font-mono">gpt-4o</code> against the gateway and fail.
                </span>
              </li>
              <li class="flex gap-3">
                <span class="font-black text-text-muted shrink-0 w-7 font-mono text-xs pt-0.5">06</span>
                <span>
                  Open the Chat panel (<code class="font-mono">⌘ L</code>), pick your
                  new model from the dropdown, ask <em>"Reply pong"</em>. Done.
                </span>
              </li>
            </ol>
          </div>

          <DocsCodeBlock filename="exact-values-to-paste.txt" :code="cursorValues" />

          <div
            class="bg-surface-container-highest/40 border border-white/5 rounded-2xl p-4 sm:p-5 space-y-3"
          >
            <p class="text-[11px] sm:text-xs font-black uppercase tracking-widest text-text-muted">
              Cursor-specific tips
            </p>
            <ul class="space-y-2 text-xs sm:text-sm text-text-muted leading-relaxed list-disc pl-5 marker:text-text-muted/40">
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

        <!-- ─────────────── Claude Code CLI ─────────────── -->
        <div
          v-show="activeTab === 'claude-code'"
          class="bg-surface-container-high border border-white/5 rounded-3xl p-5 sm:p-8 space-y-6"
        >
          <div class="space-y-2">
            <h3 class="text-lg sm:text-xl font-black font-headline tracking-tight">
              Claude Code CLI (Anthropic official)
            </h3>
            <p class="text-sm text-text-muted leading-relaxed">
              Anthropic's official
              <code class="font-mono text-primary-container">@anthropic-ai/claude-code</code>
              CLI honours <code class="font-mono">ANTHROPIC_BASE_URL</code> and
              <code class="font-mono">ANTHROPIC_AUTH_TOKEN</code> — so you can
              point it at GonkaRouter with a few env vars and use the full agentic
              workflow (file edits, tool calls, slash commands) backed by Gonka models.
            </p>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <DocsInfoCard label="ANTHROPIC_BASE_URL" :value="apiBase" />
            <DocsInfoCard label="ANTHROPIC_AUTH_TOKEN" value="your sk-… key" />
          </div>

          <!-- Install -->
          <div class="space-y-3">
            <p class="text-[10px] font-black uppercase tracking-widest text-text-muted">
              1. Install Claude Code
            </p>
            <DocsCodeBlock filename="install.sh" :code="claudeCodeInstall" />
          </div>

          <!-- Isolated HOME -->
          <div class="space-y-3">
            <p class="text-[10px] font-black uppercase tracking-widest text-text-muted">
              2. Launch with an isolated HOME (recommended)
            </p>
            <DocsCodeBlock :variants="claudeCodeRun" />
            <p class="text-xs text-text-muted leading-relaxed">
              Use this exact incantation when you want Claude Code to route
              <span class="font-bold">cleanly through GonkaRouter</span> without
              touching your existing Anthropic OAuth session.
            </p>
            <div
              class="bg-amber-500/[0.04] border border-amber-500/20 rounded-2xl p-4 sm:p-5 space-y-2"
            >
              <p class="text-[11px] sm:text-xs font-black uppercase tracking-widest text-amber-400/90 flex items-center gap-2">
                <LucideTriangleAlert class="w-3.5 h-3.5" />
                Only if you prefer PowerShell — "running scripts is disabled on this system"
              </p>
              <p class="text-xs sm:text-sm text-text-muted leading-relaxed">
                The cmd steps above run <code class="font-mono">claude</code> fine. But if you
                launch it from <span class="font-bold">PowerShell</span> instead, npm's
                <code class="font-mono">claude.ps1</code> is blocked by default
                (<code class="font-mono">Restricted</code> execution policy). Run this
                <span class="font-bold">once</span> to allow local scripts for your own user:
              </p>
              <DocsCodeBlock
                filename="allow-scripts.ps1"
                code="Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned
# answer Y when prompted. (In cmd you don't need this at all.)"
              />
            </div>
          </div>

          <!-- Why each var -->
          <div
            class="bg-surface-container-highest/40 border border-white/5 rounded-2xl p-4 sm:p-5 space-y-3"
          >
            <p class="text-[11px] sm:text-xs font-black uppercase tracking-widest text-text-muted">
              What each env var does
            </p>
            <ul class="space-y-2.5 text-xs sm:text-sm text-text-muted leading-relaxed list-disc pl-5 marker:text-text-muted/40">
              <li>
                <code class="font-mono text-text-main">HOME=/tmp/gonka-claude-home</code> —
                <span class="font-bold text-text-main">isolates the credentials store.</span>
                Without this, Claude Code reads <code class="font-mono">~/.claude/credentials</code>,
                finds your existing OAuth session for Anthropic.com, and silently
                ignores <code class="font-mono">ANTHROPIC_AUTH_TOKEN</code>. The throwaway
                HOME forces it to fall back to the env-var path.
              </li>
              <li>
                <code class="font-mono text-text-main">ANTHROPIC_BASE_URL</code> — domain root, no
                <code class="font-mono">/v1</code> suffix. The CLI appends
                <code class="font-mono">/v1/messages</code> itself.
              </li>
              <li>
                <code class="font-mono text-text-main">ANTHROPIC_AUTH_TOKEN</code> — your GonkaRouter
                key. Sent as <code class="font-mono">x-api-key</code>. Note: it's
                <code class="font-mono">_AUTH_TOKEN</code>, not
                <code class="font-mono">_API_KEY</code>.
              </li>
              <li>
                <code class="font-mono text-text-main">ANTHROPIC_MODEL</code> — primary model used for
                main reasoning. Pin to a Gonka model id (slashes preserved).
              </li>
              <li>
                <code class="font-mono text-text-main">ANTHROPIC_SMALL_FAST_MODEL</code> — model used
                for sidecar tasks (file summaries, planner checks). Set it to the same
                Gonka model so every internal call still routes through your gateway.
              </li>
              <li>
                <code class="font-mono text-text-main">DISABLE_PROMPT_CACHING=1</code> — the gateway
                does not implement Anthropic's prompt-caching headers; disable client
                caching to avoid <code class="font-mono">cache_control</code> requests
                that the gateway can't honour.
              </li>
            </ul>
          </div>

          <!-- Persistent path -->
          <div class="space-y-3">
            <p class="text-[10px] font-black uppercase tracking-widest text-text-muted">
              3. (Optional) Wrap it in a shell function so you don't retype every time
            </p>
            <DocsCodeBlock :variants="claudeCodeShellFn" />
          </div>

          <!-- Gotchas -->
          <div
            class="bg-amber-500/[0.04] border border-amber-500/20 rounded-2xl p-4 sm:p-5 space-y-3"
          >
            <p class="text-[11px] sm:text-xs font-black uppercase tracking-widest text-amber-400/90 flex items-center gap-2">
              <LucideTriangleAlert class="w-3.5 h-3.5" />
              Gotchas
            </p>
            <ul class="space-y-2.5 text-xs sm:text-sm text-text-muted leading-relaxed list-disc pl-5 marker:text-amber-500/40">
              <li>
                <span class="font-black text-text-main">Already logged into Anthropic?</span> Without
                the isolated <code class="font-mono">HOME</code> the CLI will keep using
                OAuth and bill your Anthropic account instead. Verify routing by running
                <code class="font-mono">/status</code> inside the REPL — it should print
                <code class="font-mono">{{ apiBase }}</code> as the base URL.
              </li>
              <li>
                <span class="font-black text-text-main">Working directory state.</span> The isolated
                HOME means a fresh session history every time. To keep history, replace
                <code class="font-mono">/tmp/gonka-claude-home</code> with a persistent
                path like <code class="font-mono">~/.gonka-claude-home</code>.
              </li>
              <li>
                <span class="font-black text-text-main">Model id is case-sensitive.</span>
                <code class="font-mono">moonshotai/Kimi-K2.6</code> works,
                <code class="font-mono">Kimi-K2.6</code> alone returns
                <em>model not available for your channel</em>.
              </li>
            </ul>
          </div>
        </div>

        <!-- ─────────────── OpenClaw ─────────────── -->
        <div
          v-show="activeTab === 'openclaw'"
          class="bg-surface-container-high border border-white/5 rounded-3xl p-5 sm:p-8 space-y-6"
        >
          <div class="space-y-2">
            <h3 class="text-lg sm:text-xl font-black font-headline tracking-tight">
              OpenClaw
            </h3>
            <p class="text-sm text-text-muted leading-relaxed">
              OpenClaw is a multi-provider agent platform with its own provider catalog —
              unlike Anthropic's Claude Code, it does <span class="font-bold">not</span>
              read <code class="font-mono">ANTHROPIC_BASE_URL</code>. You register
              GonkaRouter as a custom <code class="font-mono">gonka</code> provider in
              <code class="font-mono">~/.openclaw/openclaw.json</code> and use it via
              the <code class="font-mono">anthropic-messages</code> adapter. End-to-end
              tested against
              <code class="font-mono text-primary-container">{{ apiBase }}</code>.
            </p>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <DocsInfoCard label="Provider id" value="gonka" />
            <DocsInfoCard label="API adapter" value="anthropic-messages" />
          </div>

          <!-- Prereq -->
          <div class="space-y-3">
            <p class="text-[10px] font-black uppercase tracking-widest text-text-muted">
              1. Prerequisite — Node ≥ 22.12
            </p>
            <DocsCodeBlock :variants="openclawPrereq" />
            <p class="text-xs text-text-muted leading-relaxed">
              OpenClaw requires Node 22 LTS. If <code class="font-mono">node -v</code>
              shows v20.x you'll get <code class="font-mono">Node.js v22.12+ is required</code>
              and the CLI refuses to start.
            </p>
          </div>

          <!-- Install -->
          <div class="space-y-3">
            <p class="text-[10px] font-black uppercase tracking-widest text-text-muted">
              2. Install OpenClaw
            </p>
            <DocsCodeBlock filename="install.sh" :code="openclawInstall" />
          </div>

          <!-- Provider config -->
          <div class="space-y-3">
            <p class="text-[10px] font-black uppercase tracking-widest text-text-muted">
              3. Register the <code class="font-mono">gonka</code> provider
            </p>
            <DocsCodeBlock :variants="openclawProvider" />
            <DocsCodeBlock :variants="openclawApply" />
            <p class="text-xs text-text-muted leading-relaxed">
              The patch validates against OpenClaw's JSON schema before writing, and the
              previous config is auto-backed up to
              <code class="font-mono">openclaw.json.bak</code>. The API key is stored
              redacted in <code class="font-mono">openclaw config get</code> output.
            </p>
          </div>

          <!-- Daemon -->
          <div class="space-y-3">
            <p class="text-[10px] font-black uppercase tracking-widest text-text-muted">
              4. Start the Gateway daemon
            </p>
            <DocsCodeBlock filename="daemon.sh" :code="openclawDaemon" />
            <p class="text-xs text-text-muted leading-relaxed">
              <code class="font-mono">gateway.mode=local</code> is required — without it
              the daemon exits with
              <em>"Gateway start blocked: existing config is missing gateway.mode"</em>.
            </p>
          </div>

          <!-- Three usage paths -->
          <div class="space-y-3">
            <p class="text-[10px] font-black uppercase tracking-widest text-text-muted">
              5. Three ways to use it
            </p>
            <DocsCodeBlock :variants="openclawRun" />
            <p class="text-xs text-text-muted leading-relaxed">
              All three modes resolve <code class="font-mono">gonka/&lt;model-id&gt;</code>
              against your registered provider. The Dashboard's
              <span class="font-bold">Models</span> panel lists the configured Gonka
              models in the picker — choose one and chat normally.
            </p>
          </div>

          <!-- Expected output -->
          <div
            class="bg-surface-container-highest/40 border border-white/5 border-l-2 border-l-primary-container/50 rounded-2xl p-4 sm:p-5 space-y-2"
          >
            <p class="text-[10px] font-black uppercase tracking-widest text-text-muted">
              Expected output of step 5's one-shot call
            </p>
            <pre class="text-xs sm:text-sm font-mono text-text-muted overflow-x-auto custom-scrollbar">{
  "ok": true,
  "capability": "model.run",
  "transport": "local",
  "provider": "gonka",
  "model": "moonshotai/Kimi-K2.6",
  "outputs": [{"text": "pong", "mediaUrl": null}]
}</pre>
          </div>

          <!-- Gotchas -->
          <div
            class="bg-amber-500/[0.04] border border-amber-500/20 rounded-2xl p-4 sm:p-5 space-y-3"
          >
            <p class="text-[11px] sm:text-xs font-black uppercase tracking-widest text-amber-400/90 flex items-center gap-2">
              <LucideTriangleAlert class="w-3.5 h-3.5" />
              Gotchas
            </p>
            <ul class="space-y-2.5 text-xs sm:text-sm text-text-muted leading-relaxed list-disc pl-5 marker:text-amber-500/40">
              <li>
                <span class="font-black text-text-main">Model id is <code class="font-mono">gonka/&lt;real-id&gt;</code>.</span>
                The prefix is the provider id you registered, not the underlying
                <code class="font-mono">anthropic/</code> path. Slashes inside the model
                id are part of the id and must be preserved verbatim
                (<code class="font-mono">gonka/moonshotai/Kimi-K2.6</code>).
              </li>
              <li>
                <span class="font-black text-text-main">Daemon vs. <code class="font-mono">--local</code>.</span>
                The <code class="font-mono">--local</code> flag bypasses the Gateway
                daemon and dials your provider directly from the CLI process — useful
                for one-off scripts and CI where you don't want a long-running daemon.
                Omit it and the daemon (port 18789) handles routing.
              </li>
              <li>
                <span class="font-black text-text-main">Anthropic's own Claude Code CLI is different.</span>
                The official <code class="font-mono">@anthropic-ai/claude-code</code> CLI
                <em>does</em> honour <code class="font-mono">ANTHROPIC_BASE_URL</code> /
                <code class="font-mono">ANTHROPIC_AUTH_TOKEN</code>. If that's what you
                meant by "OpenClaw", see the Claude SDK tab — the env-var pattern there
                applies to that CLI too.
              </li>
            </ul>
          </div>
        </div>

        <!-- WorkBuddy -->
        <div
          v-show="activeTab === 'workbuddy'"
          class="bg-surface-container-high border border-white/5 rounded-3xl p-5 sm:p-8 space-y-6"
        >
          <div class="space-y-2">
            <h3 class="text-lg sm:text-xl font-black font-headline tracking-tight">
              WorkBuddy
            </h3>
            <p class="text-sm text-text-muted leading-relaxed">
              WorkBuddy speaks the OpenAI Chat Completions API, so GonkaRouter plugs in
              as a <span class="font-bold">Custom</span> provider. Verified against
              WorkBuddy <code class="font-mono">v5.3.11</code>.
            </p>
          </div>

          <!-- The one thing that trips everyone up -->
          <div
            class="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-4 sm:p-5 space-y-2"
          >
            <p class="text-[11px] sm:text-xs font-black uppercase tracking-widest text-amber-400">
              Read this first — the endpoint field takes the full path
            </p>
            <p class="text-xs sm:text-sm text-amber-200/90 leading-relaxed">
              Unlike every other client on this page, WorkBuddy's
              <span class="font-bold">Interface URL</span> field is the
              <span class="font-bold">complete endpoint</span>, not a base URL — it does
              <span class="font-bold">not</span> append
              <code class="font-mono">/chat/completions</code> for you. Paste the full
              path or the request lands on the wrong route and the model errors out with
              a bare <code class="font-mono">404 page not found</code>:
            </p>
            <ul class="space-y-1.5 text-xs sm:text-sm text-amber-200/90 leading-relaxed">
              <li>
                <span class="text-red-300 font-black mr-1.5">✗</span>
                <code class="font-mono">{{ apiBase }}</code> → posts to
                <code class="font-mono">/</code> → 404
              </li>
              <li>
                <span class="text-red-300 font-black mr-1.5">✗</span>
                <code class="font-mono">{{ apiBase }}/v1</code> → posts to
                <code class="font-mono">/v1</code> → 404
              </li>
              <li>
                <span class="text-emerald-300 font-black mr-1.5">✓</span>
                <code class="font-mono">{{ apiBase }}/v1/chat/completions</code>
              </li>
            </ul>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <DocsInfoCard
              label="Interface URL"
              :value="`${apiBase}/v1/chat/completions`"
            />
            <DocsInfoCard label="API Key" value="paste your sk-… key" />
          </div>

          <!-- Step by step -->
          <div class="space-y-4">
            <p class="text-[10px] font-black uppercase tracking-widest text-text-muted">
              Step-by-step
            </p>
            <ol class="space-y-4 text-sm text-text-muted leading-relaxed">
              <li class="flex gap-3">
                <span class="font-black text-text-muted shrink-0 w-7 font-mono text-xs pt-0.5">01</span>
                <span>
                  Open <span class="text-text-main font-bold">Settings → Models</span>
                  and click <span class="text-text-main font-bold">Add Model</span>.
                </span>
              </li>
              <li class="flex gap-3">
                <span class="font-black text-text-muted shrink-0 w-7 font-mono text-xs pt-0.5">02</span>
                <span>
                  Set <span class="text-text-main font-bold">Provider</span> to
                  <span class="text-text-main font-bold">Custom</span>. The named
                  entries in that dropdown (Kimi, MiniMax, Zhipu …) point at those vendors'
                  own endpoints, not at your gateway.
                </span>
              </li>
              <li class="flex gap-3">
                <span class="font-black text-text-muted shrink-0 w-7 font-mono text-xs pt-0.5">03</span>
                <span>
                  <span class="text-text-main font-bold">Interface URL</span> —
                  paste
                  <code class="font-mono text-primary-container">{{ apiBase }}/v1/chat/completions</code>
                  in full, as explained above.
                </span>
              </li>
              <li class="flex gap-3">
                <span class="font-black text-text-muted shrink-0 w-7 font-mono text-xs pt-0.5">04</span>
                <span>
                  <span class="text-text-main font-bold">API Key</span> — paste your
                  <code class="font-mono">sk-…</code> key from the Dashboard.
                </span>
              </li>
              <li class="flex gap-3">
                <span class="font-black text-text-muted shrink-0 w-7 font-mono text-xs pt-0.5">05</span>
                <span>
                  <span class="text-text-main font-bold">Model Name</span> —
                  the model id exactly as listed on
                  <NuxtLink to="/models" class="font-bold underline hover:text-text-main">Models</NuxtLink>,
                  e.g. <code class="font-mono text-primary-container">MiniMaxAI/MiniMax-M2.7</code>
                  or <code class="font-mono text-primary-container">moonshotai/Kimi-K2.6</code>.
                  Case and slashes matter.
                </span>
              </li>
              <li class="flex gap-3">
                <span class="font-black text-text-muted shrink-0 w-7 font-mono text-xs pt-0.5">06</span>
                <span>
                  Under <span class="text-text-main font-bold">Advanced</span>, tick the
                  capabilities the model actually has — tool calling, image input,
                  reasoning. These are independent capability switches, not a protocol
                  picker, and none of them affect routing. Leave the context and output
                  size fields blank to use provider defaults.
                </span>
              </li>
              <li class="flex gap-3">
                <span class="font-black text-text-muted shrink-0 w-7 font-mono text-xs pt-0.5">07</span>
                <span>
                  <span class="text-text-main font-bold">Save</span>, start a new
                  task, pick the model in the composer's model selector, and send a
                  message.
                </span>
              </li>
            </ol>
          </div>

          <!-- Verify -->
          <div class="space-y-3">
            <p class="text-[10px] font-black uppercase tracking-widest text-text-muted">
              Verify the endpoint before blaming the client
            </p>
            <DocsCodeBlock filename="verify.sh" :code="workbuddyVerify" />
            <p class="text-xs text-text-muted leading-relaxed">
              If this returns a completion but WorkBuddy still fails, the problem is in
              the client config — recheck step 03 first.
            </p>
          </div>

          <!-- Gotchas -->
          <div
            class="bg-amber-500/[0.04] border border-amber-500/20 rounded-2xl p-4 sm:p-5 space-y-3"
          >
            <p class="text-[11px] sm:text-xs font-black uppercase tracking-widest text-amber-400/90 flex items-center gap-2">
              <LucideTriangleAlert class="w-3.5 h-3.5" />
              Gotchas
            </p>
            <ul class="space-y-2.5 text-xs sm:text-sm text-text-muted leading-relaxed list-disc pl-5 marker:text-amber-500/40">
              <li>
                <span class="font-black text-text-main">A 404 here is almost always the URL.</span>
                <code class="font-mono">404 page not found</code> is the router's
                response to an unregistered path — it means the request reached us but
                the path was wrong. An invalid key returns
                <code class="font-mono">401</code>, and an unknown model returns
                <code class="font-mono">400</code>, so neither of those looks like a 404.
              </li>
              <li>
                <span class="font-black text-text-main">Output is capped at 4096 tokens.</span>
                Long agent turns get cut off with
                <code class="font-mono">MAX_TOKENS</code>. Omitting
                <code class="font-mono">max_tokens</code> yields an even lower default of
                3072, and asking for more than 4096 is silently clamped back down, so the
                cap cannot be raised from the client. For reasoning models the thinking
                tokens count toward it too. Ask for shorter replies, or continue the
                turn after a truncation.
              </li>
              <li>
                <span class="font-black text-text-main">Model ids differ per gateway plan.</span>
                Vendor-prefixed ids like
                <code class="font-mono">MiniMaxAI/MiniMax-M2.7</code> and short ids like
                <code class="font-mono">kimi-k2.6</code> belong to different catalogs. Copy
                whatever the <NuxtLink to="/models" class="font-bold underline hover:text-text-main">Models</NuxtLink>
                page shows for your key.
              </li>
              <li>
                <span class="font-black text-text-main">Requests are relayed by WorkBuddy's own backend.</span>
                Calls arrive via WorkBuddy's SaaS layer rather than straight from your
                machine, which is why its error reports carry two ids. When contacting
                support, quote the Trace ID from the error card.
              </li>
            </ul>
          </div>
        </div>
      </section>

      <!-- Limits & Specifications -->
      <section class="space-y-5 sm:space-y-6">
        <div class="flex items-center gap-4">
          <div
            class="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-primary-container text-primary-on flex items-center justify-center font-black font-headline text-base sm:text-lg"
          >
            4
          </div>
          <h2 class="text-xl sm:text-2xl md:text-3xl font-black font-headline tracking-tight">
            Limits &amp; Specifications
          </h2>
        </div>
        <div
          class="bg-surface-container-high border border-white/5 rounded-3xl p-6 sm:p-8 space-y-6"
        >
          <p class="text-sm sm:text-base text-text-muted leading-relaxed">
            Production-verified limits, last checked 2026-06-19. Subject to change as
            the upstream capacity scales — we update this section in place rather than
            rev a new endpoint.
          </p>

          <!-- Rate Limits -->
          <div class="space-y-3">
            <h3 class="text-[10px] font-black uppercase tracking-widest text-text-muted">
              Rate Limits (global shared pool)
            </h3>
            <ul class="space-y-1.5 text-sm sm:text-base text-text-muted leading-relaxed list-disc pl-5">
              <li>Burst capacity: <span class="text-text-main font-bold">≥ 200 concurrent requests</span></li>
              <li>Sustainable throughput: <span class="text-text-main font-bold">≤ 1000 req/min</span></li>
              <li>Sustained <span class="text-text-main font-bold">&gt; 1500 req/min</span> will start returning <code class="font-mono text-primary-container">429</code></li>
              <li><code class="font-mono">429</code> responses <span class="text-text-main font-bold">do not consume your balance</span> — back off 30–60s and retry</li>
            </ul>
          </div>

          <!-- Streaming Timeouts -->
          <div class="space-y-3">
            <h3 class="text-[10px] font-black uppercase tracking-widest text-text-muted">
              Streaming Timeouts
            </h3>
            <ul class="space-y-1.5 text-sm sm:text-base text-text-muted leading-relaxed list-disc pl-5">
              <li>Hard cap: <span class="text-text-main font-bold">10 minutes</span> wall-clock per request</li>
              <li>Idle cap: <span class="text-text-main font-bold">90 seconds</span> — no new chunk in 90s closes the upstream connection</li>
            </ul>
          </div>

          <!-- Context Windows -->
          <div class="space-y-3">
            <h3 class="text-[10px] font-black uppercase tracking-widest text-text-muted">
              Context Windows
            </h3>
            <!-- TEMP 2026-06-25: Qwen3-235B / Kimi-K2.6 cards hidden while upstream
                 Gonka takes them offline for adjustment. Restore when back online. -->
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div class="bg-surface-container-lowest/60 rounded-2xl px-4 py-3 border border-white/5">
                <p class="text-[10px] font-black uppercase tracking-widest text-text-muted mb-1">MiniMaxAI/MiniMax-M2.7</p>
                <code class="text-sm font-mono text-primary-container">200K tokens</code>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup>
import { computed, provide, ref } from 'vue'
import {
  LucideArrowLeft,
  LucideKey,
  LucideBookOpen,
  LucideTriangleAlert
} from 'lucide-vue-next'

definePageMeta({ layout: 'landing' })

// Shared OS selection for every DocsCodeBlock that carries per-OS variants.
// 'unix' covers macOS + Linux (both bash/zsh); 'windows' is PowerShell.
const docsOs = ref('unix')
provide('docsOs', docsOs)

const config = useRuntimeConfig()
const apiBase = computed(() => config.public.apiBase || 'https://api.gonkarouter.io')

const siteUrl = config.public.siteUrl || 'https://gonkarouter.io'
useSeoMeta({
  title: 'Developer Documentation',
  description:
    'Integrate GonkaRouter with Claude SDK, Cursor IDE, OpenAI SDK and more. Quickstart guides, API reference, and code samples for the Gonka Network.',
  ogTitle: 'Developer Documentation | GonkaRouter',
  ogDescription:
    'Integrate GonkaRouter with Claude SDK, Cursor IDE, OpenAI SDK and more. Quickstart, API reference, and samples.',
  ogUrl: `${siteUrl}/docs`,
  twitterTitle: 'Developer Documentation | GonkaRouter',
  twitterDescription:
    'Integrate GonkaRouter with Claude SDK, Cursor IDE, OpenAI SDK and more.'
})
useHead({ link: [{ rel: 'canonical', href: `${siteUrl}/docs` }] })

// TechArticle + breadcrumb for the documentation page — both backed by the
// visible docs content and the site hierarchy (Home › Docs).
useStructuredData([
  {
    '@context': 'https://schema.org',
    '@type': 'TechArticle',
    headline: 'GonkaRouter Developer Documentation',
    description:
      'Integrate GonkaRouter with Claude SDK, Cursor IDE, OpenAI SDK and more. Quickstart guides, API reference, and code samples for the Gonka Network.',
    inLanguage: 'en',
    url: `${siteUrl}/docs`,
    author: { '@type': 'Organization', name: 'GonkaRouter', url: siteUrl },
    publisher: { '@id': `${siteUrl}/#organization` }
  },
  breadcrumbList([
    { name: 'Home', url: `${siteUrl}/` },
    { name: 'Docs', url: `${siteUrl}/docs` }
  ])
])

const tabs = [
  { id: 'claude', label: 'Claude SDK' },
  { id: 'cursor', label: 'Cursor IDE' },
  { id: 'claude-code', label: 'Claude Code' },
  { id: 'openclaw', label: 'OpenClaw' },
  { id: 'workbuddy', label: 'WorkBuddy' }
]
const activeTab = ref('claude')

const smokeCurl = computed(() => [
  {
    os: 'unix',
    label: 'macOS / Linux',
    filename: 'smoke-test.sh',
    code: `KEY="sk-xxxxxx"   # paste your real key here

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
  },
  {
    os: 'windows',
    label: 'Windows (cmd)',
    filename: 'smoke-test.cmd',
    code: `:: Command Prompt (cmd). curl.exe is built into Windows 10+.
:: JSON quotes are escaped with \\" so cmd passes them through to curl.
set KEY=sk-xxxxxx

curl -s ${apiBase.value}/v1/messages -H "x-api-key: %KEY%" -H "anthropic-version: 2023-06-01" -H "content-type: application/json" -d "{\\"model\\":\\"moonshotai/Kimi-K2.6\\",\\"max_tokens\\":1024,\\"messages\\":[{\\"role\\":\\"user\\",\\"content\\":\\"Reply with just: pong\\"}]}"
`
  }
])

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

const claudeCurl = computed(() => [
  {
    os: 'unix',
    label: 'macOS / Linux',
    filename: 'messages.sh',
    code: `curl ${apiBase.value}/v1/messages \\
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
  },
  {
    os: 'windows',
    label: 'Windows (cmd)',
    filename: 'messages.cmd',
    code: `:: Command Prompt (cmd). curl.exe ships with Windows 10+.
curl ${apiBase.value}/v1/messages -H "x-api-key: sk-xxxxxx" -H "anthropic-version: 2023-06-01" -H "content-type: application/json" -d "{\\"model\\":\\"moonshotai/Kimi-K2.6\\",\\"max_tokens\\":1024,\\"messages\\":[{\\"role\\":\\"user\\",\\"content\\":\\"Hello!\\"}]}"

:: Streaming variant — add \\"stream\\":true to the JSON body and pipe to a parser.
`
  }
])

const cursorValues = computed(
  () => `# Paste these EXACT values into Cursor → Settings → Models
OpenAI Base URL:  ${apiBase.value}/v1
OpenAI API Key:   sk-xxxxxx          # your GonkaRouter key
Model name #1:    moonshotai/Kimi-K2.6

# Optional Settings → Models → Advanced
Max output tokens: 4096               # protects against reasoning-token starvation
`
)

const claudeCodeInstall = `npm install -g @anthropic-ai/claude-code
claude --version    # → 1.x.x
`

const claudeCodeRun = computed(() => [
  {
    os: 'unix',
    label: 'macOS / Linux',
    filename: 'run-claude.sh',
    code: `# 1. Create an isolated HOME so Claude Code does NOT pick up your existing
#    ~/.claude/credentials OAuth session and silently ignore the env vars below.
mkdir -p /tmp/gonka-claude-home

# 2. Launch inside your project directory. Every env var matters — see below.
HOME=/tmp/gonka-claude-home \\
ANTHROPIC_BASE_URL=${apiBase.value} \\
ANTHROPIC_AUTH_TOKEN=sk-xxxxxx \\
ANTHROPIC_MODEL=moonshotai/Kimi-K2.6 \\
ANTHROPIC_SMALL_FAST_MODEL=moonshotai/Kimi-K2.6 \\
DISABLE_PROMPT_CACHING=1 \\
claude
`
  },
  {
    os: 'windows',
    label: 'Windows (cmd)',
    filename: 'run-claude.cmd',
    code: `:: Command Prompt (cmd). On Windows the credentials store lives under
:: %USERPROFILE%, so isolate it by pointing USERPROFILE at a throwaway folder.
:: 1. Create an isolated profile dir so Claude Code does NOT pick up your
::    existing OAuth session and silently ignore the env vars below.
set USERPROFILE=%TEMP%\\gonka-claude-home
mkdir "%USERPROFILE%" 2>nul

:: 2. Set env vars for this session (no spaces around =, no quotes on values),
::    then launch inside your project directory.
set ANTHROPIC_BASE_URL=${apiBase.value}
set ANTHROPIC_AUTH_TOKEN=sk-xxxxxx
set ANTHROPIC_MODEL=moonshotai/Kimi-K2.6
set ANTHROPIC_SMALL_FAST_MODEL=moonshotai/Kimi-K2.6
set DISABLE_PROMPT_CACHING=1

claude
`
  }
])

const claudeCodeShellFn = computed(() => [
  {
    os: 'unix',
    label: 'macOS / Linux',
    filename: '~/.zshrc (or ~/.bashrc)',
    code: `gonka-claude() {
  HOME=/tmp/gonka-claude-home \\
  ANTHROPIC_BASE_URL=${apiBase.value} \\
  ANTHROPIC_AUTH_TOKEN="\${GONKA_API_KEY:?set GONKA_API_KEY in your shell}" \\
  ANTHROPIC_MODEL=moonshotai/Kimi-K2.6 \\
  ANTHROPIC_SMALL_FAST_MODEL=moonshotai/Kimi-K2.6 \\
  DISABLE_PROMPT_CACHING=1 \\
  claude "$@"
}

# then in any project: \`gonka-claude\`
`
  },
  {
    os: 'windows',
    label: 'Windows (cmd)',
    filename: 'gonka-claude.cmd (save on your PATH)',
    code: `:: cmd has no shell functions — save this as gonka-claude.cmd in a folder
:: that's on your PATH (e.g. %USERPROFILE%\\bin), then run "gonka-claude" anywhere.
@echo off
if "%GONKA_API_KEY%"=="" (
  echo set GONKA_API_KEY first, e.g.  set GONKA_API_KEY=sk-xxxxxx
  exit /b 1
)
set USERPROFILE=%TEMP%\\gonka-claude-home
mkdir "%USERPROFILE%" 2>nul
set ANTHROPIC_BASE_URL=${apiBase.value}
set ANTHROPIC_AUTH_TOKEN=%GONKA_API_KEY%
set ANTHROPIC_MODEL=moonshotai/Kimi-K2.6
set ANTHROPIC_SMALL_FAST_MODEL=moonshotai/Kimi-K2.6
set DISABLE_PROMPT_CACHING=1
claude %*
`
  }
])

const openclawPrereq = [
  {
    os: 'unix',
    label: 'macOS / Linux',
    filename: 'prereq.sh',
    code: `# OpenClaw requires Node.js ≥ 22.12 (LTS).
# If you use nvm:
nvm install 22
nvm use 22
nvm alias default 22
node -v          # → v22.x.x
`
  },
  {
    os: 'windows',
    label: 'Windows (cmd)',
    filename: 'prereq.cmd',
    code: `:: OpenClaw requires Node.js ≥ 22.12 (LTS).
:: Easiest: install via winget (or grab the LTS installer from nodejs.org).
winget install OpenJS.NodeJS.LTS

:: If you use nvm-windows (https://github.com/coreybutler/nvm-windows):
nvm install 22.12.0
nvm use 22.12.0

node -v          :: -> v22.x.x
`
  }
]

const openclawInstall = `npm install -g openclaw
openclaw --version   # → OpenClaw 2026.x.x
`

// Same full path WorkBuddy needs, so a passing curl proves the endpoint and key
// are fine and narrows any remaining failure to the client config.
const workbuddyVerify = computed(() => `curl ${apiBase.value}/v1/chat/completions \\
  -H "Authorization: Bearer sk-xxxxxx" \\
  -H "Content-Type: application/json" \\
  -d '{
    "model": "MiniMaxAI/MiniMax-M2.7",
    "messages": [{"role": "user", "content": "ping"}]
  }'
`)

const openclawProvider = computed(() => [
  {
    os: 'unix',
    label: 'macOS / Linux',
    filename: 'gonka-provider.json5',
    code: `// Save as /tmp/gonka-provider.json5
{
  models: {
    providers: {
      gonka: {
        baseUrl: "${apiBase.value}",
        apiKey: "sk-xxxxxx",              // your GonkaRouter key
        auth: "api-key",
        api: "anthropic-messages",
        models: [
          { id: "moonshotai/Kimi-K2.6",                       name: "Kimi-K2.6" }
        ]
      }
    }
  }
}
`
  },
  {
    os: 'windows',
    label: 'Windows (cmd)',
    filename: 'gonka-provider.json5',
    code: `// Save as %TEMP%\\gonka-provider.json5
{
  models: {
    providers: {
      gonka: {
        baseUrl: "${apiBase.value}",
        apiKey: "sk-xxxxxx",              // your GonkaRouter key
        auth: "api-key",
        api: "anthropic-messages",
        models: [
          { id: "moonshotai/Kimi-K2.6",                       name: "Kimi-K2.6" }
        ]
      }
    }
  }
}
`
  }
])

const openclawApply = [
  {
    os: 'unix',
    label: 'macOS / Linux',
    filename: 'apply.sh',
    code: `# Dry-run validates the patch against the JSON schema:
openclaw config patch --file /tmp/gonka-provider.json5 --dry-run

# Apply for real:
openclaw config patch --file /tmp/gonka-provider.json5

# Confirm it landed (apiKey shows as __OPENCLAW_REDACTED__ — that's fine):
openclaw config get models.providers.gonka
`
  },
  {
    os: 'windows',
    label: 'Windows (cmd)',
    filename: 'apply.cmd',
    code: `:: Dry-run validates the patch against the JSON schema:
openclaw config patch --file "%TEMP%\\gonka-provider.json5" --dry-run

:: Apply for real:
openclaw config patch --file "%TEMP%\\gonka-provider.json5"

:: Confirm it landed (apiKey shows as __OPENCLAW_REDACTED__ — that's fine):
openclaw config get models.providers.gonka
`
  }
]

const openclawDaemon = `openclaw config set gateway.mode local
openclaw daemon restart

# Verify the daemon came up cleanly:
openclaw gateway status
# → Runtime: running (pid …)
# → Connectivity probe: ok
# → Listening: 127.0.0.1:18789
`

const openclawRun = [
  {
    os: 'unix',
    label: 'macOS / Linux',
    filename: 'run.sh',
    code: `# A. One-shot call (best for scripts / CI)
openclaw infer model run \\
  --model "gonka/moonshotai/Kimi-K2.6" \\
  --prompt "Reply with just: pong" \\
  --json

# B. Interactive terminal UI
openclaw chat --local

# C. Web Dashboard
openclaw            # opens http://127.0.0.1:18789/ with an auth-included URL
`
  },
  {
    os: 'windows',
    label: 'Windows (cmd)',
    filename: 'run.cmd',
    code: `:: A. One-shot call (best for scripts / CI). cmd uses ^ for line-continuation.
openclaw infer model run ^
  --model "gonka/moonshotai/Kimi-K2.6" ^
  --prompt "Reply with just: pong" ^
  --json

:: B. Interactive terminal UI
openclaw chat --local

:: C. Web Dashboard
openclaw            :: opens http://127.0.0.1:18789/ with an auth-included URL
`
  }
]
</script>

# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Independent developers and small teams who already call LLMs through the OpenAI (or Anthropic) SDK and want a cheaper endpoint they can switch to by changing `base_url`. A large share come from Chinese-speaking and Web3 communities. They evaluate quickly: price, compatibility, which models, how to get a key.

## Product Purpose

GonkaRouter is an AI model router on the Gonka Network: one OpenAI/Anthropic-compatible API that routes to open models served by the decentralized Gonka compute network. Success on the landing page means a visitor understands the price and compatibility and gets an API key.

## Positioning

A single per-token rate that tracks the live Gonka network price (same for input and output, no per-model price table), served by decentralized Gonka compute. Crypto-native billing (USDT top-up), no subscription, no credit card. New users get 10M free tokens.

## Operating Context

Visitors arrive from search, X, Telegram, Discord, and blog posts. Many browse from mainland China into a Hong Kong origin, so first-load weight and latency matter. Sign-in is email OTP or Google; a wallet is only needed to top up.

## Capabilities and Constraints

- Models (current): GLM-5.3-Flash, DeepSeek-V4-Flash, MiniMax-M2.7. The roster changes with what the Gonka network serves.
- Live price from `useGonkaPricing()`; never hardcode a price.
- API base: `https://api.gonkarouter.io/v1`.
- Feature claims in use: 262k context window, function calling ready, private VPC deployment.
- Public pages are SWR-cached and rendered without cookies; login state resolves client-side.
- Stack: Nuxt 3 + Vue 3 + Tailwind, existing codebase.

## Brand Commitments

Name "GonkaRouter". Brand color is the emerald/neon green `#00FFA3` (dark theme). Contact: contact@gonka-router.com. Socials: X, Telegram, YouTube, LinkedIn, Discord.

## Evidence on Hand

Real: model list, live pricing, OpenAI-compatible code sample, FAQ copy, blog posts from the API. Absent: testimonials, customer logos, latency/throughput benchmarks, usage numbers. Do not fabricate them.

## Product Principles

- Price and compatibility are the argument; say them plainly and early.
- One step to a key: every section should point toward "Get API Keys".
- Truth over hype: only claims the network actually delivers today.
- Fast for a cross-border visitor: heavy visuals must never block content.

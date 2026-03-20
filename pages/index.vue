<template>
  <div class="p-8 max-w-5xl mx-auto space-y-8">
    <h1 class="text-3xl font-bold">Dashboard</h1>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <div class="bg-[#111] border border-gray-800 p-6 rounded-xl">
        <h3 class="text-sm text-gray-500 font-medium mb-2">Network</h3>
        <div class="text-3xl font-bold text-green-400">
          Mainnet
        </div>
      </div>
      
      <div class="bg-[#111] border border-gray-800 p-6 rounded-xl overflow-hidden">
        <h3 class="text-sm text-gray-500 font-medium mb-2">Connected Address</h3>
        <div class="text-lg font-mono text-gray-300 truncate" :title="auth.user?.address">
          {{ auth.user?.address ? auth.user.address.slice(0, 6) + '...' + auth.user.address.slice(-4) : 'Not Connected' }}
        </div>
      </div>

      <div class="bg-[#111] border border-gray-800 p-6 rounded-xl">
        <h3 class="text-sm text-gray-500 font-medium mb-2">Status</h3>
        <div class="text-3xl font-bold text-blue-400">
          Active
        </div>
      </div>
    </div>

    <!-- Instructions -->
    <div class="bg-[#111] border border-gray-800 p-8 rounded-xl space-y-6">
      <h2 class="text-2xl font-bold">📚 API Documentation</h2>
      
      <div>
        <h3 class="text-lg font-semibold text-gray-300 mb-2">Authentication</h3>
        <p class="text-gray-400 mb-2">All API requests require authentication using your JWT token in the Authorization header. You receive this token upon logging in with your wallet.</p>
        <code class="block bg-black border border-gray-800 p-4 rounded text-sm text-blue-400 overflow-x-auto whitespace-nowrap">
          Authorization: Bearer {{ auth.token ? auth.token.slice(0, 20) + '...' : '<YOUR_JWT_TOKEN>' }}
        </code>
      </div>

      <div>
        <h3 class="text-lg font-semibold text-gray-300 mb-2">Base URL</h3>
        <p class="text-gray-400 mb-2">All API requests should be made to:</p>
        <code class="block bg-black border border-gray-800 p-4 rounded text-sm text-blue-400">
          {{ config.public.apiBase }}/api
        </code>
      </div>

      <div>
        <h3 class="text-lg font-semibold text-gray-300 mb-2">Example: Chat Completions</h3>
        <pre class="bg-black border border-gray-800 p-4 rounded-xl text-sm text-gray-300 overflow-x-auto font-mono leading-relaxed"><code>curl {{ config.public.apiBase }}/api/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer {{ auth.token ? auth.token.slice(0, 15) + '...' : '<YOUR_JWT_TOKEN>' }}" \
  -d '{
    "model": "Qwen/Qwen3-235B-A22B-Instruct-2507-FP8",
    "messages": [
      {"role": "user", "content": "Hello!"}
    ]
  }'</code></pre>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useAuthStore } from '~/stores/auth'
import { useRuntimeConfig } from '#app'

const config = useRuntimeConfig()
const auth = useAuthStore()
</script>
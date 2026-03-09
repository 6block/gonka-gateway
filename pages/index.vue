<template>
  <div class="p-8 max-w-5xl mx-auto space-y-8">
    <h1 class="text-3xl font-bold">Dashboard</h1>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <div class="bg-[#111] border border-gray-800 p-6 rounded-xl">
        <h3 class="text-sm text-gray-500 font-medium mb-2">Balance</h3>
        <div class="text-3xl font-bold text-green-400">
          {{ auth.user?.balance?.toFixed(4) }} GNK
        </div>
      </div>
      
      <div class="bg-[#111] border border-gray-800 p-6 rounded-xl">
        <h3 class="text-sm text-gray-500 font-medium mb-2">API Key</h3>
        <div class="text-lg font-mono text-gray-300 break-all">
          {{ auth.apiKeys[0]?.key || 'No API Key' }}
        </div>
      </div>

      <div class="bg-[#111] border border-gray-800 p-6 rounded-xl">
        <h3 class="text-sm text-gray-500 font-medium mb-2">Total Spent</h3>
        <div class="text-3xl font-bold">
          <!-- simplified calculation for demo -->
          {{ (100 - (auth.user?.balance || 0)).toFixed(4) }} GNK
        </div>
      </div>
    </div>

    <!-- Instructions -->
    <div class="bg-[#111] border border-gray-800 p-8 rounded-xl space-y-6">
      <h2 class="text-2xl font-bold">📚 API Documentation</h2>
      
      <div>
        <h3 class="text-lg font-semibold text-gray-300 mb-2">Authentication</h3>
        <p class="text-gray-400 mb-2">All API requests require authentication using an API key in the Authorization header:</p>
        <code class="block bg-black border border-gray-800 p-4 rounded text-sm text-blue-400">
          Authorization: Bearer sk-your-api-key-here
        </code>
      </div>

      <div>
        <h3 class="text-lg font-semibold text-gray-300 mb-2">Base URL</h3>
        <p class="text-gray-400 mb-2">All API requests should be made to:</p>
        <code class="block bg-black border border-gray-800 p-4 rounded text-sm text-blue-400">
          {{ baseUrl }}/v1
        </code>
      </div>

      <div>
        <h3 class="text-lg font-semibold text-gray-300 mb-2">Example: Chat Completions</h3>
        <pre class="bg-black border border-gray-800 p-4 rounded-xl text-sm text-gray-300 overflow-x-auto font-mono leading-relaxed"><code>curl {{ baseUrl }}/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer sk-your-api-key" \
  -d '{
    "model": "{{ exampleModel }}",
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

const auth = useAuthStore()
const baseUrl = ref('')
const exampleModel = ref('Qwen/Qwen3-235B-A22B-Instruct-2507-FP8')

onMounted(async () => {
  baseUrl.value = window.location.origin
  try {
    const res = await fetch('/v1/models')
    if (res.ok) {
      const data = await res.json()
      if (data && data.data && data.data.length > 0) {
        exampleModel.value = data.data[0].id
      }
    }
  } catch (e) {
    console.error('Failed to fetch models for example', e)
  }
})
</script>
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useNuxtApp } from '#app'
import { useAuthStore } from '~/stores/auth'

export interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
  isError?: boolean
}

export interface Conversation {
  id: number
  title: string
  model?: string
  created_at?: string
  updated_at?: string
}

// Manages persisted chat history for logged-in users. Guests never call these
// endpoints — chat.vue keeps their messages in local component state only.
export const useChatStore = defineStore('chat', () => {
  const conversations = ref<Conversation[]>([])
  const activeConversationId = ref<number | null>(null)
  const messages = ref<ChatMessage[]>([])

  function apiBase(): string {
    return useNuxtApp().$config.public.apiBase as string
  }

  function authHeaders(): Record<string, string> {
    const auth = useAuthStore()
    return auth.token ? { Authorization: `Bearer ${auth.token}` } : {}
  }

  async function fetchConversations() {
    const data = await $fetch<any>(`${apiBase()}/api/chat/conversations`, {
      headers: authHeaders()
    })
    conversations.value = data?.conversations ?? []
    return conversations.value
  }

  async function createConversation(firstMessage: string, model?: string) {
    const data = await $fetch<Conversation>(`${apiBase()}/api/chat/conversations`, {
      method: 'POST',
      headers: authHeaders(),
      body: { first_message: firstMessage, model }
    })
    conversations.value = [data, ...conversations.value]
    activeConversationId.value = data.id
    return data
  }

  async function fetchMessages(id: number) {
    const data = await $fetch<any>(
      `${apiBase()}/api/chat/conversations/${id}/messages`,
      { headers: authHeaders() }
    )
    messages.value = (data?.messages ?? []).map((m: any) => ({
      role: m.role,
      content: m.content
    }))
    activeConversationId.value = id
    return messages.value
  }

  // Plan-a write-back: persist one completed turn (user + assistant) after the
  // stream finishes. Bumps the conversation to the top of the list locally.
  async function appendMessages(
    id: number,
    userContent: string,
    assistantContent: string,
    model?: string
  ) {
    await $fetch(`${apiBase()}/api/chat/conversations/${id}/messages`, {
      method: 'POST',
      headers: authHeaders(),
      body: { user: userContent, assistant: assistantContent, model }
    })
    const idx = conversations.value.findIndex((c) => c.id === id)
    if (idx > -1) {
      const [conv] = conversations.value.splice(idx, 1)
      conv.updated_at = new Date().toISOString()
      if (model) conv.model = model
      conversations.value.unshift(conv)
    }
  }

  async function renameConversation(id: number, title: string) {
    await $fetch(`${apiBase()}/api/chat/conversations/${id}`, {
      method: 'PATCH',
      headers: authHeaders(),
      body: { title }
    })
    const conv = conversations.value.find((c) => c.id === id)
    if (conv) conv.title = title
  }

  async function deleteConversation(id: number) {
    await $fetch(`${apiBase()}/api/chat/conversations/${id}`, {
      method: 'DELETE',
      headers: authHeaders()
    })
    conversations.value = conversations.value.filter((c) => c.id !== id)
    if (activeConversationId.value === id) {
      activeConversationId.value = null
      messages.value = []
    }
  }

  // Start a fresh, unsaved conversation (no backend row until the first message
  // is sent — createConversation runs then).
  function startNewConversation() {
    activeConversationId.value = null
    messages.value = []
  }

  // Clear all in-memory state — called on logout to avoid cross-account bleed.
  function reset() {
    conversations.value = []
    activeConversationId.value = null
    messages.value = []
  }

  return {
    conversations,
    activeConversationId,
    messages,
    fetchConversations,
    createConversation,
    fetchMessages,
    appendMessages,
    renameConversation,
    deleteConversation,
    startNewConversation,
    reset
  }
})

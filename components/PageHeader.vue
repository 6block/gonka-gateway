<template>
  <header class="page-header">
    <NuxtLink v-if="back" :to="back.to" class="page-header__back group">
      <LucideArrowLeft class="w-4 h-4 transition-transform group-hover:-translate-x-0.5" />
      {{ back.label }}
    </NuxtLink>

    <h1 class="page-header__title font-headline">{{ title }}</h1>

    <div v-if="lead || $slots.lead" class="page-header__lead font-body">
      <slot name="lead">{{ lead }}</slot>
    </div>

    <p v-if="meta" class="page-header__meta font-label">{{ meta }}</p>

    <div v-if="$slots.actions" class="page-header__actions">
      <slot name="actions" />
    </div>
  </header>
</template>

<script setup lang="ts">
// 落地页（定价、文档、博客、反馈、法律条款）共用的页面头部，统一标题字号、间距和返回链接
import { LucideArrowLeft } from 'lucide-vue-next'

interface BackLink {
  to: string
  label: string
}

withDefaults(
  defineProps<{
    title: string
    lead?: string
    meta?: string
    back?: BackLink | null
  }>(),
  { lead: '', meta: '', back: () => ({ to: '/', label: 'Back to home' }) },
)
</script>

<style scoped>
/* 顶部一团很淡的品牌绿光，呼应首页的眼睛背景；画在自身背景上，不会撑出横向滚动 */
.page-header {
  padding-bottom: 2.5rem;
  margin-bottom: 2.5rem;
  border-bottom: 1px solid rgb(255 255 255 / 0.06);
  background: radial-gradient(60% 120% at 0% 0%, rgb(var(--primary-container-rgb) / 0.07), transparent 70%);
}

.page-header__back {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  min-height: 2.75rem;
  margin-bottom: 1.5rem;
  font-size: 0.8125rem;
  font-weight: 700;
  color: var(--text-muted);
  transition: color 0.2s ease;
}

.page-header__back:hover {
  color: rgb(var(--primary-container-rgb));
}

.page-header__title {
  font-size: clamp(2.25rem, 1.5rem + 3vw, 3.75rem);
  font-weight: 900;
  line-height: 1.05;
  letter-spacing: -0.035em;
  text-wrap: balance;
  color: var(--text-main);
}

.page-header__lead {
  max-width: 40rem;
  margin-top: 1.25rem;
  font-size: 1.0625rem;
  line-height: 1.65;
  color: var(--text-muted);
}

.page-header__meta {
  margin-top: 1rem;
  font-size: 0.75rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--text-muted);
}

.page-header__actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  margin-top: 2rem;
}

@media (min-width: 640px) {
  .page-header {
    padding-bottom: 3.5rem;
    margin-bottom: 3.5rem;
  }

  .page-header__lead {
    font-size: 1.125rem;
  }
}
</style>

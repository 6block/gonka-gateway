<template>
  <figure aria-hidden="true">
    <div v-for="row in ROWS" :key="row.label" class="mb-5 last:mb-0">
      <p class="font-label text-[11px] tracking-widest uppercase text-text-muted mb-2">{{ row.label }}</p>
      <div class="grid grid-cols-12 gap-1.5">
        <span
          v-for="i in LANES"
          :key="i"
          class="h-7 rounded-md"
          :class="i <= row.lit ? row.litClass : 'bg-white/[0.06]'"
        />
      </div>
    </div>
    <figcaption class="text-text-muted text-xs font-body mt-4">Parallel requests per account (illustrative)</figcaption>
  </figure>
</template>

<script setup lang="ts">
// 示意图，不是真实配额：和充值页 ConcurrencyBoost 一样，免费档点亮一半
const LANES = 12
const ROWS = [
  { label: 'Free', lit: LANES / 2, litClass: 'bg-white/25' },
  { label: 'Topped up', lit: LANES, litClass: 'bg-primary-container shadow-[0_0_12px_rgb(var(--primary-container-rgb)/0.45)]' },
]
</script>

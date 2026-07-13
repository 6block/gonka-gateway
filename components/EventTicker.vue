<template>
  <NuxtLink
    :to="to"
    class="event-ticker block group"
    :aria-label="`${text} — view event`"
  >
    <!-- Two identical tracks side-by-side create the seamless -50% loop. -->
    <div class="event-ticker-track" aria-hidden="true">
      <span
        v-for="n in REPEAT_COUNT"
        :key="n"
        class="event-ticker-item"
      >
        <span class="event-ticker-dot"></span>
        {{ text }}
      </span>
    </div>
  </NuxtLink>
</template>

<script setup>
// The track holds REPEAT_COUNT items and animates by -50%, so the first half
// exits exactly as the duplicated second half scrolls in — a gapless loop.
// Keep this an even number.
const REPEAT_COUNT = 8

defineProps({
  text: {
    type: String,
    default: 'Build AI on Gonka Router at WebX Japan'
  },
  to: {
    type: String,
    default: '/webx'
  }
})
</script>

<style scoped>
.event-ticker {
  overflow: hidden;
  /* Matches the design: a very faint accent tint over the near-black page bg. */
  border-bottom: 1px solid #232323;
  background: color-mix(in oklab, rgba(0, 255, 163, 0.12) 72%, #0a0a0a 28%);
}
.event-ticker-track {
  display: flex;
  width: max-content;
  animation: event-marquee 26s linear infinite;
}
.event-ticker:hover .event-ticker-track {
  animation-play-state: paused;
}
.event-ticker-item {
  display: inline-flex;
  align-items: center;
  gap: 12px;
  padding: 10px 28px;
  white-space: nowrap;
  color: #f5f5f5;
  font-family: 'JetBrains Mono', ui-monospace, monospace;
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}
.event-ticker-dot {
  width: 6px;
  height: 6px;
  border-radius: 999px;
  background: var(--primary-container);
  box-shadow: 0 0 18px color-mix(in oklab, var(--primary-container) 65%, transparent);
}
@keyframes event-marquee {
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(-50%);
  }
}
@media (prefers-reduced-motion: reduce) {
  .event-ticker-track {
    animation: none;
  }
}
</style>

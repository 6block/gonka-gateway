<script setup lang="ts">
import { computed } from 'vue'
import { formatUsd } from '~/composables/useTopup'

interface Props {
  /** Deposit bonus percent; 0 hides the bonus line */
  bonusPct: number
  bonusMin?: string
}
const props = defineProps<Props>()

// Illustrative meter, not a quota readout: the free row lights half the lanes,
// the topped-up row all of them. The real caps live in backend config and are
// deliberately not stated here.
const LANES = 12
const FREE_LANES = LANES / 2

const rows = computed(() => [
  { id: 'free', label: 'Free', lit: FREE_LANES },
  { id: 'paid', label: 'Topped up', lit: LANES },
])

const bonusMinLabel = computed(() => (props.bonusMin ? formatUsd(props.bonusMin) : ''))
</script>

<template>
  <section class="pay-block boost" aria-labelledby="boost-title">
    <p class="pay-tag">[concurrency]</p>
    <h2 id="boost-title" class="pay-headline boost__title">
      Top up to run more requests at once
    </h2>
    <p class="pay-lede boost__lede">
      Topped-up accounts get a higher concurrency limit on the API: more requests in flight
      at the same time, and fewer 429 errors when your traffic spikes. It switches on by itself
      within minutes of your deposit being credited.
    </p>

    <figure class="boost__meter" aria-hidden="true">
      <div v-for="row in rows" :key="row.id" class="boost__row" :class="`boost__row--${row.id}`">
        <span class="pay-label boost__row-label">{{ row.label }}</span>
        <span class="boost__cells">
          <span
            v-for="i in LANES"
            :key="i"
            class="boost__cell"
            :class="{ 'is-lit': i <= row.lit }"
            :style="{ '--i': i }"
          />
        </span>
      </div>
      <figcaption class="pay-fine boost__caption">Parallel requests per account (illustrative)</figcaption>
    </figure>

    <ul class="pay-specs boost__specs">
      <li class="is-key">
        <span>Higher concurrency limit<small>Applies to every model on your API keys</small></span>
      </li>
      <li v-if="bonusPct > 0">
        <span>+{{ bonusPct }}% bonus credit<small v-if="bonusMinLabel">On each deposit of {{ bonusMinLabel }} or more, card or USDT</small></span>
      </li>
      <li>
        <span>Pay as you go<small>No subscription. Your balance is drawn per token.</small></span>
      </li>
    </ul>
  </section>
</template>

<style scoped>
.boost__title {
  margin-top: 14px;
}
.boost__lede {
  margin-top: 12px;
}
.boost__meter {
  display: grid;
  gap: 10px;
  margin: 28px 0 0;
  padding: 18px 0 14px;
  border-top: 1px solid var(--pay-line);
  border-bottom: 1px solid var(--pay-line);
}
.boost__row {
  display: grid;
  grid-template-columns: 84px 1fr;
  align-items: center;
  gap: 12px;
}
.boost__cells {
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  gap: 3px;
}
.boost__cell {
  height: 18px;
  border: 1px solid var(--pay-line);
  border-radius: 2px;
}
.boost__row--free .boost__cell.is-lit {
  border-color: transparent;
  background: var(--pay-ink-soft);
  animation: boost-flicker 2.4s var(--pay-ease) infinite;
  animation-delay: calc(var(--i) * 140ms);
}
.boost__row--paid .boost__row-label {
  color: var(--pay-green-text);
}
.boost__row--paid .boost__cell.is-lit {
  border-color: transparent;
  background: var(--pay-green);
  animation: boost-flicker 1.6s var(--pay-ease) infinite;
  animation-delay: calc(var(--i) * 90ms);
}
.boost__caption {
  margin-top: 4px;
}
.boost__specs {
  margin-top: 24px;
}

/* Lit lanes dip briefly, like requests finishing and new ones taking the slot. */
@keyframes boost-flicker {
  0%,
  70%,
  100% {
    opacity: 1;
  }
  82% {
    opacity: 0.35;
  }
}
</style>

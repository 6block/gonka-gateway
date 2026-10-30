<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import {
  LucideCreditCard,
  LucideCoins,
  LucideWallet,
  LucideLogIn,
  LucideLoader2,
  LucideCopy,
  LucideCheck,
  LucideAlertCircle,
} from 'lucide-vue-next'
import QrcodeVue from 'qrcode.vue'
import { useAuthStore } from '~/stores/auth'
import { useToast } from '~/composables/useToast'
import { useLoginModal } from '~/composables/useLoginModal'
import { useDepositAddress, DEPOSIT_CHAINS, type ChainId } from '~/composables/useDepositAddress'
import { useTopup, formatUsd } from '~/composables/useTopup'
import CardTopup from '~/components/topup/CardTopup.vue'
import ConcurrencyBoost from '~/components/topup/ConcurrencyBoost.vue'

definePageMeta({ layout: 'default' })
useSeoMeta({ title: 'Deposit', robots: 'noindex,nofollow' })

const auth = useAuthStore()
const toast = useToast()
const { open: openLogin } = useLoginModal()
const route = useRoute()
const router = useRouter()

// ── Payment method (card via Stripe / crypto) ─────────────────────────────────

type Method = 'card' | 'crypto'

const METHODS = [
  { id: 'card', label: 'Card / Alipay', icon: LucideCreditCard },
  { id: 'crypto', label: 'Crypto (USDT)', icon: LucideCoins },
] as const satisfies ReadonlyArray<{ id: Method; label: string; icon: unknown }>

const { config: topupConfig, loadConfig } = useTopup()
const method = ref<Method>('card')
const cardEnabled = computed(() => topupConfig.value?.stripe_enabled === true)
const bonusPct = computed(() => Number(topupConfig.value?.bonus_percent) || 0)
// Until the config arrives (or if card top-up is off) show crypto, which has
// always worked, rather than a card form that cannot submit.
const activeMethod = computed<Method>(() => (cardEnabled.value ? method.value : 'crypto'))

watch(
  () => auth.isLoggedIn,
  (loggedIn) => loggedIn && loadConfig(),
  { immediate: true }
)

onMounted(() => {
  // Stripe's cancel URL brings the user back here with ?order_no=...
  if (route.query.order_no) {
    toast.info('Payment canceled. No charge was made.')
    router.replace({ query: {} })
  }
})

// ── Chain selection ───────────────────────────────────────────────────────────

const selectedChainId = ref<ChainId>('bsc')
const selectedChain = computed(() => DEPOSIT_CHAINS[selectedChainId.value as ChainId])

function selectChain(id: ChainId) {
  if (id === selectedChainId.value) return
  selectedChainId.value = id
  // Clear per-chain state when switching
  depositAddress.value = ''
  walletAddress.value = ''
}

// ── Address fetch (reactive to chain via MaybeRef) ────────────────────────────

const { depositAddress, loadingAddress, fetchDepositAddress } = useDepositAddress(selectedChain)

// Auto-fetch for TON (no wallet connection needed) when user is logged in
watch([selectedChainId, () => auth.isLoggedIn], ([chainId, loggedIn]: [ChainId, boolean]) => {
  if (loggedIn && chainId === 'ton') {
    fetchDepositAddress()
  }
})

// ── Shared copy state ─────────────────────────────────────────────────────────

const copied = ref(false)

async function copyAddress() {
  if (!depositAddress.value) return
  try {
    await navigator.clipboard.writeText(depositAddress.value)
    copied.value = true
    toast.success('Deposit address copied')
    setTimeout(() => (copied.value = false), 2000)
  } catch {
    toast.error('Failed to copy address')
  }
}

// ── BSC-only: EVM wallet connection ──────────────────────────────────────────

const BSC_CHAIN_ID = '0x38'
const connecting = ref(false)
const walletAddress = ref('')

const shortWallet = computed(() =>
  walletAddress.value
    ? `${walletAddress.value.slice(0, 6)}…${walletAddress.value.slice(-4)}`
    : ''
)

function evmProvider(): any {
  return typeof window !== 'undefined' ? (window as any).ethereum : undefined
}

async function connectWallet() {
  const eth = evmProvider()
  if (!eth) {
    toast.error('No EVM wallet detected. Please install MetaMask.')
    return
  }
  connecting.value = true
  try {
    const accounts: string[] = await eth.request({ method: 'eth_requestAccounts' })
    if (!accounts?.length) throw new Error('No account authorized')
    walletAddress.value = accounts[0]
    await ensureBscChain(eth)
    await fetchDepositAddress()
  } catch (e: unknown) {
    toast.error(errText(e) || 'Failed to connect wallet')
    walletAddress.value = ''
  } finally {
    connecting.value = false
  }
}

async function ensureBscChain(eth: any) {
  try {
    await eth.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: BSC_CHAIN_ID }],
    })
  } catch (e: any) {
    if (e?.code === 4902) {
      await eth.request({
        method: 'wallet_addEthereumChain',
        params: [
          {
            chainId: BSC_CHAIN_ID,
            chainName: 'BNB Smart Chain',
            nativeCurrency: { name: 'BNB', symbol: 'BNB', decimals: 18 },
            rpcUrls: ['https://bsc-dataseed.binance.org/'],
            blockExplorerUrls: ['https://bscscan.com'],
          },
        ],
      })
    }
  }
}

function errText(e: unknown): string {
  return (e as any)?.data?.error?.message || (e as any)?.message || ''
}

// ── Derived display helpers ───────────────────────────────────────────────────

/** True when the current chain needs a wallet and none is connected yet */
const needsWalletConnect = computed(
  () => selectedChain.value.requiresWallet && !walletAddress.value
)
</script>

<template>
  <div class="pay">
    <div class="pay-page">
      <header class="deposit__head">
        <h1 class="pay-display">Add funds<span>Unlock more throughput</span></h1>
        <p class="pay-lede deposit__lede">
          Top up with a card or USDT. Funds are credited in USD and drawn per token as you call the API.
        </p>
      </header>

      <div class="pay-split">
        <aside class="pay-sticky">
          <ConcurrencyBoost
            :bonus-pct="bonusPct"
            :bonus-min="topupConfig?.bonus_min_amount"
          />
        </aside>

        <div>
          <!-- ① Not signed in -->
          <section v-if="!auth.isLoggedIn" class="pay-block" aria-labelledby="signin-title">
            <p class="pay-tag">[sign in]</p>
            <h2 id="signin-title" class="pay-headline deposit__gap">Sign in to add funds</h2>
            <p class="pay-lede deposit__gap">
              Create an account or sign in to top up and generate your personal deposit address.
            </p>
            <button class="pay-btn pay-btn--primary pay-btn--lg deposit__cta" @click="openLogin()">
              <LucideLogIn class="h-4 w-4" /> Sign In
            </button>
          </section>

          <!-- ② Signed in -->
          <template v-else>
            <!-- Method selector, only when card top-up is enabled -->
            <section v-if="cardEnabled" class="pay-block" aria-labelledby="method-title">
              <div class="pay-block__head">
                <h2 id="method-title" class="pay-tag">[method]</h2>
              </div>
              <div role="tablist" aria-label="Payment method" class="pay-chips">
                <button
                  v-for="m in METHODS"
                  :key="m.id"
                  role="tab"
                  class="pay-chip"
                  :aria-selected="activeMethod === m.id"
                  @click="method = m.id"
                >
                  <component :is="m.icon" class="h-3.5 w-3.5" />
                  {{ m.label }}
                </button>
              </div>
            </section>

            <!-- Card top-up -->
            <CardTopup
              v-if="activeMethod === 'card' && topupConfig"
              :config="topupConfig"
              :account="auth.displayName"
            />

            <!-- Crypto top-up -->
            <template v-else>
              <section class="pay-block" aria-labelledby="network-title">
                <div class="pay-block__head">
                  <h2 id="network-title" class="pay-tag">[network]</h2>
                  <span v-if="bonusPct > 0 && topupConfig" class="pay-label pay-green">
                    +{{ bonusPct }}% bonus from {{ formatUsd(topupConfig.bonus_min_amount) }}
                  </span>
                </div>
                <div role="tablist" aria-label="Network" class="pay-chips">
                  <button
                    v-for="chain in DEPOSIT_CHAINS"
                    :key="chain.id"
                    role="tab"
                    class="pay-chip"
                    :aria-selected="selectedChainId === chain.id"
                    @click="selectChain(chain.id)"
                  >
                    {{ chain.label }}
                  </button>
                </div>
              </section>
              <!-- BSC: wallet connect gate -->
              <section v-if="needsWalletConnect" class="pay-block" aria-labelledby="wallet-title">
                <div class="pay-block__head">
                  <h2 id="wallet-title" class="pay-tag">[wallet]</h2>
                </div>
                <p class="pay-lede">
                  Link a {{ selectedChain.label }} wallet to unlock the deposit address for this account.
                </p>
                <dl class="pay-ledger deposit__gap-lg">
                  <div class="pay-ledger__row">
                    <dt>Account</dt>
                    <dd class="deposit__plain">{{ auth.displayName }}</dd>
                  </div>
                  <div class="pay-ledger__row">
                    <dt>Network</dt>
                    <dd>{{ selectedChain.label }}</dd>
                  </div>
                </dl>
                <button
                  :disabled="connecting"
                  class="pay-btn pay-btn--primary pay-btn--lg pay-btn--block deposit__cta"
                  @click="connectWallet()"
                >
                  <LucideLoader2 v-if="connecting" class="h-4 w-4 animate-spin" />
                  <LucideWallet v-else class="h-4 w-4" />
                  {{ connecting ? 'Connecting…' : 'Connect Wallet' }}
                </button>
              </section>

              <!-- Address pane (BSC after wallet connect, or TON direct) -->
              <section v-else class="pay-block" aria-labelledby="address-title" aria-live="polite">
                <div class="pay-block__head">
                  <h2 id="address-title" class="pay-tag">[deposit address]</h2>
                  <span v-if="walletAddress" class="pay-label deposit__wallet">
                    <span class="deposit__dot" /> {{ shortWallet }}
                  </span>
                </div>

                <!-- Loading -->
                <p v-if="loadingAddress" class="pay-fine deposit__status">
                  <LucideLoader2 class="h-4 w-4 animate-spin" /> Generating secure address…
                </p>

                <!-- Address + QR -->
                <div v-else-if="depositAddress" class="deposit__address">
                  <div class="deposit__qr">
                    <qrcode-vue :value="depositAddress" :size="152" level="H" />
                  </div>

                  <div class="deposit__address-main">
                    <div class="pay-well">
                      <div class="pay-well__bar">
                        <span class="pay-warn">Only send USDT on {{ selectedChain.label }}</span>
                        <button class="pay-btn pay-btn--ghost deposit__copy" @click="copyAddress()">
                          <LucideCheck v-if="copied" class="h-3.5 w-3.5" />
                          <LucideCopy v-else class="h-3.5 w-3.5" />
                          {{ copied ? 'Copied' : 'Copy' }}
                        </button>
                      </div>
                      <code class="pay-well__body deposit__code">{{ depositAddress }}</code>
                    </div>

                    <dl class="pay-ledger deposit__gap-lg">
                      <div class="pay-ledger__row">
                        <dt>Token</dt>
                        <dd>USDT</dd>
                      </div>
                      <div class="pay-ledger__row">
                        <dt>Network</dt>
                        <dd>{{ selectedChain.label }}</dd>
                      </div>
                      <div class="pay-ledger__row">
                        <dt>Arrival</dt>
                        <dd>{{ selectedChain.arrival }} after confirmation</dd>
                      </div>
                      <div class="pay-ledger__row">
                        <dt>Concurrency</dt>
                        <dd class="pay-green">Higher limit once credited</dd>
                      </div>
                    </dl>
                  </div>
                </div>

                <!-- Address fetch failed -->
                <div v-else class="deposit__failed">
                  <p class="pay-error deposit__status">
                    <LucideAlertCircle class="h-4 w-4" /> Could not load your deposit address.
                  </p>
                  <button class="pay-btn pay-btn--ghost deposit__gap" @click="fetchDepositAddress()">
                    Try Again
                  </button>
                </div>
              </section>
            </template>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.deposit__head {
  margin-bottom: clamp(32px, 4vw, 56px);
}
.deposit__lede {
  margin-top: 16px;
}
.deposit__gap {
  margin-top: 12px;
}
.deposit__gap-lg {
  margin-top: 20px;
}
.deposit__cta {
  margin-top: 24px;
}
.deposit__plain {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.deposit__wallet {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  text-transform: none;
}
.deposit__dot {
  width: 6px;
  height: 6px;
  background: var(--pay-green);
}
.deposit__status {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 24px 0;
}
.deposit__address {
  display: grid;
  gap: 20px;
}
@media (min-width: 640px) {
  .deposit__address {
    grid-template-columns: auto 1fr;
    align-items: start;
  }
}
.deposit__qr {
  justify-self: start;
  padding: 10px;
  border-radius: 2px;
  background: #fff;
  line-height: 0;
}
.deposit__address-main {
  min-width: 0;
}
.deposit__copy {
  min-height: 28px;
  padding: 0 10px;
  font-size: 11px;
}
.deposit__code {
  display: block;
  font-family: inherit;
}
.deposit__failed {
  padding-bottom: 8px;
}
</style>

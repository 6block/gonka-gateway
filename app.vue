<template>
  <div class="min-h-screen bg-[#fafafa] dark:bg-[#050510] text-gray-900 dark:text-gray-200 antialiased selection:bg-primary-500/30">
    <!-- Ambient background effects (dark mode only) -->
    <div class="fixed inset-0 pointer-events-none dark:block hidden z-0">
      <div class="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-primary-500/[0.07] rounded-full blur-[120px] animate-glow-pulse"></div>
      <div class="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-accent-cyan/[0.05] rounded-full blur-[120px] animate-glow-pulse" style="animation-delay: 1.5s"></div>
      <div class="absolute top-[40%] right-[20%] w-[300px] h-[300px] bg-accent-pink/[0.04] rounded-full blur-[100px] animate-glow-pulse" style="animation-delay: 3s"></div>
    </div>

    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>

<style>
/* Base overrides */
html {
  scroll-behavior: smooth;
}
body {
  margin: 0;
}

/* Page Transitions */
.page-enter-active,
.page-leave-active {
  transition: all 0.35s cubic-bezier(0.16, 1, 0.3, 1);
}
.page-enter-from {
  opacity: 0;
  transform: translateY(12px);
}
.page-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}

/* Custom Scrollbar */
::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}
::-webkit-scrollbar-track {
  background: transparent;
}
::-webkit-scrollbar-thumb {
  background: rgba(139, 92, 246, 0.2);
  border-radius: 3px;
}
.dark ::-webkit-scrollbar-thumb {
  background: rgba(139, 92, 246, 0.25);
}
::-webkit-scrollbar-thumb:hover {
  background: rgba(139, 92, 246, 0.4);
}

/* Noise texture overlay */
.dark .noise-overlay::before {
  content: '';
  position: fixed;
  inset: 0;
  pointer-events: none;
  opacity: 0.015;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
  z-index: 9999;
}
</style>

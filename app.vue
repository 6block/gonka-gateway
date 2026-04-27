<template>
  <div class="min-h-screen bg-surface text-text-main antialiased font-body">
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>

<style>
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

/* Global scrollbar */
::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}
::-webkit-scrollbar-track {
  background: transparent;
}
::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 3px;
}
html.light ::-webkit-scrollbar-thumb {
  background: rgba(0, 0, 0, 0.12);
}
::-webkit-scrollbar-thumb:hover {
  background: rgba(0, 255, 163, 0.35);
}
</style>

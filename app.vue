<template>
  <div class="min-h-screen bg-[#fafafa] dark:bg-[#000000] text-gray-900 dark:text-gray-200 antialiased selection:bg-primary-500/30">
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
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}
.page-enter-from {
  opacity: 0;
  transform: translateY(10px);
}
.page-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

/* Custom Scrollbar for a sleek look */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}
::-webkit-scrollbar-track {
  background: transparent;
}
::-webkit-scrollbar-thumb {
  background: rgba(156, 163, 175, 0.3);
  border-radius: 4px;
}
.dark ::-webkit-scrollbar-thumb {
  background: rgba(156, 163, 175, 0.2);
}
::-webkit-scrollbar-thumb:hover {
  background: rgba(156, 163, 175, 0.5);
}
</style>
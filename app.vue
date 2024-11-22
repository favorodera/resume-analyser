<template>
  <NuxtLoadingIndicator color="white" />
  <main class="h-screen w-full flex flex-col justify-between gap-y-10 relative">
    <NuxtPage />
    <Notification />
    <Footer />
  </main>
</template>

<style lang="scss">
@import '@unocss/reset/tailwind.css';

body{
  background-color: #121212;
  color: white;
  font-family: "Source Code Pro", monospace;
}

#app {
  margin: 0 auto;
  width: clamp(15rem, 80rem, 100%);
  padding: 1rem;
}

.page-enter-active,
.page-leave-active {
  transition: all 1s ease;
}
.page-enter-from,
.page-leave-to {
  opacity: 0;
}

ul,ol{
  display: flex;
  flex-direction: column;
  gap: 1rem
}
</style>

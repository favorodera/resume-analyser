<template>
  <NuxtLoadingIndicator color="white" />
  <main class="flex-[1_1_auto] w-full flex flex-col justify-between gap-y-10">
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
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
}

#app {
  width: clamp(15rem, 80rem, 100%);
  padding: 1rem;
  flex: 1 1 auto;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center
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

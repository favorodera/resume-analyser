<template>
  <main class="h-screen w-full flex flex-col justify-between gap-y-10">
    <NuxtPage />
    <Footer />
  </main>
</template>

<style lang="scss">
@import '@unocss/reset/tailwind.css';

body{
  color-scheme: dark;
  background-color: #121212;
  color: white;
  font-family: "Source Code Pro", monospace;
}

#app {
  margin: 0 auto;
  width: clamp(15rem, 80rem, 100%);
  padding: 1rem;
}

ul,ol{
  display: flex;
  flex-direction: column;
  gap: 1rem
}
</style>

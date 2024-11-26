<template>
  <NuxtLoadingIndicator color="white" />
  <main class="flex-[1_1_auto] w-full flex flex-col justify-between gap-y-10">
    <NuxtPage />
    <Notification />
    <Footer />
  </main>
</template>

<script setup lang="ts">
useSeoMeta({
  titleTemplate: title => `Resume Analyser | ${title}`,
  ogTitle: 'Resume Analyser',
  description: 'AI powered resume analyser',
  ogDescription: 'AI powered resume analyser',
  twitterImage: {
    alt: 'Resume Analyser',
    url: '/avatar.jpg',
    type: 'image/jpeg',
    width: 400,
    height: 400,
  },
  twitterCard: 'summary_large_image',
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
    userScalable: 'yes',
    viewportFit: 'cover',
  },
  charset: 'UTF-8',
  ogLocale: 'en_NG',
  ogType: 'website',
  ogSiteName: 'Resume Analyser',
})

useHead({
  htmlAttrs: {
    lang: 'en',
  },
  link: [
    {
      rel: 'icon',
      type: 'image/x-icon',
      href: '/favicon.ico',
    },
    {
      rel: 'apple-touch-icon',
      sizes: '180x180',
      href: '/apple-touch-icon.png',
    },
    {
      rel: 'icon',
      type: 'image/png',
      sizes: '32x32',
      href: '/favicon-32x32.png',
    },
    {
      rel: 'icon',
      type: 'image/png',
      sizes: '16x16',
      href: '/favicon-16x16.png',
    },
    {
      rel: 'manifest',
      href: '/site.webmanifest',
    },
  ],
})
</script>

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
  gap: 0.5rem;
  list-style: disc;
  list-style-position: inside;
}

li::marker {
  color: darkgray;
  font-size: 1.2rem;
}
</style>

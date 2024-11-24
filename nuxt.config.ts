// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    '@unocss/nuxt',
    '@nuxt/eslint',
    '@nuxtjs/color-mode',
    '@pinia/nuxt',
  ],

  ssr: true,

  devtools: { enabled: false },

  app: {
    head: {
      htmlAttrs: {
        lang: 'en',
      },
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'Resume Analyser' },
      ],
    },
    pageTransition: { name: 'page', mode: 'out-in' },
    rootTag: 'main',
    rootAttrs: {
      id: 'app',
    },
  },

  colorMode: {
    preference: 'dark',
    fallback: 'dark',
    storage: 'localStorage',
    storageKey: 'color-mode',
    classPrefix: '',
    classSuffix: '',
  },

  runtimeConfig: {
    geminiApiKey: '',
  },

  experimental: {
    asyncContext: true,
  },

  compatibilityDate: '2024-04-03',

  nitro: {
    compressPublicAssets: true,
    minify: true,
  },

  eslint: {
    config: {
      stylistic: true,
    },
  },

  unocss: {
    nuxtLayers: true,
  },
})

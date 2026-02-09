// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from '@tailwindcss/vite'

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  components: {
    dirs: []
  },

  modules: [
    '@pinia/nuxt',
    '@nuxt/eslint',
    'shadcn-nuxt',
    '@vueuse/nuxt',
    '@nuxt/test-utils/module',
  ],

  shadcn: {
    /**
      * Prefix for all the imported component
      */
    prefix: '',
    /**
      * Directory that the component lives in.
      * @default "./components/ui"
      */
    componentDir: '@/components/ui'
  },

  runtimeConfig: {
    public: {
      appUrl: process.env.NUXT_PUBLIC_APP_URL,
    },
  },

  css: ['~/assets/css/main.css'],

  vite: {
    plugins: [tailwindcss()],
  }
})

import { fileURLToPath } from 'url';
// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    devtools: { enabled: true },
    alias: {
        '@images': fileURLToPath(new URL('./assets/images', import.meta.url))
    },
    modules: ['@formkit/nuxt', '@pinia/nuxt', '@nuxtjs/leaflet'],
    formkit: {
        // Experimental support for auto loading (see note):
        autoImport: true
    },
    css: ['@/assets/styles/global.scss', '@/assets/styles/reset.scss', '@/assets/fonts/fonts.css', 'vue-toastification/dist/index.css', '@/assets/styles/formkit.scss'],
    runtimeConfig: {
        public: {
            apiUrl: 'localhost:3333'
        }
    }
});

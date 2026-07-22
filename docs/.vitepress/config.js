import { defineConfig } from 'vitepress'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export default defineConfig({
  title: 'Vinícius Rezende',
  description: 'Software Engineer Portfolio & Docs',
  srcDir: '.',
  head: [
    ['link', { rel: 'icon', href: '/favicon.ico?v=1' }]
  ],
  locales: {
    en: {
      label: 'English',
      lang: 'en',
      link: '/en/',
      title: 'Vinícius Rezende',
      description: 'Software Engineer Portfolio'
    },
    pt: {
      label: 'Português',
      lang: 'pt',
      link: '/pt/',
      title: 'Vinícius Rezende',
      description: 'Portfólio de Engenheiro de Software'
    }
  },
  themeConfig: {
    // Custom documentation configs can be loaded here
  },
  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          api: 'modern-compiler'
        }
      }
    },
    resolve: {
      alias: {
        '@docs': path.resolve(__dirname, '..')
      }
    }
  }
})

export default {
  ssr: false,
  head: {
    titleTemplate: '%s | TLCA',
    title: 'TLCA',
    htmlAttrs: {
      lang: 'en',
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      {
        hid: 'description',
        name: 'description',
        content:
          'TLCA is an academy platform where you can teach and learn competencies.',
      },
      { name: 'format-detection', content: 'telephone=no' },
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
  },
  css: ['@mdi/font/css/materialdesignicons.css'],
  plugins: [],
  components: {
    dirs: [
      '~/components',
      '~/components/cards',
      '~/components/courses',
      '~/components/homespace',
      '~/components/infopanels',
    ],
  },
  buildModules: ['@nuxtjs/eslint-module', '@nuxtjs/vuetify'],
  modules: ['@nuxtjs/apollo', '@nuxtjs/auth-next', '@nuxtjs/i18n'],
  apollo: {
    clientConfigs: {
      default: {
        httpEndpoint:
          process.env.NODE_ENV !== 'production'
            ? 'http://localhost:4001'
            : 'https://api.tlca.eu',
      },
    },
  },
  auth: {
    strategies: {
      graphql: {
        scheme: '~/schemes/graphqlScheme.js',
        token: {
          global: false,
        },
      },
    },
    redirect: {
      login: '/',
      logout: '/',
      callback: false,
      home: '/dashboard',
    },
  },
  i18n: {
    strategy: 'no_prefix',
    locales: [
      {
        code: 'en-GB',
        name: 'UK (English)',
        file: 'en-GB.json',
      },
      {
        code: 'fr-BE',
        name: 'Belgique (Français)',
        file: 'fr-BE.json',
      },
    ],
    lazy: true,
    langDir: 'lang/',
    defaultLocale: 'en-GB',
  },
  vuetify: {
    customVariables: ['~/assets/variables.scss'],
    defaultAssets: false
  },
  build: {},
}

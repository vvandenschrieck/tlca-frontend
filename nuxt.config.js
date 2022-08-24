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
  plugins: [
    '~/plugins/echarts.js',
    '~/plugins/notification-manager.js',
    '~/plugins/validation.js',
    '~/plugins/vee-validate4vuetify.js',
    '~/plugins/vue-rx.js',
  ],
  components: {
    dirs: [
      '~/components',
      '~/components/base',
      '~/components/cards',
      '~/components/courses',
      '~/components/filterbars',
      '~/components/homespace',
      '~/components/infopanels',
      '~/components/programs',
    ],
  },
  buildModules: ['@nuxtjs/eslint-module', '@nuxtjs/vuetify'],
  modules: [
    '@nuxtjs/apollo',
    '@nuxtjs/auth-next',
    '@nuxtjs/i18n',
    [
      'nuxt-bugsnag',
      {
        apiKey: process.env.BUGSNAG_BROWSER_API_KEY,
        config: {
          appVersion: '1.0.4',
          enabledReleaseStages: ['production'],
          environment: process.env.NODE_ENV,
        },
        publishRelease: true,
      },
    ],
  ],
  apollo: {
    clientConfigs: {
      default: '~/apollo.config.js',
    },
    defaultOptions: {
      $query: {
        fetchPolicy: 'cache-and-network',
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
      login: '/login',
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
  router: {
    middleware: 'roles-auth',
  },
  vuetify: {
    customVariables: ['~/assets/variables.scss'],
    defaultAssets: false,
  },
  alias: {
    vue: 'vue/dist/vue.runtime.esm.js',
  },
  build: {},
  publicRuntimeConfig: {
    graphqlEndpoint: process.env.GRAPHQL_ENDPOINT || 'http://localhost:4001',
  },
  privateRuntimeConfig: {},
}

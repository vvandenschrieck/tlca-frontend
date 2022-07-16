<template>
  <v-app>
    <space-navigator v-if="$auth.user" />
    <v-app-bar clipped-left dense fixed app>
      <v-toolbar-title>{{ title }}</v-toolbar-title>
      <v-spacer />
      <template v-if="!$auth.user">
        <sign-up-form />
        <sign-in-form />
      </template>
      <user-menu v-else />
    </v-app-bar>
    <v-main>
      <v-container>
        <notification-displayer />
        <bread-crumb v-if="showBreadCrumb" />
        <Nuxt />
      </v-container>
    </v-main>
    <v-footer absolute app>
      <small>{{ $t('global.powered_by') }} AEI Consulting – v1.2.0.</small>
      <v-spacer />
      <div>
        <language-switcher />
      </div>
    </v-footer>
  </v-app>
</template>

<script>
export default {
  name: 'DefaultLayout',
  data() {
    return {
      title: 'TLCA',
    }
  },
  computed: {
    showBreadCrumb() {
      return this.$route.fullPath !== '/'
    },
  },
}
</script>

<style>
h2 {
  margin-top: 0.8rem;
  margin-bottom: 1rem;
}
h3 {
  margin-top: 0.6rem;
  margin-bottom: 0.2rem;
}
p {
  text-align: justify;
}
</style>

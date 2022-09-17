<template>
  <v-app>
    <v-app-bar app clipped-left dense fixed>
      <v-toolbar-title>{{ title }}</v-toolbar-title>

      <v-spacer />

      <template v-if="!$auth.user">
        <sign-up-btn />
        <sign-in-btn />
      </template>

      <template v-else>
        <span class="mr-2 text-body-2">{{ $auth.user.displayName }}</span>
        <user-menu />
      </template>
    </v-app-bar>

    <v-main>
      <v-container style="padding-left: 56px">
        <notification-displayer />
        <space-navigator v-if="$auth.user" />
        <bread-crumb v-if="showBreadCrumb" />
        <Nuxt />
      </v-container>
    </v-main>

    <v-footer app>
      <span class="text-caption">
        {{ $t('global.powered_by') }} AEI Consulting – v1.1.1.
      </span>

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

<template>
  <v-app>
    <space-navigator v-if="$auth.user" />
    <v-app-bar clipped-left dense fixed app>
      <v-toolbar-title>{{ title }}</v-toolbar-title>
      <v-spacer />
      <sign-in-form v-if="!$auth.user" />
      <user-menu v-else />
    </v-app-bar>
    <v-main>
      <v-container>
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
      title: 'TLCA'
    };
  }
}
</script>

<style>
h2 {
  margin-bottom: 0.8rem;
}
</style>

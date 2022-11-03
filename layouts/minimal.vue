<template>
  <v-app>
    <v-app-bar app clipped-left dense fixed>
      <v-toolbar-title>{{ title }}</v-toolbar-title>
    </v-app-bar>

    <v-main>
      <v-container>
        <notification-displayer />
        <Nuxt />
      </v-container>
    </v-main>

    <v-footer app>
      <span class="text-caption">
        {{ $t('global.powered_by') }} AEI Consulting – v1.1.18.
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
  name: 'MinimalLayout',
  data() {
    return {
      title: 'TLCA',
    }
  },
}
</script>

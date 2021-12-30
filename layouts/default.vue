<template>
  <v-app dark>
    <space-navigator />
    <v-app-bar clipped-left dense fixed app>
      <v-toolbar-title v-text="title" />
      <v-spacer />
    </v-app-bar>
    <v-main>
      <v-container>
        <Nuxt />
      </v-container>
    </v-main>
    <v-footer absolute app>
      <span>{{ $t('global.powered_by') }} AEI Consulting – v1.2.0.</span>
      <v-spacer />
      <div>
        <language-switcher />
      </div>
    </v-footer>
  </v-app>
</template>

<script>
import LanguageSwitcher from '~/components/LanguageSwitcher.vue';
import SpaceNavigator from '~/components/SpaceNavigator.vue';

export default {
  name: 'DefaultLayout',
  components: { LanguageSwitcher, SpaceNavigator },
  data() {
    return {
      title: 'TLCA'
    };
  }
}
</script>

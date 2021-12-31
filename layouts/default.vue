<template>
  <v-app>
    <space-navigator />
    <v-app-bar clipped-left dense fixed app>
      <v-toolbar-title v-text="title" />
      <v-spacer />
      <sign-in-form />
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
import LanguageSwitcher from '~/components/LanguageSwitcher.vue';
import SignInForm from '~/components/SignInForm.vue';
import SpaceNavigator from '~/components/SpaceNavigator.vue';

export default {
  name: 'DefaultLayout',
  components: { LanguageSwitcher, SpaceNavigator, SignInForm },
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

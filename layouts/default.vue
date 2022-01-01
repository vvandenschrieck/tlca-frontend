<template>
  <v-app>
    <space-navigator v-if="$auth.user" />
    <v-app-bar clipped-left dense fixed app>
      <v-toolbar-title v-text="title" />
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
import LanguageSwitcher from '~/components/LanguageSwitcher.vue';
import SignInForm from '~/components/SignInForm.vue';
import SpaceNavigator from '~/components/SpaceNavigator.vue';
import UserMenu from '~/components/UserMenu.vue';

export default {
  name: 'DefaultLayout',
  components: { LanguageSwitcher, SpaceNavigator, SignInForm, UserMenu },
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

<template>
  <v-menu offset-y>
    <template #activator="{ on, attrs }">
      <v-btn v-bind="attrs" icon small v-on="on">
        <v-icon>mdi-account</v-icon>
      </v-btn>
    </template>
    <v-list>
      <v-subheader>
        {{ $auth.user.displayName }}
      </v-subheader>
      <v-divider />
      <v-list-item v-for="(item, index) in items" :key="index">
        <v-list-item-title>{{ item.title }}</v-list-item-title>
      </v-list-item>
      <v-divider />
      <v-list-item @click="signOut()">
        <v-list-item-title>{{ $t('authentication.sign_out') }}</v-list-item-title>
      </v-list-item>
    </v-list>
  </v-menu>
</template>

<script>
export default {
  name: 'UserMenu',
  data() {
    return {
      items: []
    };
  },
  methods: {
    async signOut() {
      this.$nuxt.$loading.start();
      await this.$auth.logout();
    }
  }
}
</script>

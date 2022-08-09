<template>
  <v-container class="d-flex" style="height: 85vh">
    <sign-in-form
      class="align-self-center ma-auto"
      style="min-width: 30vw"
      @reset="redirectHome"
    />
  </v-container>
</template>

<script>
export default {
  name: 'LoginPage',
  layout: 'minimal',
  head() {
    return {
      title: this.$t('authentication.sign_in'),
    }
  },
  methods: {
    redirectHome() {
      this.$router.push({ name: 'index' })
    },
  },
  meta: {
    roles: ['guest'],
  },
}
</script>

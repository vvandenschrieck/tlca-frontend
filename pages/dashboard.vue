<template>
  <div>
    <h2>{{ title }}</h2>

    <p>Welcome on TLCA {{ $auth.user.displayName ?? $auth.user.username }}!</p>
  </div>
</template>

<script>
export default {
  name: 'DashboardPage',
  head() {
    return {
      title: this.title,
    }
  },
  computed: {
    title() {
      return this.$t('general.dashboard')
    },
  },
}
</script>

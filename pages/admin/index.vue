<template>
  <p>Admin space</p>
</template>

<script>
export default {
  name: 'AdminPage',
  head() {
    return {
      title: this.$t('global.spaces.admin'),
    }
  },
  meta: {
    roles: ['admin'],
  },
}
</script>

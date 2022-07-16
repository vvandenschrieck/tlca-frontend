<template>
  <p>Learn space</p>
</template>

<script>
export default {
  name: 'LearnPage',
  head() {
    return {
      title: this.$t('global.spaces.learn'),
    }
  },
  meta: {
    roles: ['student'],
  },
}
</script>

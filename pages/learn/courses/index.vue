<template>
  <p>Learn space : courses</p>
</template>

<script>
export default {
  name: 'LearnCoursesPage',
  head() {
    return {
      title: this.$tc('course._', 2) + ' | ' + this.$t('global.spaces.learn'),
    }
  },
  meta: {
    roles: ['student'],
  },
}
</script>

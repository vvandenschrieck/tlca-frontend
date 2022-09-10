<template>
  <div>
    <h2>{{ title }}</h2>

    <form-course />
  </div>
</template>

<script>
export default {
  name: 'ManageCreateCoursePage',
  head() {
    return {
      title: this.title,
    }
  },
  computed: {
    title() {
      return this.$t('course.create')
    },
  },
  meta: {
    roles: ['teacher'],
  },
}
</script>

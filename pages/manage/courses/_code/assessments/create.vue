<template>
  <div>
    <h2>{{ title }}</h2>

    <form-assessment />
  </div>
</template>

<script>
export default {
  name: 'ManageCreateAssessmentPage',
  head() {
    return {
      title: this.title,
    }
  },
  computed: {
    title() {
      return this.$t('assessment.create')
    },
  },
  meta: {
    roles: ['teacher'],
  },
}
</script>

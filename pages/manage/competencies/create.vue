<template>
  <div>
    <h2>{{ title }}</h2>

    <form-competency />
  </div>
</template>

<script>
export default {
  name: 'ManageCreateCompetencyPage',
  head() {
    return {
      title: this.title,
    }
  },
  computed: {
    title() {
      return this.$t('competency.create')
    },
  },
  meta: {
    roles: ['teacher'],
  },
}
</script>

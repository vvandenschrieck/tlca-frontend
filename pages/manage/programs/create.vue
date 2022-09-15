<template>
  <div>
    <h2>{{ title }}</h2>

    <form-program />
  </div>
</template>

<script>
export default {
  name: 'ManageCreateProgramPage',
  head() {
    return {
      title: this.title,
    }
  },
  computed: {
    title() {
      return this.$t('program.create')
    },
  },
  meta: {
    roles: ['teacher'],
  },
}
</script>

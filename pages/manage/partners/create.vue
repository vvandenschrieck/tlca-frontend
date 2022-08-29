<template>
  <div>
    <h2>{{ title }}</h2>

    <form-partner />
  </div>
</template>

<script>
export default {
  name: 'ManagePartnerCreatePage',
  head() {
    return {
      title: this.title,
    }
  },
  computed: {
    title() {
      return this.$t('partner.create')
    },
  },
  meta: {
    roles: ['manager'],
  },
}
</script>

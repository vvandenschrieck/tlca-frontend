<template>
  <generic-card :banner="partner.banner" :to="{ name: 'partners-code', params: { code: partner.code } }" :label="partner.abbreviation">
    <v-card-title class="name">{{ partner.name }}</v-card-title>
  </generic-card>
</template>

<script>
export default {
  name: 'PartnerCard',
  props: {
    partner: {
      type: Object,
      required: true
    }
  }
}
</script>

<style scoped>
.name {
  font-size: 0.875rem;
  line-height: 1.375rem;
  word-break: break-word;
}
</style>

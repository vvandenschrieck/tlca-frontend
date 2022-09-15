<template>
  <generic-card
    :banner="partner.banner"
    :to="link"
    :label="partner.abbreviation"
  >
    <v-card-title class="name">
      {{ partner.name }}
    </v-card-title>
  </generic-card>
</template>

<script>
export default {
  name: 'PartnerCard',
  props: {
    linkPrefix: {
      type: String,
      default: '',
    },
    partner: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      link: {
        name: `${this.linkPrefix}partners-code`,
        params: { code: this.partner.code },
      },
    }
  },
}
</script>

<style scoped>
.name {
  font-size: 0.875rem;
  line-height: 1.375rem;
  word-break: break-word;
}
</style>

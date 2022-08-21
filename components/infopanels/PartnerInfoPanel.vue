<template>
  <generic-info-panel
    :title="$t('general.information._')"
    icon="mdi-information"
    :items="items"
  />
</template>

<script>
export default {
  name: 'PartnerInfoPanel',
  props: {
    partner: {
      type: Object,
      required: true,
    },
  },
  computed: {
    items() {
      const items = []

      // Partner website
      const website = this.partner.website
      if (website) {
        items.push({
          icon: 'mdi-web',
          text: website,
          tooltip: this.$t('partner.website'),
        })
      }

      // Partner abbreviation
      const abbreviation = this.partner.abbreviation
      if (abbreviation) {
        items.push({
          icon: 'mdi-domain',
          text: abbreviation,
          tooltip: this.$t('partner.abbreviation'),
        })
      }

      return items
    },
  },
}
</script>

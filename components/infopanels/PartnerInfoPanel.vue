<template>
  <generic-info-panel
    :title="$t('global.information')"
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
      const infoItemFields = {
        website: 'mdi-web',
        abbreviation: 'mdi-domain',
        tags: 'mdi-tag-multiple',
      }
      return this.generateInfoItems('partner', this.partner, infoItemFields)
    },
  },
}
</script>

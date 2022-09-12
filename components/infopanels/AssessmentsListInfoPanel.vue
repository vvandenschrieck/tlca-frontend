<template>
  <generic-info-panel
    icon="mdi-information"
    :items="items"
    :title="$t('general.information._')"
  />
</template>

<script>
export default {
  name: 'AssessmentsListInfoPanel',
  props: {
    assessments: {
      type: Array,
      required: true,
    },
    code: {
      type: String,
      required: true,
    },
  },
  computed: {
    items() {
      const items = []

      // Total number of assessments.
      items.push({
        icon: 'mdi-clipboard-text',
        text: this.$tc('assessment.nb', this.assessments.length, {
          nb: this.assessments.length,
        }),
        tooltip: this.$t('assessment.nb_of'),
      })

      return items
    },
  },
}
</script>

<template>
  <generic-info-panel
    :title="$t('general.information._')"
    icon="mdi-information"
    :items="items"
  />
</template>

<script>
import datetime from '@/mixins/datetime.js'

export default {
  name: 'AssessmentInfoPanel',
  mixins: [datetime],
  props: {
    assessment: {
      type: Object,
      required: true,
    },
  },
  computed: {
    items() {
      const items = []

      // Assessment calendar
      if (this.assessment.start) {
        items.push({
          icon: 'mdi-calendar',
          text: this.$t('assessment.start.date', {
            start: this.formatDateFull(this.assessment.start),
          }),
          tooltip: this.$t('assessment.start._'),
        })
      }
      if (this.assessment.end) {
        items.push({
          icon: 'mdi-calendar',
          text: this.$t('assessment.deadline.date', {
            deadline: this.formatDateFull(this.assessment.end),
          }),
          tooltip: this.$t('assessment.deadline._'),
        })
      }
      return items
    },
  },
}
</script>

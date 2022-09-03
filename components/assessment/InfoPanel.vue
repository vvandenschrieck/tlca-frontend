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

      // Assessment instances.
      const instances = this.assessment.instances
      items.push({
        icon: 'mdi-layers-triple',
        text: instances
          ? this.$tc('assessment.instances.nb', instances, { n: instances })
          : this.$t('assessment.instances.infinite'),
        tooltip: this.$t('assessment.instances.max_nb'),
      })

      // Assessment type.
      const type = this.assessment.type
      items.push({
        icon: 'mdi-multiplication-box',
        text: this.$t(`assessment.type.${type.toLowerCase()}`),
        tooltip: this.$t('assessment.type._'),
      })

      // Assessment schedule.
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

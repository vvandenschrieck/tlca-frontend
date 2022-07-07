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
  name: 'CourseStatusInfoPanel',
  mixins: [datetime],
  props: {
    course: {
      type: Object,
      required: true,
    },
  },
  computed: {
    items() {
      const items = []

      // Course status
      if (!this.course.isPublished) {
        items.push({
          icon: 'mdi-cloud-upload',
          text: this.$t('course.status.unpublished'),
          tooltip: this.$t('course.status._'),
        })
      } else if (!this.course.isArchived) {
        items.push({
          icon: 'mdi-cloud-upload',
          text: this.$t('course.status.published_on', {
            date: this.formatDateFull(this.course.published),
          }),
          tooltip: this.$t('course.status._'),
        })
      } else {
        items.push({
          icon: 'mdi-cloud-upload',
          text: this.$t('course.status.archived_on', {
            date: this.formatDateFull(this.course.archived),
          }),
          tooltip: this.$t('course.status._'),
        })
      }

      // Course visibility
      const visibility = this.course.visibility.toLowerCase()
      items.push({
        icon: 'mdi-eye',
        text: this.$t(`course.visibility.${visibility}`),
        tooltip: this.$t('course.visibility._'),
      })

      return items
    },
  },
}
</script>

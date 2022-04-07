<template>
  <generic-info-panel
    :title="$t('global.information')"
    icon="mdi-information"
    :items="items"
  />
</template>

<script>
import infopanel from '@/mixins/infopanel.js'

export default {
  name: 'CourseInfoPanel',
  mixins: [infopanel],
  props: {
    course: {
      type: Object,
      required: true,
    },
  },
  computed: {
    items() {
      const infoItemFields = {
        field: 'mdi-school',
        language: 'mdi-translate',
        tags: 'mdi-tag-multiple',
      }
      return this.generateInfoItems('course', this.course, infoItemFields)
    },
  },
}
</script>

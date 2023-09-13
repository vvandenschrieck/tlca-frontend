<template>
  <ApolloQuery
    v-slot="{ isLoading, result: { error } }"
    :query="require('~/gql/infopanels/getCourseStatusInfo.gql')"
    :update="(data) => data.course"
    :variables="{ code: courseCode }"
    @result="setItems"
  >
    <generic-info-panel
      :title="$t('general.information._')"
      icon="mdi-information"
      :items="items"
      :loading="!!isLoading"
    >
      <v-card-text v-if="error">{{ $t('error.unexpected') }}</v-card-text>
    </generic-info-panel>
  </ApolloQuery>
</template>

<script>
import datetime from '@/mixins/datetime.js'

export default {
  name: 'CourseStatusInfoPanel',
  mixins: [datetime],
  props: {
    courseCode: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      items: [],
    }
  },
  methods: {
    setItems({ data: course }) {
      if (!course) {
        return []
      }

      const items = []

      // Course status.
      const status = {
        icon: 'mdi-cloud-upload',
        tooltip: this.$t('course.status._'),
      }
      switch (course.status) {
        case 'UNPUBLISHED':
          status.text = this.$t('course.status.unpublished')
          break

        case 'PUBLISHED':
          status.text = this.$t('course.status.published_on', {
            date: this.formatDateFull(course.published),
          })
          break

        case 'ARCHIVED':
          status.text = this.$t('course.status.archived_on', {
            date: this.formatDateFull(course.archived),
          })
          break
      }
      items.push(status)

      // Course visibility.
      const visibility = course.visibility.toLowerCase()
      items.push({
        icon: 'mdi-eye',
        text: this.$t(`course.visibility.${visibility}`),
        tooltip: this.$t('course.visibility._'),
      })

      this.items = items
    },
  },
}
</script>

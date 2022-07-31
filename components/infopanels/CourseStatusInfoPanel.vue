<template>
  <generic-info-panel
    :title="$t('general.information._')"
    icon="mdi-information"
    :items="items"
  >
    <div v-if="$auth.user" class="text-center">
      <!-- Publication button -->
      <ApolloMutation
        :mutation="require('../../gql/manage/publishCourse.gql')"
        :variables="{ code: course.code }"
        @done="published"
      >
        <template #default="{ mutate, loading }">
          <v-btn
            v-if="canPublish"
            small
            color="primary"
            :loading="loading"
            @click="mutate"
          >
            <v-icon left>mdi-cloud-upload</v-icon>
            <span>{{ $t('course.publish') }}</span>
          </v-btn>
        </template>
      </ApolloMutation>

      <!-- Archive button -->
      <archive-form v-if="canArchive" :course="course" @success="archived" />
    </div>
  </generic-info-panel>
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
    canArchive() {
      return this.course.status === 'PUBLISHED'
    },
    canPublish() {
      return this.course.status === 'UNPUBLISHED'
    },
    items() {
      const items = []

      // Course status.
      const status = {
        icon: 'mdi-cloud-upload',
        tooltip: this.$t('course.status._'),
      }
      switch (this.course.status) {
        case 'UNPUBLISHED':
          status.text = this.$t('course.status.unpublished')
          break

        case 'PUBLISHED':
          status.text = this.$t('course.status.published_on', {
            date: this.formatDateFull(this.course.published),
          })
          break

        case 'ARCHIVED':
          status.text = this.$t('course.status.archived_on', {
            date: this.formatDateFull(this.course.archived),
          })
          break
      }
      items.push(status)

      // Course visibility.
      const visibility = this.course.visibility.toLowerCase()
      items.push({
        icon: 'mdi-eye',
        text: this.$t(`course.visibility.${visibility}`),
        tooltip: this.$t('course.visibility._'),
      })

      return items
    },
  },
  methods: {
    archived(course) {
      this.$notificationManager.displaySuccessMessage(
        this.$t('success.COURSE_ARCHIVED')
      )
      this.$router.push({
        name: 'manage-courses-code',
        params: { code: course.code },
      })

      // TODO: Fix the cache and redirect to the URL with the new course code
    },
    published() {
      this.$notificationManager.displaySuccessMessage(
        this.$t('success.COURSE_PUBLISHED')
      )
    },
  },
}
</script>

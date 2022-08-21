<template>
  <generic-info-panel
    :title="$t('general.information._')"
    icon="mdi-information"
    :items="items"
  >
    <div v-if="$auth.user" class="text-center">
      <course-publish-btn :course="course" @success="published" />
      <course-archive-btn :course="course" @success="archived" />
      <course-clone-btn :course="course" @success="cloned" />
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
    cloned(course) {
      this.$notificationManager.displaySuccessMessage(
        this.$t('success.COURSE_CLONED')
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

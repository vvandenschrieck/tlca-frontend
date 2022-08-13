<template>
  <div>
    <generic-info-panel
      v-if="schedule"
      :title="$t('course.schedule._')"
      icon="mdi-calendar"
    >
      <div class="mt-3 text-center">
        <course-schedule dense :items="schedule" />
      </div>
    </generic-info-panel>

    <v-skeleton-loader v-if="loading" type="image" />
  </div>
</template>

<script>
export default {
  name: 'CourseSchedulePanel',
  props: {
    loading: {
      type: Boolean,
      default: false,
    },
    schedule: {
      type: Array,
      default: null,
    },
  },
}
</script>

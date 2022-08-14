<template>
  <generic-info-panel
    :title="$t('course.schedule._')"
    icon="mdi-calendar"
    :loading="loading"
  >
    <div v-if="schedule" class="mt-3 text-center">
      <course-schedule dense :items="schedule" />
    </div>
    <span v-else>{{ $t('course.schedule.no ') }}</span>
  </generic-info-panel>
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

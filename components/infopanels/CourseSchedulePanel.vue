<template>
  <generic-info-panel :title="$t('course.schedule._')" icon="mdi-calendar">
    <div class="mt-3 text-center">
      <course-schedule dense :items="schedule" />
    </div>
  </generic-info-panel>
</template>

<script>
export default {
  name: 'CourseSchedulePanel',
  props: {
    schedule: {
      type: Array,
      required: true,
    },
  },
}
</script>

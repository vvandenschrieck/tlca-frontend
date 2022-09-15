<template>
  <ApolloQuery
    v-slot="{ isLoading, result: { data: course, error } }"
    :query="require('~/gql/infopanels/getCourseSchedule.gql')"
    :update="(data) => data.course"
    :variables="{ courseCode }"
  >
    <generic-info-panel
      :title="$t('course.schedule._')"
      icon="mdi-calendar"
      :loading="!!isLoading"
    >
      <div v-if="!error" class="mt-3 text-center">
        <course-schedule
          v-if="course?.schedule"
          dense
          :items="course.schedule"
        />

        <v-card-text v-else>{{ $t('course.schedule.no') }}</v-card-text>
      </div>

      <v-card-text v-else>{{ $t('error.unexpected') }}</v-card-text>
    </generic-info-panel>
  </ApolloQuery>
</template>

<script>
export default {
  name: 'CourseSchedulePanel',
  props: {
    courseCode: {
      type: String,
      required: true,
    },
  },
}
</script>

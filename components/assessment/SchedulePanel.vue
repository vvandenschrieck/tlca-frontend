<template>
  <ApolloQuery
    v-slot="{ isLoading, result: { error } }"
    :query="require('~/gql/infopanels/getAssessmentSchedule.gql')"
    :update="(data) => data.assessment"
    :variables="{ assessmentId }"
    @result="setSchedule"
  >
    <generic-info-panel
      :title="$t('assessment.schedule._')"
      icon="mdi-calendar"
      :loading="!!isLoading"
    >
      <div v-if="!error" class="mt-3 text-center">
        <schedule-timeline
          v-if="schedule"
          dense
          :items="schedule"
          name-prefix="course.schedule"
        />

        <v-card-text v-else>{{ $t('assessment.schedule.no') }}</v-card-text>
      </div>

      <v-card-text v-else>{{ $t('error.unexpected') }}</v-card-text>
    </generic-info-panel>
  </ApolloQuery>
</template>

<script>
export default {
  name: 'AssessmentSchedulePanel',
  props: {
    assessmentId: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      schedule: null,
    }
  },
  methods: {
    setSchedule({ data: assessment }) {
      const schedule = []
      for (const name of ['start', 'end']) {
        if (assessment && assessment[name]) {
          schedule.push({ name, datetime: assessment[name] })
        }
      }
      this.schedule = schedule.length ? schedule : null
    },
  },
}
</script>

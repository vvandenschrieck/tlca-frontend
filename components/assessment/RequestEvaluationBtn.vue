<template>
  <v-tooltip bottom open-delay="500">
    <template #activator="{ on, attrs }">
      <v-btn
        icon
        small
        v-bind="attrs"
        v-on="on"
        @click.stop="goToEvaluationRequest"
      >
        <v-icon small>mdi-clipboard-edit</v-icon>
      </v-btn>
    </template>

    <span>{{ $t('evaluation.request._') }}</span>
  </v-tooltip>
</template>

<script>
export default {
  name: 'AssessmentRequestEvaluationBtn',
  props: {
    courseCode: {
      type: String,
      required: true,
    },
    assessmentId: {
      type: String,
      required: true,
    },
  },
  methods: {
    goToEvaluationRequest() {
      this.$router.push({
        name: 'learn-courses-code-assessments-id-requestEvaluation',
        params: { code: this.courseCode, id: this.assessmentId },
      })
    },
  },
}
</script>

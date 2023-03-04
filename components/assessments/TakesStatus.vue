<template>
  <v-row>
    <v-col cols="12" md="2">
      <v-chip :color="color" small>&nbsp;</v-chip>
    </v-col>
    <v-col cols="12" md="10" class="text--primary">
      {{ $t(`assessment.takes_status.assessments_${status.toLowerCase()}`) }}
    </v-col>
  </v-row>
</template>

<script>
export default {
  name: 'AssessmentsTakesStatus',
  props: {
    assessments: {
      type: Array,
      default: null,
    },
  },
  computed: {
    color() {
      return {
        AVAILABLE: 'success',
        FINISHED: 'error',
        PENDING: 'warning',
      }[this.status]
    },
    status() {
      const assessments = this.assessments?.filter((a) => !a.isClosed) ?? []

      if (assessments.some((a) => a.takesStatus.status === 'AVAILABLE')) {
        return 'AVAILABLE'
      }
      if (assessments.every((a) => a.takesStatus.status === 'FINISHED')) {
        return 'FINISHED'
      }
      return 'PENDING'
    },
  },
}
</script>

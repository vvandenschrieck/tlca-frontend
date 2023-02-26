<template>
  <div>
    <v-row v-if="!dense">
      <v-col cols="12" md="2">
        <v-chip :color="color" small>&nbsp;</v-chip>
      </v-col>
      <v-col cols="12" md="10" class="text-justify">
        {{ status }}
      </v-col>
    </v-row>
    <v-chip v-else :color="color" x-small>&nbsp;</v-chip>
  </div>
</template>

<script>
export default {
  name: 'AssessmentTakesStatus',
  props: {
    assessment: {
      type: Object,
      required: true,
    },
    dense: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    color() {
      if (!this.assessment) {
        return null
      }

      return {
        AVAILABLE: 'success',
        FINISHED: 'error',
        PENDING: 'warning',
      }[this.assessment.takesStatus.status]
    },
    status() {
      if (!this.assessment) {
        return null
      }

      const takesStatus = this.assessment.takesStatus
      const suffix = this.assessment.isIncremental ? '_inc' : ''
      const key = {
        AVAILABLE: {
          AVAILABLE: `all_available${suffix}`,
          FINISHED: 'instance_available_evaluation_finished',
          PENDING: 'instance_available_evaluation_pending',
        },
        FINISHED: {
          AVAILABLE: 'instance_finished_evaluation_available',
          FINISHED: `all_finished${suffix}`,
          PENDING: 'instance_finished_evaluation_pending',
        },
        PENDING: {
          AVAILABLE: 'instance_pending_evaluation_available',
          PENDING: `all_pending${suffix}`,
        },
      }[takesStatus.instances][takesStatus.evaluations]

      return this.$t(`assessment.takes_status.${key}`)
    },
  },
}
</script>

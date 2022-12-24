<template>
  <v-chip :color="color" small>
    {{ text }}
  </v-chip>
</template>

<script>
export default {
  name: 'EvaluationStatusChip',
  props: {
    evaluation: {
      type: Object,
      required: true,
    },
  },
  computed: {
    color() {
      switch (this.evaluation.status) {
        case 'ACCEPTED':
          return 'success'
        case 'REJECTED':
          return 'error'
      }

      return 'primary'
    },
    text() {
      const status = this.evaluation.status.toLowerCase()
      return this.$t(`evaluation.status.${status}`)
    },
  },
}
</script>

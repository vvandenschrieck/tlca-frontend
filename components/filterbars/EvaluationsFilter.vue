<template>
  <div>
    <v-row>
      <v-col cols="3">{{ $t('evaluation.assessment') }}</v-col>
      <v-col cols="9">
        <assessment-select-field
          :course-code="courseCode"
          :value="value.assessment"
          @input="update('assessment', $event)"
        />
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="3">{{ $t('evaluation.learner') }}</v-col>
      <v-col cols="9">
        <learner-select
          :course-code="courseCode"
          :value="value.learner"
          @input="update('learner', $event)"
        />
      </v-col>
    </v-row>
  </div>
</template>

<script>
export default {
  name: 'EvaluationsFilter',
  props: {
    courseCode: {
      type: String,
      required: true,
    },
    value: {
      type: Object,
      default: () => {
        return {
          assessment: null,
          learner: null,
        }
      },
    },
  },
  methods: {
    update(field, value) {
      this.$emit('input', { ...this.value, [field]: value })
    },
  },
}
</script>

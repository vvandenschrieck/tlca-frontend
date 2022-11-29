<template>
  <ApolloQuery
    v-slot="{ isLoading, result: { error } }"
    :query="require('~/gql/components/getAssessmentPhases.gql')"
    :update="(data) => data.assessment"
    :variables="{ assessmentId }"
    @result="setResult"
  >
    <div v-if="!error">
      <v-select
        v-if="phases?.length"
        v-model="phase"
        clearable
        dense
        :disabled="!!isLoading || disabled"
        :items="phases"
        item-text="fullName"
        item-value="i"
        :label="$tc('assessment.phase._', 1)"
        :loading="!!isLoading"
        @change="$emit('change', $event)"
      />
    </div>

    <div v-else>{{ $t('error.unexpected') }}</div>
  </ApolloQuery>
</template>

<script>
export default {
  name: 'AssessmentPhaseSelect',
  props: {
    assessmentId: {
      type: String,
      required: true,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    value: {
      type: Number,
      default: null,
    },
  },
  data() {
    return {
      phases: null,
    }
  },
  computed: {
    phase: {
      get() {
        return this.value
      },
      set(value) {
        this.$emit('input', value)
      },
    },
  },
  watch: {
    assessmentId(oldValue, newValue) {
      if (oldValue !== newValue) {
        this.phases = null
      }
    },
  },
  methods: {
    setResult({ data: assessment }) {
      if (assessment?.type !== 'PHASED') {
        return
      }

      // Compute the full name for each phase.
      this.phases = assessment.phases.map((phase, i) => ({
        ...phase,
        i,
        fullName:
          this.$t('assessment.phase.phase_nb', { nb: i + 1 }) +
          ' – ' +
          phase.name,
      }))
    },
  },
}
</script>

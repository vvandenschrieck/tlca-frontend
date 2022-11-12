<template>
  <ApolloQuery
    v-slot="{ isLoading, result: { error } }"
    :query="require('~/gql/infopanels/getProgress.gql')"
    :update="(data) => data.registration"
    :variables="{ courseCode, learner }"
    @result="setResult"
  >
    <generic-info-panel
      :title="$t('registration.progress')"
      icon="mdi-progress-check"
      :loading="!!isLoading"
    >
      <div v-if="!error" class="d-flex justify-space-around mt-4 ml-3 mr-3">
        <competencies-progress
          :label="$t('competency.category.basic')"
          :value="registration?.progress.basic ?? 0"
        />
        <competencies-progress
          :label="$t('competency.category.advanced')"
          :value="registration?.progress.advanced ?? 0"
        />
      </div>

      <v-card-text v-else>{{ $t('error.unexpected') }}</v-card-text>
    </generic-info-panel>
  </ApolloQuery>
</template>

<script>
export default {
  name: 'ProgressPanel',
  props: {
    courseCode: {
      type: String,
      required: true,
    },
    learner: {
      type: String,
      default: null,
    },
  },
  data() {
    return {
      registration: null,
    }
  },
  methods: {
    setResult({ data: registration }) {
      this.registration = registration
    },
  },
}
</script>

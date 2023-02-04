<template>
  <ApolloQuery
    v-slot="{ isLoading, result: { error } }"
    :query="require('~/gql/components/getAssessmentEvaluations.gql')"
    :variables="{ assessmentId }"
    @result="setResult"
  >
    <v-progress-linear v-if="isLoading" indeterminate />

    <v-expansion-panels
      v-if="!error"
      accordion
      focusable
      multiple
      tile
      :value="instances?.length === 1 ? [0] : undefined"
    >
      <v-expansion-panel v-for="(instance, i) in instances" :key="i">
        <v-expansion-panel-header class="pl-3">
          <h4>{{ instance.name }}</h4>
          <small class="text-right mr-3">{{ instance.datetime }}</small>
        </v-expansion-panel-header>

        <v-expansion-panel-content class="mt-3">
          <v-list class="pa-0">
            <template v-for="(evaluation, j) in instance.evaluations">
              <v-list-item :key="2 * j" class="pa-0" dense>
                <v-list-item-content>
                  <v-list-item-title>
                    {{ evaluation.name }}

                    <evaluation-status-chip
                      v-if="evaluation.status !== 'PUBLISHED'"
                      class="ml-3"
                      :evaluation="evaluation"
                    />
                  </v-list-item-title>
                </v-list-item-content>

                <v-list-item-action>
                  {{ evaluation.date }}
                </v-list-item-action>

                <v-list-item-icon>
                  <detail-link-btn :to="evaluationLink(evaluation)" />
                </v-list-item-icon>
              </v-list-item>

              <v-divider
                v-if="j < instance.evaluations.length - 1"
                :key="j * 2 + 1"
              />
            </template>
          </v-list>
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-expansion-panels>

    <div v-else>{{ $t('error.unexpected') }}</div>
  </ApolloQuery>
</template>

<script>
import datetime from '@/mixins/datetime.js'

export default {
  name: 'AssessmentEvaluationsList',
  mixins: [datetime],
  props: {
    assessmentId: {
      type: String,
      required: true,
    },
    courseCode: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      instances: null,
    }
  },
  methods: {
    evaluationLink(evaluation) {
      return {
        name: 'learn-courses-code-evaluations-id',
        params: {
          code: this.courseCode,
          id: evaluation.id,
        },
      }
    },
    setResult({ data }) {
      if (!data) {
        return
      }

      this.instances = data.instances
        ?.sort((a, b) => (a.datetime > b.datetime ? 1 : -1))
        .map((instance, i) => ({
          ...instance,
          datetime: this.formatDateFull(instance.datetime),
          evaluations: data.evaluations
            ?.filter((e) => e.instance.id === instance.id)
            .sort((a, b) => (a.date > b.date ? 1 : -1))
            .map((evaluation, j) => ({
              ...evaluation,
              date: this.formatDateTimeFull(evaluation.date),
              name: this.$t('evaluation.evaluation_nb', { nb: j + 1 }),
            })),
          name: instance.name ?? this.$t('instance.instance_nb', { nb: i + 1 }),
        }))
    },
  },
}
</script>

<template>
  <ApolloQuery
    v-slot="{ isLoading, result: { data, error } }"
    :query="require('~/gql/courses/getCourseCompetencies.gql')"
    :update="(data) => data.course.competencies"
    :variables="{ courseCode }"
  >
    <v-progress-linear v-if="!!isLoading" :indeterminate="true" />
    <v-list v-if="!error && data" class="pa-0">
      <template v-for="(c, i) in competencies(data)">
        <v-list-item :key="c.competency.code">
          <v-list-item-content>
            <v-list-item-title>
              {{ competencyName(c.competency) }}
            </v-list-item-title>

            <v-list-item-subtitle>
              <learning-outcomes-assessment-list
                v-if="c.useLearningOutcomes"
                class="mt-3 ml-3"
                :items="c.learningOutcomes"
              />

              <competency-check-list
                v-if="c.checklist?.public"
                class="mt-3 ml-3"
                :items="c.checklist.public"
                :name="$t('assessment.checklist.public')"
              />

              <competency-check-list
                v-if="c.checklist?.private"
                class="mt-3 ml-3"
                :items="c.checklist.private"
                :name="$t('assessment.checklist.private')"
              />
            </v-list-item-subtitle>
          </v-list-item-content>

          <v-list-item-action>
            <stars-field
              v-if="!c.useLearningOutcomes"
              :length="3"
              readonly
              :value="c.stars"
            />
            <v-chip v-else color="primary" small>
              {{ $t('competency.learning_outcomes.abbr') }}
            </v-chip>
          </v-list-item-action>
        </v-list-item>

        <v-divider v-if="i < items.length - 1" :key="i" />
      </template>
    </v-list>
    <span v-else>{{ $t('error.unexpected') }}</span>
  </ApolloQuery>
</template>

<script>
import competencies from '@/mixins/competencies.js'

export default {
  name: 'CompetenciesAssessmentList',
  mixins: [competencies],
  props: {
    courseCode: {
      type: String,
      required: true,
    },
    items: {
      type: Array,
      default: null,
    },
  },
  methods: {
    competencies(competencies) {
      return this.items.map((item) => {
        const courseCompetency = competencies.find(
          (c) => c.competency.code === item.competency.code
        )
        const learningOutcomes = courseCompetency?.competency.learningOutcomes

        return {
          ...item,
          useLearningOutcomes: courseCompetency?.useLearningOutcomes,
          learningOutcomes: item.learningOutcomes?.map(
            (lo) => learningOutcomes[lo]
          ),
        }
      })
    },
  },
}
</script>

<template>
  <ApolloQuery
    v-slot="{ isLoading, result: { error } }"
    :query="require('~/gql/components/getAssessmentCompetencies.gql')"
    :variables="{ assessmentId, courseCode }"
    @result="setCompetencies"
  >
    <v-progress-linear v-if="!!isLoading" :indeterminate="true" />

    <v-list v-if="!error" class="pa-0">
      <template v-for="(c, i) in competencies">
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
                :name="
                  $t(`assessment.checklist.${teacherView ? 'public' : '_'}`)
                "
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

        <v-divider v-if="i < competencies.length - 1" :key="i" />
      </template>
    </v-list>

    <div v-else>{{ $t('error.unexpected') }}</div>
  </ApolloQuery>
</template>

<script>
import competencies from '@/mixins/competencies.js'

export default {
  name: 'AssessmentCompetenciesList',
  mixins: [competencies],
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
      competencies: [],
    }
  },
  computed: {
    teacherView() {
      return this.$auth.user.hasAnyRoles('teacher')
    },
  },
  methods: {
    setCompetencies({ data }) {
      this.competencies =
        data?.assessment.competencies.map((item) => {
          const courseCompetency = data.course.competencies.find(
            (c) => c.competency.code === item.competency.code
          )
          const learningOutcomes = courseCompetency.competency.learningOutcomes

          return {
            ...item,
            useLearningOutcomes: courseCompetency?.useLearningOutcomes,
            learningOutcomes: item.learningOutcomes?.map(
              (lo) => learningOutcomes[lo]
            ),
          }
        }) ?? null
    },
  },
}
</script>

<!-- eslint-disable vue/no-v-html -->
<template>
  <ApolloQuery
    v-slot="{ isLoading, result: { error } }"
    :query="require('~/gql/components/getCourseCompetencies.gql')"
    :update="(data) => data.course.competencies"
    :variables="{ courseCode }"
    @result="setCompetencies"
  >
    <v-progress-linear v-if="!!isLoading" indeterminate />

    <div v-if="!error">
      <competencies-list v-slot="{ category }" :items="competencies">
        <v-expansion-panels accordion flat multiple tile>
          <v-expansion-panel
            v-for="c in category.values"
            :key="c.competency.code"
          >
            <v-expansion-panel-header class="px-0 name">
              {{ competencyName(c.competency) }}
            </v-expansion-panel-header>

            <v-expansion-panel-content>
              <v-card flat>
                <v-card-text class="font-italic ma-0 pa-0 text--primary">
                  <div
                    v-if="c.competency.description"
                    v-html="c.competency.description"
                  />

                  <template v-if="c.useLearningOutcomes">
                    <learning-outcomes-list
                      hide-divider
                      hide-takes
                      :items="c.competency.learningOutcomes"
                      :title="$t('competency.learning_outcomes._')"
                    />
                  </template>

                  <template
                    v-if="!c.competency.description && !c.useLearningOutcomes"
                  >
                    {{ $t('global.description.no') }}
                  </template>
                </v-card-text>
              </v-card>
            </v-expansion-panel-content>
          </v-expansion-panel>
        </v-expansion-panels>
      </competencies-list>
    </div>

    <v-card-text v-else>{{ $t('error.unexpected') }}</v-card-text>
  </ApolloQuery>
</template>

<script>
import competencies from '@/mixins/competencies.js'

export default {
  name: 'CourseCompetenciesList',
  mixins: [competencies],
  props: {
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
  methods: {
    setCompetencies({ data: competencies }) {
      this.competencies = competencies
    },
  },
}
</script>

<style scoped>
.name {
  font-size: 0.875rem;
}
</style>

<template>
  <ApolloQuery
    v-if="$auth.user"
    v-slot="{ isLoading, result: { data, error } }"
    :query="require('~/gql/components/getCourseCompetenciesProgress.gql')"
    :variables="{ courseCode }"
    @result="setCompetencies"
  >
    <v-progress-linear v-if="!!isLoading" indeterminate />

    <div v-if="!error">
      <competencies-list
        v-if="data?.course?.isRegistered"
        v-slot="{ category }"
        :items="competencies"
      >
        <v-list class="pa-0">
          <template v-for="(c, i) in category.values">
            <v-list-item :key="c.competency.code">
              <v-list-item-content>
                <v-list-item-title>
                  {{ competencyName(c.competency) }}
                </v-list-item-title>
              </v-list-item-content>

              <v-list-item-action>
                <v-progress-linear
                  v-if="c.useLearningOutcomes"
                  class="loProgress"
                  height="15"
                  :value="c.progress.value"
                />
                <stars-field v-else readonly :value="c.progress.value" />
              </v-list-item-action>
            </v-list-item>

            <v-divider v-if="i < category.values.length - 1" :key="i" />
          </template>
        </v-list>
      </competencies-list>
    </div>

    <v-card-text v-else>{{ $t('error.unexpected') }}</v-card-text>
  </ApolloQuery>
</template>

<script>
import competencies from '@/mixins/competencies.js'

export default {
  name: 'CourseCompetenciesProgressList',
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
    setCompetencies({ data }) {
      const items = data?.course?.competencies
      const progress = data?.registration?.progress

      if (items && progress) {
        for (const competency of items) {
          const competencyProgress = progress.competencies.find(
            (c) => c.competency.code === competency.competency.code
          )
          competency.progress = {
            value: competencyProgress.progress,
            learningOutcomes: competencyProgress.learningOutcomes ?? undefined,
          }
        }
      }

      this.competencies = items
    },
  },
}
</script>

<style scoped>
.loProgress {
  width: 132px;
}
</style>

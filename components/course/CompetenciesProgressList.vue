<template>
  <ApolloQuery
    v-if="$auth.user"
    v-slot="{ isLoading, result: { error } }"
    :query="require('~/gql/components/getCourseProgress.gql')"
    :variables="{ courseCode, learner }"
    @result="setResult"
  >
    <v-progress-linear v-if="!!isLoading" indeterminate />

    <div v-if="!error">
      <competencies-list
        v-if="canShowContent"
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

                <learning-outcomes-list
                  v-if="c.useLearningOutcomes"
                  class="mt-3"
                  hide-divider
                  :items="c.competency.learningOutcomes"
                  :takes="c.progress.learningOutcomes"
                />
              </v-list-item-content>

              <v-list-item-action class="align-self-baseline">
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
    learner: {
      type: String,
      default: null,
    },
  },
  data() {
    return {
      competencies: [],
      course: null,
    }
  },
  computed: {
    canShowContent() {
      if (!this.course) {
        return false
      }
      return (
        this.course.isRegistered ||
        (this.learner && (this.course.isCoordinator || this.course.isTeacher))
      )
    },
  },
  methods: {
    setResult({ data }) {
      if (!data) {
        return
      }

      const items = data.course?.competencies
      const progress = data.registration?.progress

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
      this.course = data.course
    },
  },
}
</script>

<style scoped>
.loProgress {
  width: 132px;
}
</style>

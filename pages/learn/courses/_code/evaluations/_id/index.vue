<!-- eslint-disable vue/no-v-html -->
<template>
  <ApolloQuery
    v-slot="{ isLoading, result: { data, error } }"
    :query="require('~/gql/learn/getCourseEvaluation.gql')"
    :variables="{ courseCode, evaluationId }"
    @result="setTitle"
  >
    <page-title :loading="!!isLoading" :value="title" />

    <v-row v-if="!error && data?.course?.isRegistered">
      <v-col cols="12" md="9">
        <v-card>
          <v-tabs v-model="currentTab" show-arrows>
            <v-tab>{{ $tc('evaluation._', 1) }}</v-tab>
            <v-tab>{{ $t('general.history') }}</v-tab>
          </v-tabs>

          <v-card-text class="text--primary">
            <v-tabs-items v-model="currentTab">
              <v-tab-item>
                <h4>{{ $t('evaluation.comment._') }}</h4>

                <div
                  v-if="data?.evaluation?.comment"
                  v-html="data?.evaluation.comment"
                />
                <div v-else>{{ $t('evaluation.comment.no') }}</div>

                <h4>{{ $tc('competency._', 2) }}</h4>

                <evaluation-assessment-competencies-form
                  :assessment-id="data?.evaluation?.assessment.id"
                  :course-code="courseCode"
                  readonly
                  :teacher-view="false"
                  :value="selectedCompetencies(data?.evaluation?.competencies)"
                />
              </v-tab-item>

              <v-tab-item>
                <v-alert type="info" dense outlined>Upcoming feature</v-alert>
              </v-tab-item>
            </v-tabs-items>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col
        cols="12"
        md="3"
        :order="$vuetify.breakpoint.smAndDown ? 'first' : undefined"
      >
        <evaluation-info-panel :evaluation-id="evaluationId" />
      </v-col>
    </v-row>

    <div v-else>{{ $t('error.unexpected') }}</div>
  </ApolloQuery>
</template>

<script>
import titles from '@/mixins/titles.js'

export default {
  name: 'LearnCourseEvaluationPage',
  mixins: [titles],
  data() {
    return {
      currentTab: 0,
      title: '',
    }
  },
  head() {
    return {
      title: this.getTitle(this.title, 'evaluation._', 'learn'),
    }
  },
  computed: {
    courseCode() {
      return this.$route.params.code
    },
    evaluationId() {
      return this.$route.params.id
    },
  },
  methods: {
    selectedCompetencies(competencies) {
      return competencies?.map((c) => ({
        ...c,
        learningOutcomes: c.learningOutcomes.map((lo) => ({
          selected: lo,
        })),
      }))
    },
    setTitle({ data }) {
      this.title = data?.evaluation?.assessment.name ?? ''
    },
  },
  meta: {
    roles: ['student'],
  },
}
</script>

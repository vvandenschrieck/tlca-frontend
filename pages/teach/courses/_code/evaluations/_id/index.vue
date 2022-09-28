<!-- eslint-disable vue/no-v-html -->
<template>
  <ApolloQuery
    v-slot="{ isLoading, result: { data, error } }"
    :query="require('~/gql/teach/getEvaluation.gql')"
    :variables="{ courseCode, evaluationId }"
    @result="setTitle"
  >
    <page-title :loading="!!isLoading" :value="title" />

    <div
      v-if="!error && (data?.course?.isCoordinator || data?.course?.isTeacher)"
    >
      <v-row>
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
                    :value="
                      selectedCompetencies(data?.evaluation?.competencies)
                    "
                  />

                  <h4>{{ $t('evaluation.note._') }}</h4>

                  <div
                    v-if="data?.evaluation?.note"
                    v-html="data?.evaluation.note"
                  />
                  <div v-else>{{ $t('evaluation.note.no') }}</div>
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
          <evaluation-status-info-panel :evaluation="data?.evaluation" />
        </v-col>
      </v-row>

      <actions-menu
        :delete-action="{
          query: {
            mutation: require('~/gql/teach/deleteEvaluation.gql'),
            variables: { id: evaluationId },
          },
          link: {
            name: 'teach-courses-code-evaluations',
            params: { code: courseCode },
          },
          object: 'evaluation',
        }"
      />
    </div>

    <div v-else>{{ $t('error.unexpected') }}</div>
  </ApolloQuery>
</template>

<script>
export default {
  name: 'TeachEvaluationPage',
  data() {
    return {
      currentTab: 0,
      title: '',
    }
  },
  computed: {
    evaluationId() {
      return this.$route.params.id
    },
    courseCode() {
      return this.$route.params.code
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
    roles: ['teacher'],
  },
}
</script>

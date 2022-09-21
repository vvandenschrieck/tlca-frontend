<!-- eslint-disable vue/no-v-html -->
<template>
  <ApolloQuery
    :query="require('~/gql/teach/getEvaluation.gql')"
    :variables="{
      courseCode,
      evaluationId,
    }"
  >
    <template #default="{ result: { error, data }, isLoading }">
      <div v-if="isLoading">{{ $t('global.loading') }}</div>

      <div v-else-if="data && data.course.code === data.evaluation.course.code">
        <h2>{{ data.evaluation.assessment.name }}</h2>

        <v-row>
          <v-col cols="12" md="9">
            <v-card>
              {{ data.evaluation }}
              <!-- <v-tabs v-model="currentTab" show-arrows>
                <v-tab>{{ $t('competency.description') }}</v-tab>
              </v-tabs>

              <v-card-text class="text--primary">
                <v-tabs-items v-model="currentTab">
                  <v-tab-item>
                    <div
                      v-if="competency.description"
                      v-html="competency.description"
                    />
                    <div v-else>{{ $t('global.description.no') }}</div>
                  </v-tab-item>
                </v-tabs-items>
              </v-card-text> -->
            </v-card>
          </v-col>

          <v-col
            cols="12"
            md="3"
            :order="$vuetify.breakpoint.smAndDown ? 'first' : undefined"
          >
            <evaluation-status-info-panel :evaluation="data.evaluation" />
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

      <div v-else-if="error">{{ $t('error.unexpected') }}</div>
    </template>
  </ApolloQuery>
</template>

<script>
export default {
  name: 'TeachEvaluationPage',
  computed: {
    evaluationId() {
      return this.$route.params.id
    },
    courseCode() {
      return this.$route.params.code
    },
  },
  meta: {
    roles: ['teacher'],
  },
}
</script>

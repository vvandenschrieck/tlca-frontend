<!-- eslint-disable vue/no-v-html -->
<template>
  <ApolloQuery
    :query="require('~/gql/manage/getCourseAssessment.gql')"
    :variables="{
      courseCode: $route.params.code,
      assessmentId: $route.params.id,
    }"
  >
    <template #default="{ result: { error, data }, isLoading }">
      <div v-if="isLoading" v-t="'global.loading'"></div>

      <div v-else-if="data.course && data.assessment">
        <h2 v-text="data.assessment.name"></h2>

        <v-row>
          <v-col cols="12" md="9">
            <v-card>
              <v-tabs v-model="currentTab" show-arrows>
                <v-tab>
                  {{ $t('assessment.description') }}
                </v-tab>
                <v-tab>
                  {{ $t('assessment.competencies') }}
                </v-tab>
              </v-tabs>

              <v-card-text class="text--primary">
                <v-tabs-items v-model="currentTab">
                  <v-tab-item>
                    <div v-if="data.assessment.description">
                      <div v-html="data.assessment.description"></div>
                    </div>
                    <div v-else v-t="'global.description.no'"></div>
                  </v-tab-item>
                  <v-tab-item>
                    <div>
                      <div></div>
                    </div>
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
            <assessment-info-panel :assessment="data.assessment" class="mb-5" />
          </v-col>
        </v-row>
      </div>

      <div v-else-if="error">An error occurred</div>
    </template>
  </ApolloQuery>
</template>

<script>
export default {
  name: 'ManageCourseAssessmentPage',
  meta: {
    roles: ['teacher'],
  },
  data() {
    return {
      currentTab: '0',
    }
  },
}
</script>

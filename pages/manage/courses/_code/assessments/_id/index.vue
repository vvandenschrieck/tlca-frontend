<!-- eslint-disable vue/no-v-html -->
<template>
  <ApolloQuery
    v-slot="{ result: { error, data }, isLoading }"
    :query="require('~/gql/manage/getCourseAssessment.gql')"
    :variables="{
      courseCode,
      assessmentId: $route.params.id,
    }"
  >
    <div v-if="!!isLoading">{{ $t('global.loading') }}</div>

    <div v-else-if="data.course && data.assessment">
      <h2>{{ data.assessment.name }}</h2>

      <v-row>
        <v-col cols="12" md="9">
          <v-card>
            <v-tabs v-model="currentTab" show-arrows>
              <v-tab>
                {{ $t('assessment.description') }}
              </v-tab>
              <v-tab>
                {{ $t('assessment.competencies._') }}
              </v-tab>
              <v-tab v-if="data.assessment.provider">Provider</v-tab>
            </v-tabs>

            <v-card-text class="text--primary">
              <v-tabs-items v-model="currentTab">
                <v-tab-item>
                  <div v-html="data.assessment.description" />
                </v-tab-item>

                <v-tab-item>
                  <competencies-assessment-list
                    :course-code="courseCode"
                    :items="data.assessment.competencies"
                  />
                </v-tab-item>

                <v-tab-item v-if="data.assessment.provider">
                  {{ data.assessment.providerConfig }}
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
          <assessment-info-panel :assessment-id="assessmentId" />
        </v-col>
      </v-row>

      <actions-menu
        :delete-action="{
          query: {
            mutation: require('~/gql/manage/deleteAssessment.gql'),
            variables: { id: data.assessment.id },
          },
          link: {
            name: 'manage-courses-code-assessments',
            params: { code: courseCode },
          },
          object: 'assessment',
        }"
        :edit-link="{
          name: 'manage-courses-code-assessments-id-edit',
          params: { code: courseCode, id: data.assessment.id },
        }"
      />
    </div>

    <div v-else-if="error">{{ $t('error.unexpected') }}</div>
  </ApolloQuery>
</template>

<script>
export default {
  name: 'ManageCourseAssessmentPage',
  data() {
    return {
      currentTab: 0,
    }
  },
  computed: {
    assessmentId() {
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

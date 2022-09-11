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

          <assessment-delete-btn
            :assessment="data.assessment"
            @success="deleteSuccess"
            @error="deleteError"
          />

          <v-btn
            class="mt-5"
            color="success"
            small
            :to="{
              name: 'manage-courses-code-assessments-id-edit',
              params: { code: data.course.code, id: data.assessment.id },
            }"
          >
            <v-icon left>mdi-pencil</v-icon>
            <span>{{ $t('general.edit') }}</span>
          </v-btn>
        </v-col>
      </v-row>
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
    courseCode() {
      return this.$route.params.code
    },
  },
  methods: {
    deleteError() {
      this.$notificationManager.displayErrorMessage(
        this.$t('error.ASSESSMENT_DELETE')
      )
    },
    deleteSuccess() {
      this.$router.push({
        name: 'manage-courses-code-assessments',
        params: { code: this.$route.params.code },
      })
      this.$notificationManager.displaySuccessMessage(
        this.$t('success.ASSESSMENT_DELETE')
      )
    },
  },
  meta: {
    roles: ['teacher'],
  },
}
</script>

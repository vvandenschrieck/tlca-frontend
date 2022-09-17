<!-- eslint-disable vue/no-v-html -->
<template>
  <ApolloQuery
    v-slot="{ isLoading, result: { data, error } }"
    :query="require('~/gql/learn/getCourseAssessment.gql')"
    :variables="{ courseCode, assessmentId }"
    @result="setTitle"
  >
    <page-title :loading="!!isLoading" :value="title" />

    <v-row v-if="!error">
      <v-col cols="12" md="9">
        <v-progress-linear v-if="!!isLoading" :indeterminate="true" />

        <v-card>
          <v-tabs v-model="currentTab" show-arrows>
            <v-tab>{{ $t('assessment.description') }}</v-tab>
            <v-tab>{{ $t('assessment.competencies._') }}</v-tab>
          </v-tabs>

          <v-card-text class="text--primary">
            <v-tabs-items v-model="currentTab">
              <v-tab-item>
                <div v-html="data?.assessment.description" />
              </v-tab-item>

              <v-tab-item>
                <assessment-competencies-list
                  :assessment-id="assessmentId"
                  :course-code="courseCode"
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
        <assessment-info-panel :assessment-id="assessmentId" />
        <assessment-schedule-panel :assessment-id="assessmentId" class="mt-5" />

        <v-btn
          v-if="data?.assessment.provider"
          class="mt-5"
          color="success"
          :loading="createEvaluation"
          small
          @click="take(data?.assessment.id)"
        >
          Take
        </v-btn>
      </v-col>
    </v-row>

    <div v-else>{{ $t('error.unexpected') }}</div>
  </ApolloQuery>
</template>

<script>
import titles from '@/mixins/titles.js'

export default {
  name: 'LearnCourseAssessmentPage',
  mixins: [titles],
  data() {
    return {
      createEvaluation: false,
      currentTab: 0,
      title: '',
    }
  },
  head() {
    return {
      title: this.getTitle(this.title, null, 'learn'),
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
  methods: {
    setTitle({ data }) {
      this.title = data?.assessment?.name ?? ''
    },
    async take(id) {
      this.createEvaluation = true
      try {
        const mutation = require(`~/gql/learn/createAssessmentInstance.gql`)
        const response = await this.$apollo
          .mutate({
            mutation,
            variables: { id },
          })
          .then(({ data }) => data && data.createAssessmentInstance)

        if (response) {
          this.$notificationManager.displaySuccessMessage('SUCCESS')
          this.$router.push({
            name: 'learn-courses-code-assessments-id-take-uid',
            params: {
              code: this.courseCode,
              id: this.$route.params.id,
              uid: response.id,
            },
          })
        }
      } catch (err) {
        this.$notificationManager.displayErrorMessage('ERROR')
      }

      this.createEvaluation = false
    },
  },
  meta: {
    roles: ['student'],
  },
}
</script>

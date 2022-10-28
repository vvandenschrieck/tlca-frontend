<template>
  <ApolloQuery
    v-slot="{ isLoading, result: { error } }"
    :query="require('~/gql/learn/getAssessment.gql')"
    :variables="{ courseCode, assessmentId }"
    @result="setResult"
  >
    <page-title :loading="!!isLoading" :value="title" />

    <v-row v-if="!error && canShowContent">
      <v-col cols="12" md="9">
        <v-card :loading="!!isLoading">
          <v-tabs v-model="currentTab" show-arrows>
            <v-tab>{{ $t('assessment.description') }}</v-tab>
            <v-tab>{{ $t('assessment.competencies._') }}</v-tab>
          </v-tabs>

          <v-card-text class="text--primary">
            <v-tabs-items v-model="currentTab">
              <v-tab-item>
                <description-content
                  entity="assessment.description"
                  :text="assessment?.description"
                />
              </v-tab-item>

              <v-tab-item>
                <assessment-competencies-list
                  :assessment-id="assessmentId"
                  :course-code="courseCode"
                  student-view
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

        <actions-menu
          :custom-actions="customActions"
          @customActionClicked="onCustomActionClicked"
        />
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
      assessment: null,
      course: null,
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
    canShowContent() {
      return !this.course || this.course.isRegistered
    },
    assessmentId() {
      return this.$route.params.id
    },
    courseCode() {
      return this.$route.params.code
    },
    customActions() {
      if (!this.assessment || !this.assessment.provider) {
        return null
      }

      return [
        {
          icon: 'mdi-clipboard-edit',
          key: 'take',
          tooltip: this.$t('assessment.take._'),
        },
      ]
    },
  },
  methods: {
    async onCustomActionClicked(key) {
      switch (key) {
        case 'take':
          return await this.take(this.assessmentId)
      }
    },
    setResult({ data }) {
      if (!data) {
        return
      }

      this.assessment = data.assessment
      this.course = data.course
      this.title = data.assessment?.name ?? ''
    },
    async take(id) {
      if (this.createEvaluation) {
        return
      }

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
          this.$router.push({
            name: 'learn-courses-code-assessments-id-take-iid',
            params: {
              code: this.courseCode,
              id: this.$route.params.id,
              iid: response.id,
            },
          })
        }
      } catch (err) {}

      this.createEvaluation = false
    },
  },
  meta: {
    roles: ['student'],
  },
}
</script>

<template>
  <ApolloQuery
    v-slot="{ isLoading, result: { error } }"
    :query="require('~/gql/teach/getAssessment.gql')"
    :variables="{ courseCode, assessmentId }"
    @result="setResult"
  >
    <page-title :loading="!!isLoading" :spaces="spaces" :value="title" />

    <v-row v-if="!error && canShowContent">
      <v-col cols="12" md="9">
        <v-card :loading="!!isLoading">
          <v-tabs v-model="currentTab" show-arrows>
            <v-tab href="#description">
              {{ $t('assessment.description') }}
            </v-tab>
            <v-tab v-if="assessment?.phases" href="#phases">
              {{ $tc('assessment.phase._', 2) }}
            </v-tab>
            <v-tab href="#competencies">
              {{ $t('assessment.competencies._') }}
            </v-tab>
            <v-tab href="#evaluations">
              {{ $tc('evaluation._', 2) }}
            </v-tab>
          </v-tabs>

          <v-card-text class="text--primary">
            <v-tabs-items v-model="currentTab">
              <v-tab-item value="description">
                <description-content :text="assessment?.description" />
              </v-tab-item>

              <v-tab-item value="phases">
                <assessment-phases v-slot="{ phase }" :assessment="assessment">
                  <description-content :text="phase.description" />
                </assessment-phases>
              </v-tab-item>

              <v-tab-item value="competencies">
                <assessment-competencies-list
                  :assessment-id="assessmentId"
                  :course-code="courseCode"
                />
              </v-tab-item>

              <v-tab-item value="evaluations">
                <evaluations-list
                  :assessment-id="assessmentId"
                  :course-code="courseCode"
                  hide-filter-bar
                  hide-footer
                  published
                  space="teach"
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
        <assessment-info-panel :assessment-id="assessmentId" teacher-view />
        <assessment-schedule-panel :assessment-id="assessmentId" class="mt-5" />
      </v-col>

      <actions-menu
        :custom-actions="customActions"
        @customActionClicked="onCustomActionClicked"
      />
    </v-row>

    <div v-else>{{ $t('error.unexpected') }}</div>
  </ApolloQuery>
</template>

<script>
import titles from '@/mixins/titles.js'
import utils from '@/mixins/utils.js'

import exportAssessment from '@/gql/teach/exportAssessment.gql'

export default {
  name: 'TeachAssessmentPage',
  mixins: [titles, utils],
  data() {
    return {
      assessment: null,
      course: null,
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
    canShowContent() {
      return !this.course || this.course.isCoordinator || this.course.isTeacher
    },
    courseCode() {
      return this.$route.params.code
    },
    customActions() {
      return [
        {
          icon: 'mdi-file-export',
          key: 'export',
          tooltip: this.$t('general.export'),
        },
      ]
    },
    spaces() {
      if (!this.course) {
        return null
      }

      const items = {}

      if (this.course.isCoordinator) {
        items.manage = {
          name: 'manage-courses-code-assessments-id',
          params: { code: this.courseCode, id: this.assessmentId },
        }
      }

      return items
    },
  },
  methods: {
    async onCustomActionClicked(key) {
      if (key === 'export') {
        const result = await this.$apollo
          .query({
            query: exportAssessment,
            variables: { id: this.assessmentId },
          })
          .then(({ data }) => data.exportAssessment)

        this.downloadFile(result)
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
  },
  meta: {
    roles: ['teacher'],
  },
}
</script>

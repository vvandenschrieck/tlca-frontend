<template>
  <ApolloQuery
    v-slot="{ isLoading, result: { error } }"
    :query="require('~/gql/teach/getCourse.gql')"
    :variables="{ code: courseCode }"
    @result="setResult"
  >
    <page-title :loading="!!isLoading" :value="title" />

    <v-row v-if="!error && canShowContent">
      <v-col cols="12" md="9">
        <v-card>
          <v-tabs v-model="currentTab" show-arrows>
            <v-tab>{{ $tc('competency._', 2) }}</v-tab>
            <v-tab>{{ $t('general.progress') }}</v-tab>
          </v-tabs>

          <v-card-text class="text--primary">
            <v-tabs-items v-model="currentTab">
              <v-tab-item>
                <course-competencies-progress-list
                  :course-code="courseCode"
                  :learner="learnerUsername"
                />
              </v-tab-item>

              <v-tab-item>
                <v-alert type="info" dense outlined>Upcoming feature</v-alert>
              </v-tab-item>
            </v-tabs-items>
          </v-card-text>
        </v-card>

        <!-- <v-row>
          <v-col cols="12" md="6">
            <progress-info-card
              :course-code="courseCode"
              teacher-view
              :learner-username="learnerUsername"
            />
          </v-col>

          <v-col cols="12" md="6"> </v-col>
        </v-row> -->
      </v-col>

      <v-col
        cols="12"
        md="3"
        :order="$vuetify.breakpoint.smAndDown ? 'first' : undefined"
      >
        <learner-info-panel
          :course-code="courseCode"
          :learner="learnerUsername"
        />
      </v-col>
    </v-row>

    <div v-else>{{ $t('error.unexpected') }}</div>
  </ApolloQuery>
</template>

<script>
import titles from '@/mixins/titles.js'

export default {
  name: 'TeachLearnerPage',
  mixins: [titles],
  data() {
    return {
      course: null,
      currentTab: 0,
      title: '',
    }
  },
  head() {
    return {
      title: this.getTitle(this.title, null, 'teach'),
    }
  },
  computed: {
    canShowContent() {
      return !this.course || this.course.isCoordinator || this.course.isTeacher
    },
    courseCode() {
      return this.$route.params.code
    },
    learnerUsername() {
      return this.$route.params.username
    },
  },
  methods: {
    setResult({ data }) {
      if (!data) {
        return
      }

      this.course = data.course
      this.title = data.course?.name ?? ''
    },
  },
  meta: {
    roles: ['teacher'],
  },
}
</script>

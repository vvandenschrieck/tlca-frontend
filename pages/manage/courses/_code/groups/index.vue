<template>
  <ApolloQuery
    v-slot="{ isLoading, result: { error } }"
    :query="require('~/gql/manage/getCourse.gql')"
    :update="(data) => data.course"
    :variables="{ code: courseCode }"
    @result="setResult"
  >
    <page-title :loading="!!isLoading" :value="title" />

    <v-row v-if="!error && canShowContent">
      <v-col cols="12" md="9">
        <v-card>
          <v-tabs v-model="currentTab" show-arrows>
            <v-tab>{{ $t('course.groups.teaching._') }}</v-tab>
            <v-tab>{{ $t('course.groups.working._') }}</v-tab>
          </v-tabs>

          <v-card-text class="text--primary">
            <v-tabs-items v-model="currentTab">
              <v-tab-item>
                <!-- <teaching-groups-list :course="course" /> -->
              </v-tab-item>

              <v-tab-item>
                <groups-working-list :course-code="courseCode" />
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
        <course-status-info-panel :course-code="courseCode" />
        <course-schedule-panel class="mt-5" :course-code="courseCode" />
      </v-col>
    </v-row>

    <div v-else>{{ $t('error.unexpected') }}</div>
  </ApolloQuery>
</template>

<script>
import titles from '@/mixins/titles.js'

export default {
  name: 'ManageGroupsPage',
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
      title: this.getTitle(this.title, 'course.groups._', 'manage'),
    }
  },
  computed: {
    canShowContent() {
      return !this.course || this.course.isCoordinator
    },
    courseCode() {
      return this.$route.params.code
    },
  },
  methods: {
    setResult({ data: course }) {
      this.course = course
      this.title = course?.name ?? ''
    },
  },
  meta: {
    roles: ['teacher'],
  },
}
</script>

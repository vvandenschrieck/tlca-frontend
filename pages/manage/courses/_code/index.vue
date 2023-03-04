<template>
  <ApolloQuery
    v-slot="{ isLoading, result: { error } }"
    :query="require('~/gql/manage/getCourse.gql')"
    :variables="{ code: courseCode }"
    @result="setResult"
  >
    <page-title :loading="!!isLoading" :spaces="spaces" :value="title" />

    <div v-if="!!isLoading">{{ $t('global.loading') }}</div>

    <v-row v-if="!error && canShowContent">
      <v-col cols="12" md="9">
        <v-row>
          <v-col cols="12" md="6">
            <registrations-info-card :course-code="courseCode" />
            <groups-info-card
              v-if="course?.hasGroups"
              class="mt-5"
              :course-code="courseCode"
            />
          </v-col>

          <v-col cols="12" md="6">
            <assessments-info-card
              :course-code="courseCode"
              hide-takes-status
              space="manage"
              :teacher-view="true"
            />
          </v-col>
        </v-row>
      </v-col>

      <v-col
        cols="12"
        md="3"
        :order="$vuetify.breakpoint.smAndDown ? 'first' : undefined"
      >
        <course-status-info-panel :course-code="courseCode" />
        <course-schedule-panel class="mt-5" :course-code="courseCode" />
      </v-col>

      <actions-menu
        :custom-actions="customActions"
        :edit-link="editLink"
        @customActionClicked="onCustomActionClicked"
      />
    </v-row>

    <div v-else>{{ $t('error.unexpected') }}</div>
  </ApolloQuery>
</template>

<script>
import titles from '@/mixins/titles.js'

export default {
  name: 'ManageCoursePage',
  mixins: [titles],
  data() {
    return {
      course: null,
      executing: false,
      title: '',
    }
  },
  head() {
    return {
      title: this.getTitle(this.title, null, 'manage'),
    }
  },
  computed: {
    canShowContent() {
      return !this.course || this.course.isCoordinator
    },
    courseCode() {
      return this.$route.params.code
    },
    customActions() {
      if (!this.course || this.course.isPublished) {
        return null
      }

      return [
        {
          icon: 'mdi-cloud-upload',
          key: 'publish',
          tooltip: this.$t('course.publish'),
        },
      ]
    },
    editLink() {
      return {
        name: 'manage-courses-code-edit',
        params: { code: this.courseCode },
      }
    },
    spaces() {
      if (!this.course) {
        return null
      }

      const items = {
        home: {
          name: 'courses-code',
          params: { code: this.courseCode },
        },
      }

      if (this.course.isPublished || this.course.isArchived) {
        items.teach = {
          name: 'teach-courses-code',
          params: { code: this.courseCode },
        }
      }

      return items
    },
  },
  methods: {
    onCustomActionClicked(key) {
      switch (key) {
        case 'publish':
          return this.publish()
      }
    },
    async publish() {
      if (this.executing) {
        return
      }

      const key = 'COURSE_PUBLISH'
      const mutation = require('~/gql/manage/publishCourse.gql')
      const name = 'publishCourse'
      const variables = { code: this.courseCode }

      try {
        const response = await this.$apollo
          .mutate({ mutation, variables })
          .then(({ data }) => data && data[name])

        if (response) {
          this.$notificationManager.displaySuccessMessage(
            this.$t(`success.${key}`)
          )
        }
      } finally {
        this.executing = false
      }
    },
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

<template>
  <ApolloQuery
    v-slot="{ result: { error, data: course }, isLoading }"
    :query="require('~/gql/manage/getCourse.gql')"
    :update="(data) => data.course"
    :variables="{ code: courseCode }"
    @result="setTitle"
  >
    <div v-if="!!isLoading">{{ $t('global.loading') }}</div>

    <div v-else-if="course && course.isCoordinator">
      <space-switcher :items="spaces(course)" />

      <h2>{{ title }}</h2>

      <v-row>
        <v-col cols="12" md="9">
          <v-row>
            <v-col cols="12" md="6">
              <registrations-info-card :course="course" />
              <groups-info-card
                v-if="showGroupsInfo(course)"
                class="mt-5"
                :course="course"
              />
            </v-col>

            <v-col cols="12" md="6">
              <assessments-info-card :course-code="courseCode" space="manage" />
            </v-col>
          </v-row>
        </v-col>

        <v-col
          cols="12"
          md="3"
          :order="$vuetify.breakpoint.smAndDown ? 'first' : undefined"
        >
          <course-status-info-panel :course="course" />
          <course-schedule-panel class="mt-5" :course-code="courseCode" />
        </v-col>
      </v-row>

      <actions-menu
        :edit-link="{
          name: 'manage-courses-code-edit',
          params: { code: courseCode },
        }"
      />
    </div>

    <div v-else-if="error">{{ $t('error.unexpected') }}</div>
  </ApolloQuery>
</template>

<script>
export default {
  name: 'ManageCoursePage',
  data() {
    return {
      title: '',
    }
  },
  head() {
    return {
      title: this.title,
    }
  },
  computed: {
    courseCode() {
      return this.$route.params.code
    },
  },
  methods: {
    setTitle({ data: course }) {
      this.title = course?.name || ''
    },
    showGroupsInfo(course) {
      return (
        course.teachers?.length ||
        course.groups?.teaching?.length ||
        course.groups?.working?.length
      )
    },
    spaces(course) {
      const items = {}

      if (course.isPublished || course.isArchived) {
        items.home = {
          name: 'courses-code',
          params: { code: this.courseCode },
        }
        items.teach = {
          name: 'teach-courses-code',
          params: { code: this.courseCode },
        }
      }

      return items
    },
  },
  meta: {
    roles: ['teacher'],
  },
}
</script>

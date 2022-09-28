<template>
  <ApolloQuery
    v-slot="{ isLoading, result: { data: course, error } }"
    :query="require('~/gql/teach/getCourse.gql')"
    :update="(data) => data.course"
    :variables="{ code: courseCode }"
    @result="setTitle"
  >
    <page-title
      :spaces="spaces(course)"
      :loading="!!isLoading"
      :value="title"
    />

    <div v-if="!error">
      <v-row>
        <v-col cols="12" md="9">
          <v-row>
            <v-col cols="12" md="6">
              <learners-info-card :course-code="courseCode" />
              <calendar-info-card class="mt-5" :course-code="courseCode" />
            </v-col>

            <v-col cols="12" md="6">
              <assessments-info-card :course-code="courseCode" space="teach" />
              <evaluations-info-card
                class="mt-5"
                :course-code="courseCode"
                space="teach"
              />
            </v-col>
          </v-row>
        </v-col>

        <v-col
          cols="12"
          md="3"
          :order="$vuetify.breakpoint.smAndDown ? 'first' : undefined"
        >
          <course-schedule-panel :course-code="courseCode" />
        </v-col>
      </v-row>
    </div>

    <div v-else-if="error">{{ $t('error.unexpected') }}</div>
  </ApolloQuery>
</template>

<script>
import titles from '@/mixins/titles.js'

export default {
  name: 'TeachCoursePage',
  mixins: [titles],
  data() {
    return {
      title: '',
    }
  },
  head() {
    return {
      title: this.getTitle(this.title, null, 'teach'),
    }
  },
  computed: {
    courseCode() {
      return this.$route.params.code
    },
  },
  methods: {
    setTitle({ data: course }) {
      this.title = course?.name ?? ''
    },
    spaces(course) {
      const items = {
        home: {
          name: 'courses-code',
          params: { code: this.courseCode },
        },
      }

      if (course?.isCoordinator) {
        items.manage = {
          name: 'manage-courses-code',
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

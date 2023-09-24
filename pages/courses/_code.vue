<!-- eslint-disable vue/no-v-html -->
<template>
  <ApolloQuery
    v-slot="{ isLoading, result: { data: course, error } }"
    :query="require('~/gql/getCourse.gql')"
    :update="(data) => data.course"
    :variables="{ code: courseCode }"
    @result="setTitle"
  >
    <div v-if="!error">
      <page-title :loading="!!isLoading" :value="title" />

      <v-row>
        <v-col cols="12" md="9">
          <v-card>
            <v-tabs v-model="currentTab" show-arrows>
              <v-tab href="#description">{{ $t('course.description') }}</v-tab>
              <v-tab href="#competencies">
                {{ $t('course.competencies._') }}
              </v-tab>
              <v-tab v-show="course?.schedule" href="#schedule">
                {{ $t('course.schedule._') }}
              </v-tab>
            </v-tabs>

            <v-card-text class="text--primary">
              <v-tabs-items v-model="currentTab">
                <v-tab-item value="description">
                  <div v-html="course?.description" />

                  <div v-if="course?.colophon">
                    <h3>{{ $t('course.colophon') }}</h3>
                    <div v-html="course.colophon" />
                  </div>
                </v-tab-item>

                <v-tab-item value="competencies">
                  <course-competencies-list :course-code="courseCode" />
                </v-tab-item>

                <v-tab-item v-if="course?.schedule" value="schedule">
                  <schedule-timeline
                    :items="course.schedule"
                    name-prefix="course.schedule"
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
          <registration-info-panel
            v-if="$auth.user"
            class="mb-5"
            :code="courseCode"
            entity="course"
          />
          <course-info-panel :course-code="courseCode" />
        </v-col>
      </v-row>
    </div>

    <div v-else-if="error">{{ $t('error.unexpected') }}</div>
  </ApolloQuery>
</template>

<script>
import currentTab from '@/mixins/current-tab.js'

export default {
  name: 'CoursePage',
  mixins: [currentTab],
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
      this.title = course?.name ?? ''
    },
  },
  meta: {
    roles: ['guest'],
  },
}
</script>

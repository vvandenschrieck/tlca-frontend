<template>
  <ApolloQuery
    :query="require('../../gql/getCourse.gql')"
    :update="updateCourse"
    :variables="{ code: $route.params.code }"
  >
    <template #default="{ result: { error, data: course }, isLoading }">
      <div v-if="isLoading" v-t="'global.loading'"></div>

      <div v-else-if="course">
        <bread-crumb :items="homespaceNavItems('course', $route.params.code)" />

        <h2>{{ course.name }}</h2>

        <v-row>
          <v-col cols="12" md="9">
            <v-card>
              <v-tabs v-model="currentTab" show-arrows>
                <v-tab v-t="'course.description'"></v-tab>
                <v-tab v-t="'course.competencies'"></v-tab>
                <v-tab v-if="course.schedule" v-t="'course.schedule._'"></v-tab>
                <v-tab v-if="course.colophon" v-t="'course.colophon'"></v-tab>
              </v-tabs>
              <v-card-text class="text--primary">
                <v-tabs-items v-model="currentTab">
                  <v-tab-item>
                    <div v-html="course.description"></div>
                  </v-tab-item>

                  <v-tab-item>
                    <competency-list :items="course.competencies" />
                  </v-tab-item>

                  <v-tab-item v-if="course.schedule">
                    <v-timeline>
                      <v-timeline-item
                        v-for="{ name, date } in course.schedule"
                        :key="name"
                        small
                        right
                        :color="isInPast(date) ? 'grey' : undefined"
                      >
                        <span slot="opposite" v-t="`course.schedule.${name}`"></span>
                        {{ formatDateTimeFull(date) }}
                      </v-timeline-item>
                    </v-timeline>
                  </v-tab-item>

                  <v-tab-item v-if="course.colophon">
                    <div v-html="course.colophon"></div>
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
            <info-panel
              :title="$t('global.information')"
              icon="mdi-information"
              :items="course.infoItems"
            />
          </v-col>
        </v-row>
      </div>

      <div v-else-if="error">An error occurred</div>
    </template>
  </ApolloQuery>
</template>

<script>
import { DateTime } from 'luxon'
import breadcrumb from '@/mixins/breadcrumb.js'
import datetime from '@/mixins/datetime.js'
import infopanel from '@/mixins/infopanel.js'

export default {
  name: 'CoursePage',
  mixins: [breadcrumb, datetime, infopanel],
  data() {
    return {
      currentTab: 'competencies',
      infoItemFields: {
        field: 'mdi-school',
        language: 'mdi-message',
        tags: 'mdi-tag-multiple',
      },
    }
  },
  methods: {
    schedule(course) {
      return course.schedule
        .map(({ name, date }) => ({ name, date: DateTime.fromISO(date) }))
        .sort((a, b) => a.date - b.date)
    },
    updateCourse(data) {
      const course = data.course
      course.infoItems = this.infoItems('course', course, this.infoItemFields)
      if (course.schedule) {
        course.schedule = this.schedule(course)
      }
      return course
    },
  },
}
</script>

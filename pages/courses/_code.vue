<template>
  <ApolloQuery
    :query="query"
    :update="updateCourse"
    :variables="{ code: $route.params.code }"
  >
    <template #default="{ result: { error, data: course }, isLoading }">
      <div v-if="isLoading" v-t="'global.loading'"></div>

      <div v-else-if="course">
        <bread-crumb :items="homespaceNavItems('course', course.code)" />

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
                        <span
                          slot="opposite"
                          v-t="`course.schedule.${name}`"
                        ></span>
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
              v-if="$auth.user"
              :title="$t('course.registration._')"
              icon="mdi-book"
              :items="registrationItems(course)"
              class="mb-5"
            >
              <div v-if="$auth.user" class="text-center">
                <v-btn v-if="canRegister(course)" small color="success">
                  <v-icon left>mdi-plus</v-icon>
                  {{ $t('course.register') }}
                </v-btn>
                <v-btn
                  v-else-if="canRequestInvite(course)"
                  small
                  color="success"
                >
                  <v-icon left>mdi-email-plus</v-icon>
                  {{ $t('course.request_invite') }}
                </v-btn>
              </div>
            </info-panel>
            <info-panel
              :title="$t('global.information')"
              icon="mdi-information"
              :items="infoItems(course)"
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
      query: this.$auth.user
        ? require('../../gql/getCourseAuth.gql')
        : require('../../gql/getCourse.gql'),
    }
  },
  methods: {
    canRegister(course) {
      return (
        course.visibility === 'PUBLIC' &&
        this.$auth.user &&
        !(course.isCoordinator || course.isTeacher || course.isRegistered)
      )
    },
    canRequestInvite(course) {
      return (
        course.visibility === 'INVITE_ONLY' &&
        this.$auth.user &&
        !(
          course.isCoordinator ||
          course.isTeacher ||
          course.isRegistered ||
          course.hasRequestedInvitation
        )
      )
    },
    infoItems(course) {
      const infoItemFields = {
        field: 'mdi-school',
        language: 'mdi-message',
        tags: 'mdi-tag-multiple',
      }
      return this.generateInfoItems('course', course, infoItemFields)
    },
    registrationItems(course) {
      const items = []
      if (this.$auth.user) {
        const visibility = course.visibility.toLowerCase()
        items.push({
          icon: 'mdi-eye',
          text: this.$t(`course.registration.${visibility}`),
          tooltip: this.$t('course.visibility'),
        })
      }
      return items
    },
    schedule(course) {
      return course.schedule
        .map(({ name, date }) => ({ name, date: DateTime.fromISO(date) }))
        .sort((a, b) => a.date - b.date)
    },
    updateCourse(data) {
      const course = data.course
      if (course.schedule) {
        course.schedule = this.schedule(course)
      }
      return course
    },
  },
}
</script>

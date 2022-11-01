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
            <v-tab>{{ $tc('course.registrations._', 2) }}</v-tab>
          </v-tabs>

          <v-card-text class="text--primary">
            <v-tabs-items v-model="currentTab">
              <v-tab-item>
                <div class="text-right">
                  <course-send-invitation-btn
                    :course-code="courseCode"
                    @error="invitationSendError"
                    @success="(r) => invitationSendSuccess(course, r)"
                  />
                </div>

                <registrations-list :course-code="courseCode" />
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
import { gql } from 'graphql-tag'

import titles from '@/mixins/titles.js'

export default {
  name: 'ManageRegistrationsPage',
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
      title: this.getTitle(this.title, 'registration._', 'manage'),
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
    invitationSendError() {
      this.$notificationManager.displayErrorMessage(
        this.$t('error.INVITATION_SEND')
      )
    },
    invitationSendSuccess(course, registration) {
      const { defaultClient: apolloClient } = this.$apolloProvider
      const fragment = gql`
        fragment reg on Course {
          registrations {
            id
          }
        }
      `
      const id = apolloClient.cache.config.dataIdFromObject({
        __typename: 'Course',
        code: this.courseCode,
      })
      const data = apolloClient.readFragment({
        fragment,
        id,
      })
      apolloClient.writeData({
        id,
        data: {
          registrations: [...data.registrations, registration],
        },
      })

      this.$notificationManager.displaySuccessMessage(
        this.$t('success.INVITATION_SEND')
      )
    },
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

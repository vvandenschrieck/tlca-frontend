<template>
  <ApolloQuery
    v-slot="{ result: { error, data: course }, isLoading }"
    :query="require('~/gql/manage/getCourse.gql')"
    :update="(data) => data.course"
    :variables="{ code: courseCode }"
    @result="setTitle"
  >
    <div v-if="isLoading">{{ $t('global.loading') }}</div>

    <div v-else-if="course && course.isCoordinator">
      <h2>{{ title }}</h2>

      <v-row>
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
                  <registrations-list
                    :code="courseCode"
                    entity="course"
                    :teaching-groups="course.groups?.teaching"
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
          <course-status-info-panel :course="course" />

          <course-schedule-panel class="mt-5" :course-code="courseCode" />
        </v-col>
      </v-row>
    </div>

    <div v-else-if="error">{{ $t('error.unexpected') }}</div>
  </ApolloQuery>
</template>

<script>
import { gql } from 'graphql-tag'

export default {
  name: 'ManageCourseRegistrationsPage',
  data() {
    return {
      currentTab: 'registrations',
      title: '',
    }
  },
  head() {
    return {
      title: this.title + ' : ' + this.$tc('registration._', 2),
    }
  },
  computed: {
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
    setTitle({ data: course }) {
      this.title = course?.name ?? ''
    },
  },
  meta: {
    roles: ['teacher'],
  },
}
</script>

<template>
  <ApolloQuery
    v-slot="{ result: { error, data: course }, isLoading }"
    :query="require('~/gql/manage/getCourse.gql')"
    :update="(data) => data.course"
    :variables="{ code: $route.params.code }"
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
                  <registrations-list
                    v-if="course.registrations?.length"
                    :course="course"
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

          <course-schedule-panel
            v-if="course.schedule"
            class="mt-5"
            :schedule="course.schedule"
          />
        </v-col>
      </v-row>
    </div>

    <div v-else-if="error">{{ $t('error.unexpected') }}</div>
  </ApolloQuery>
</template>

<script>
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
  methods: {
    setTitle({ data: course }) {
      this.title = course.name
    },
  },
  meta: {
    roles: ['teacher'],
  },
}
</script>

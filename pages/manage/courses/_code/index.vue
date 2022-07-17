<template>
  <ApolloQuery
    :query="require('~/gql/manage/getCourse.gql')"
    :update="(data) => data.course"
    :variables="{ code: $route.params.code }"
  >
    <template #default="{ result: { error, data: course }, isLoading }">
      <div v-if="isLoading">{{ $t('global.loading') }}</div>

      <div v-else-if="course && course.isCoordinator">
        <h2 v-text="course.name"></h2>

        <v-row>
          <v-col cols="12" md="9">
            <v-card>
              <v-tabs v-model="currentTab" show-arrows>
                <v-tab>
                  {{ $t('course.description') }}
                </v-tab>
                <v-tab v-if="course.schedule">
                  {{ $t('course.schedule._') }}
                </v-tab>
                <v-tab v-if="course.registrations?.length">
                  {{ $tc('course.registrations._', 2) }}
                </v-tab>
              </v-tabs>

              <v-card-text class="text--primary">
                <v-tabs-items v-model="currentTab">
                  <v-tab-item>
                    <div v-if="course.description">
                      {{ course.description }}
                    </div>
                    <div v-else v-t="'global.description.no'"></div>
                  </v-tab-item>

                  <v-tab-item v-if="course.schedule">
                    <course-schedule :items="course.schedule" />
                  </v-tab-item>

                  <v-tab-item v-if="course.registrations?.length">
                    <registrations-list
                      :items="course.registrations"
                    ></registrations-list>
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
            <course-status-info-panel :course="course" class="mb-5" />

            <course-team-info-panel :course="course" />
          </v-col>
        </v-row>
      </div>

      <div v-else-if="error">An error occurred</div>
    </template>
  </ApolloQuery>
</template>

<script>
export default {
  name: 'ManageCoursePage',
  data() {
    return {
      currentTab: 'description',
    }
  },
  meta: {
    roles: ['teacher'],
  },
}
</script>

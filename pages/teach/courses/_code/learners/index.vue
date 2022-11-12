<template>
  <ApolloQuery
    v-slot="{ result: { data, error }, isLoading }"
    :query="require('~/gql/teach/getLearners.gql')"
    :variables="{ code: $route.params.code }"
  >
    <h2>{{ title }}</h2>

    <v-row v-if="!error">
      <v-col cols="12" md="9">
        <v-progress-linear v-if="!!isLoading" :indeterminate="true" />

        <v-card v-if="data">
          <v-tabs v-model="currentTab" show-arrows>
            <v-tab v-if="data.course.isCoordinator">
              {{ $t('learner.all') }}
            </v-tab>

            <template v-for="(group, i) in data.course.groups?.teaching || []">
              <v-tab v-if="group.isSupervisor" :key="i">
                {{ groupName(group, i + 1) }}
              </v-tab>
            </template>

            <v-tab
              v-if="
                !data.course.isCoordinator &&
                withoutGroup(data.registrations).length
              "
            >
              {{
                $t(
                  data.course.hasTeachingGroups
                    ? 'course.registrations.without_group'
                    : 'learner.all'
                )
              }}
            </v-tab>

            <v-tab>{{ $t('general.statistics._') }}</v-tab>
          </v-tabs>

          <v-card-text class="text--primary">
            <v-tabs-items v-model="currentTab">
              <v-tab-item v-if="data.course.isCoordinator">
                <learners-list
                  :course-code="courseCode"
                  :hide-advanced="!data.course.hasAdvancedCompetencies"
                  :hide-teaching-group="!data.course.hasTeachingGroups"
                  :hide-working-group="!data.course.hasWorkingGroups"
                  :items="data.registrations"
                />
              </v-tab-item>

              <template
                v-for="(group, i) in data.course.groups?.teaching || []"
              >
                <v-tab-item v-if="group.isSupervisor" :key="i">
                  <learners-list
                    :course-code="courseCode"
                    :hide-advanced="!data.course.hasAdvancedCompetencies"
                    :hide-teaching-group="true"
                    :hide-working-group="true"
                    :items="withGroup(data.registrations, i)"
                  />
                </v-tab-item>
              </template>

              <v-tab-item>
                <learners-list
                  :course-code="courseCode"
                  :hide-advanced="!data.course.hasAdvancedCompetencies"
                  :hide-teaching-group="true"
                  :hide-working-group="true"
                  :items="withoutGroup(data.registrations)"
                />
              </v-tab-item>

              <v-tab-item>
                <v-alert type="info" dense outlined>Upcoming feature</v-alert>
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
        <course-schedule-panel :course-code="courseCode" />
      </v-col>
    </v-row>

    <div v-else-if="error">{{ $t('error.unexpected') }}</div>
  </ApolloQuery>
</template>

<script>
export default {
  name: 'TeachLearnersPage',
  data() {
    return {
      currentTab: 0,
    }
  },
  head() {
    return {
      title: this.$tc('learner._', 2) + ' | ' + this.$t('global.spaces.teach'),
    }
  },
  computed: {
    courseCode() {
      return this.$route.params.code
    },
    title() {
      return this.$tc('learner._', 2)
    },
  },
  methods: {
    groupName(group, nb) {
      return group.name || this.$t('course.registrations.group_name', { nb })
    },
    withGroup(registrations, n) {
      return registrations.filter((r) => r.group?.teaching === n)
    },
    withoutGroup(registrations) {
      return registrations.filter((r) => !r.group?.teaching)
    },
  },
  meta: {
    roles: ['teacher'],
  },
}
</script>

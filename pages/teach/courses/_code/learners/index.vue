<template>
  <ApolloQuery
    v-slot="{ isLoading, result: { error } }"
    :query="require('~/gql/teach/getLearners.gql')"
    :variables="{ code: $route.params.code }"
    @result="setResult"
  >
    <page-title :spaces="spaces" :loading="!!isLoading" :value="title" />

    <v-row v-if="!error && canShowContent">
      <v-col cols="12" md="9">
        <v-card>
          <v-tabs v-model="currentTab" show-arrows>
            <v-tab v-if="course?.isCoordinator" href="#all">
              {{ $t('learner.all') }}
            </v-tab>

            <template v-for="(group, i) in teachingGroups">
              <v-tab :key="i" :href="'#group' + i">{{ group.name }}</v-tab>
            </template>

            <v-tab v-if="showNoGroup" href="#nogroup">
              {{
                $t(
                  course?.hasTeachingGroups
                    ? 'course.registrations.without_group'
                    : 'learner.all'
                )
              }}
            </v-tab>

            <v-tab href="#stats">{{ $t('general.statistics._') }}</v-tab>
          </v-tabs>

          <v-card-text class="text--primary">
            <v-tabs-items v-model="currentTab">
              <v-tab-item v-if="course?.isCoordinator" value="all">
                <learners-list
                  :course-code="courseCode"
                  :hide-advanced="hideAdvancedCompetencies"
                  :hide-teaching-group="hideTeachingGroup"
                  :hide-working-group="hideWorkingGroup"
                  :items="registrations"
                />
              </v-tab-item>

              <template v-for="(group, i) in teachingGroups">
                <v-tab-item :key="i" :value="'group' + i">
                  <learners-list
                    :course-code="courseCode"
                    :hide-advanced="hideAdvancedCompetencies"
                    hide-teaching-group
                    :hide-working-group="hideWorkingGroup"
                    :items="group.registrations"
                  />
                </v-tab-item>
              </template>

              <v-tab-item v-if="showNoGroup" value="nogroup">
                <learners-list
                  :course-code="courseCode"
                  :hide-advanced="hideAdvancedCompetencies"
                  hide-teaching-group
                  :hide-working-group="hideWorkingGroup"
                  :items="noGroup"
                />
              </v-tab-item>

              <v-tab-item value="stats">
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

    <div v-else>{{ $t('error.unexpected') }}</div>
  </ApolloQuery>
</template>

<script>
import titles from '@/mixins/titles.js'

export default {
  name: 'TeachLearnersPage',
  mixins: [titles],
  data() {
    return {
      course: null,
      currentTab: 0,
      noGroup: [],
      registrations: [],
      teachingGroups: [],
      title: '',
    }
  },
  head() {
    return {
      title: this.getTitle(this.title, 'learner._', 'teach'),
    }
  },
  computed: {
    canShowContent() {
      return !this.course || this.course.isCoordinator || this.course.isTeacher
    },
    courseCode() {
      return this.$route.params.code
    },
    hideAdvancedCompetencies() {
      return !this.course || !this.course.hasAdvancedCompetencies
    },
    hideTeachingGroup() {
      return !this.course || !this.course.hasTeachingGroups
    },
    hideWorkingGroup() {
      return !this.course || !this.course.hasWorkingGroups
    },
    showNoGroup() {
      return (
        this.noGroup?.length > 0 &&
        (!this.course?.isCoordinator ||
          this.noGroup?.length !== this.registrations?.length)
      )
    },
    spaces() {
      if (!this.course) {
        return null
      }

      const items = {
        home: {
          name: 'courses-code',
          params: { code: this.courseCode },
        },
      }

      if (this.course.isCoordinator) {
        items.manage = {
          name: 'manage-courses-code-registrations',
          params: { code: this.courseCode },
        }
      }

      return items
    },
  },
  methods: {
    groupName(group) {
      return (
        group.name ??
        this.$t('course.registrations.group_name', { nb: group.n + 1 })
      )
    },
    setResult({ data }) {
      if (!data) {
        return
      }

      this.course = data.course
      this.registrations = data.registrations ?? []
      this.title = data.course?.name ?? ''

      // Initialise the list of registrations for each teaching groups
      // and the one for registrations without group.
      this.noGroup =
        data.registrations?.filter(
          (r) => !r.group || r.group.teaching === null
        ) ?? []
      this.teachingGroups =
        data.course?.groups?.teaching
          ?.map((g, n) => ({
            ...g,
            n,
          }))
          .filter((g) => g.isSupervisor)
          .map((g) => ({
            ...g,
            name: this.groupName(g),
            registrations: this.registrations.filter(
              (r) => r.group?.teaching === g.n
            ),
          })) ?? []

      // Set the default tab to show.
      if (data.course?.isCoordinator) {
        this.currentTab = 'all'
      } else {
        this.currentTab = this.teachingGroups?.length ? 'group0' : 'nogroup'
      }
    },
  },
  meta: {
    roles: ['teacher'],
  },
}
</script>

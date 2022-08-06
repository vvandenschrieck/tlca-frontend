<!-- eslint-disable vue/no-v-html -->
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
      <space-switcher :items="spaces(course)" />

      <h2>{{ title }}</h2>

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
              <v-tab v-if="course.teachers?.length">
                {{ $t('course.team') }}
              </v-tab>
              <v-tab v-if="course.registrations?.length">
                {{ $tc('course.registrations._', 2) }}
              </v-tab>
            </v-tabs>

            <v-card-text class="text--primary">
              <v-tabs-items v-model="currentTab">
                <v-tab-item>
                  <div v-if="course.description" v-html="course.description" />
                  <div v-else>{{ $t('global.description.no') }}</div>
                </v-tab-item>

                <v-tab-item v-if="course.schedule">
                  <course-schedule :items="course.schedule" />
                </v-tab-item>

                <v-tab-item v-if="course.teachers?.length">
                  <h3>{{ $tc('course.teacher', course.teachers.length) }}</h3>

                  <v-chip
                    v-for="teacher in course.teachers"
                    :key="teacher.username"
                    class="ma-2"
                  >
                    {{ teacher.displayName || teacher.username }}
                  </v-chip>

                  <template v-if="course.groups?.length">
                    <h3>{{ $t('course.groups._') }}</h3>

                    <v-card class="mt-3" flat outlined>
                      <v-list class="dense pa-0">
                        <template v-for="(group, i) in groups(course)">
                          <v-list-item :key="i * 2" class="dense">
                            <v-list-item-content>
                              <v-list-item-title>
                                {{ group.name }}
                              </v-list-item-title>
                            </v-list-item-content>
                            <v-list-item-action>
                              <v-list-item-action-text>
                                {{ group.supervisor }}
                                <v-chip class="ml-3" small>
                                  {{ group.size }}
                                </v-chip>
                              </v-list-item-action-text>
                            </v-list-item-action>
                          </v-list-item>
                          <v-divider
                            v-if="i < course.groups.length - 1"
                            :key="i * 2 + 1"
                          ></v-divider>
                        </template>
                      </v-list>
                    </v-card>
                  </template>
                </v-tab-item>

                <v-tab-item v-if="course.registrations?.length">
                  <registrations-list :course="course"></registrations-list>
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
        </v-col>
      </v-row>
    </div>

    <div v-else-if="error">{{ $t('error.unexpected') }}</div>
  </ApolloQuery>
</template>

<script>
export default {
  name: 'ManageCoursePage',
  data() {
    return {
      currentTab: 'description',
      title: '',
    }
  },
  head() {
    return {
      title: this.title,
    }
  },
  methods: {
    groups(course) {
      return course.groups.map((group, i) => {
        let name = this.$t('course.registrations.group_name', { nb: i + 1 })
        if (group.name) {
          name += ' – ' + group.name
        }
        const supervisor = group.supervisor

        return {
          name,
          size: course.registrations.filter((r) => r.group === i).length,
          supervisor: supervisor.displayName || supervisor.username,
        }
      })
    },
    setTitle({ data: course }) {
      this.title = course.name
    },
    spaces(course) {
      const items = {}

      if (course.isPublished || course.isArchived) {
        items.home = {
          name: 'courses-code',
          params: { code: this.$route.params.code },
        }
        items.teach = {
          name: 'teach-courses-code',
          params: { code: this.$route.params.code },
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

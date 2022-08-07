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
          <v-row>
            <v-col cols="12" md="6">
              <registrations-info-card :course="course" />
            </v-col>

            <v-col cols="12" md="6">
              <generic-info-card
                icon="mdi-clipboard"
                :link="{
                  icon: 'mdi-clipboard',
                  text: $t('course.assessments.list'),
                  to: {
                    name: 'manage-courses-code-assessments',
                    params: { code: course.code },
                  },
                }"
                :title="$tc('course.assessments._', 2)"
              >
                <div v-if="course.assessments?.length">
                  {{ course.assessments }}
                </div>

                <span v-else>
                  {{ $t('assessment.no') }}
                </span>
              </generic-info-card>
            </v-col>
          </v-row>

          <v-row>
            <v-col cols="12" md="12">
              <generic-info-card
                icon="mdi-account-group"
                :title="$t('course.team')"
              >
                <h3>{{ $tc('course.teacher', course.teachers?.length) }}</h3>

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
              </generic-info-card>
            </v-col>
          </v-row>
        </v-col>

        <v-col
          cols="12"
          md="3"
          :order="$vuetify.breakpoint.smAndDown ? 'first' : undefined"
        >
          <course-status-info-panel :course="course" class="mb-5" />

          <course-schedule-panel
            v-if="course.schedule"
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
  name: 'ManageCoursePage',
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

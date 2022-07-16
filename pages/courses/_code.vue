<template>
  <ApolloQuery
    :query="(gql) => gql(query.query)"
    :update="(data) => data.course"
    :variables="query.variables"
  >
    <template #default="{ result: { error, data: course }, isLoading }">
      <div v-if="isLoading">{{ $t('global.loading') }}</div>

      <div v-else-if="course">
        <h2>{{ course.name }}</h2>

        <v-row>
          <v-col cols="12" md="9">
            <v-card>
              <v-tabs v-model="currentTab" show-arrows>
                <v-tab>{{ $t('course.description') }}</v-tab>
                <v-tab>{{ $t('course.competencies._') }}</v-tab>
                <v-tab v-if="course.schedule">
                  {{ $t('course.schedule._') }}
                </v-tab>
                <v-tab v-if="course.colophon">
                  {{ $t('course.colophon') }}
                </v-tab>
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
                    <course-schedule :items="course.schedule" />
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
            <registration-info-panel
              v-if="$auth.user"
              :course="course"
              class="mb-5"
            />

            <course-info-panel :course="course" />
          </v-col>
        </v-row>
      </div>

      <div v-else-if="error">An error occurred</div>
    </template>
  </ApolloQuery>
</template>

<script>
import { query } from 'gql-query-builder'

export default {
  name: 'CoursePage',
  data() {
    return {
      currentTab: 'competencies',
    }
  },
  computed: {
    query() {
      const fields = [
        'code',
        'colophon',
        {
          competencies: [
            {
              competency: ['code', 'description', 'name'],
            },
            'category',
            'subcategory',
          ],
        },
        {
          coordinator: ['username'],
        },
        'description',
        'field',
        'language',
        {
          load: ['ects', 'practice', 'theory', 'type', 'weekload'],
        },
        'name',
        {
          partners: ['abbreviation', 'code', 'name'],
        },
        {
          schedule: ['name', 'date'],
        },
        'span',
        'tags',
        {
          team: ['displayName', 'username'],
        },
        'type',
        'visibility',
      ]

      // Add fields to the query depending on the roles
      if (this.$auth.user) {
        fields.push('hasRequestedInvite', {
          registration: ['date', 'invite'],
        })

        if (this.$auth.user.hasAnyRoles('student')) {
          fields.push('isRegistered')
        }

        if (this.$auth.user.hasAnyRoles('teacher')) {
          fields.push('isCoordinator', 'isTeacher')
        }
      }

      return query(
        {
          operation: 'course',
          variables: {
            code: {
              value: this.$route.params.code,
              type: 'ID',
              required: true,
            },
          },
          fields,
        },
        null,
        {
          operationName: 'GetCourse',
        }
      )
    },
  },
  meta: {
    roles: ['guest'],
  },
}
</script>

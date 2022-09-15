<!-- eslint-disable vue/no-v-html -->
<template>
  <ApolloQuery
    v-slot="{ isLoading, result: { data: course, error } }"
    :query="require('~/gql/getCourse.gql')"
    :update="(data) => data.course"
    :variables="{ code: $route.params.code }"
  >
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
            </v-tabs>

            <v-card-text class="text--primary">
              <v-tabs-items v-model="currentTab">
                <v-tab-item>
                  <div v-html="course.description" />

                  <div v-if="course.colophon">
                    <h3>{{ $t('course.colophon') }}</h3>
                    <div v-html="course.colophon" />
                  </div>
                </v-tab-item>

                <v-tab-item>
                  <competency-list :items="course.competencies" />
                </v-tab-item>

                <v-tab-item v-if="course.schedule">
                  <course-schedule :items="course.schedule" />
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
            :code="course.code"
            entity="course"
            :visibility="course.visibility"
            class="mb-5"
          />

          <course-info-panel :course="course" />
        </v-col>
      </v-row>
    </div>

    <div v-else-if="error">{{ $t('error.unexpected') }}</div>
  </ApolloQuery>
</template>

<script>
export default {
  name: 'CoursePage',
  data() {
    return {
      currentTab: 0,
      title: '',
    }
  },
  head() {
    return {
      title: this.title,
    }
  },
  methods: {
    setTitle({ data: course }) {
      this.title = course?.name ?? ''
    },
  },
  meta: {
    roles: ['guest'],
  },
}
</script>

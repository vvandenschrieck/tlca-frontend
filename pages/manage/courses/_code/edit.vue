<template>
  <ApolloQuery
    v-slot="{ isLoading, result: { data: course, error } }"
    :query="require('~/gql/manage/edit/getCourse.gql')"
    :update="(data) => data.course"
    :variables="{ code: courseCode }"
  >
    <h2>{{ title }}</h2>

    <div v-if="!error">
      <v-progress-linear v-if="!!isLoading" indeterminate />
      <form-course v-else-if="course" :course="course" edit />
    </div>

    <div v-else>{{ $t('error.unexpected') }}</div>
  </ApolloQuery>
</template>

<script>
import titles from '@/mixins/titles.js'

export default {
  name: 'ManageEditCoursePage',
  mixins: [titles],
  head() {
    return {
      title: this.getTitle(this.title, null, 'manage'),
    }
  },
  computed: {
    courseCode() {
      return this.$route.params.code
    },
    title() {
      return this.$t('course.edit._')
    },
  },
  meta: {
    roles: ['teacher'],
  },
}
</script>

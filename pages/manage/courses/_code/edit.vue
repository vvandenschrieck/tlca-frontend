<template>
  <ApolloQuery
    v-slot="{ isLoading, result: { data: course, error } }"
    :query="require('~/gql/manage/edit/getCourse.gql')"
    :update="(data) => data.course"
    :variables="{ code: $route.params.code }"
  >
    <h2>{{ $t('course.edit') }}</h2>

    <div v-if="isLoading">{{ $t('global.loading') }}</div>

    <form-course v-else-if="course" :course="course" edit />

    <div v-else-if="error">{{ $t('error.unexpected') }}</div>
  </ApolloQuery>
</template>

<script>
export default {
  name: 'ManageEditCoursePage',
  head() {
    return {
      title: this.title,
    }
  },
  computed: {
    title() {
      return this.$t('course.edit')
    },
  },
  meta: {
    roles: ['teacher'],
  },
}
</script>

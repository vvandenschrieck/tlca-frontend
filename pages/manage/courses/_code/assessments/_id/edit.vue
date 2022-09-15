<template>
  <ApolloQuery
    v-slot="{ isLoading, result: { data: assessment, error } }"
    :query="require('~/gql/manage/getCourseAssessment.gql')"
    :update="(data) => data.assessment"
    :variables="{
      courseCode: $route.params.code,
      assessmentId: $route.params.id,
    }"
  >
    <h2>{{ $t('assessment.edit') }}</h2>

    <div v-if="isLoading">{{ $t('global.loading') }}</div>

    <form-assessment v-else-if="assessment" :assessment="assessment" edit />

    <div v-else-if="error">{{ $t('error.unexpected') }}</div>
  </ApolloQuery>
</template>

<script>
export default {
  name: 'ManageEditAssessmentPage',
  head() {
    return {
      title: this.title,
    }
  },
  computed: {
    title() {
      return this.$t('assessment.edit')
    },
  },
  meta: {
    roles: ['teacher'],
  },
}
</script>

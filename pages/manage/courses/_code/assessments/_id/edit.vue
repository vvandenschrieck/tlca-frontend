<template>
  <ApolloQuery
    v-slot="{ isLoading, result: { data: assessment, error } }"
    :query="require('~/gql/manage/edit/getAssessment.gql')"
    :update="(data) => data.assessment"
    :variables="{ assessmentId }"
  >
    <h2>{{ title }}</h2>

    <div v-if="isLoading">{{ $t('global.loading') }}</div>

    <form-assessment v-else-if="assessment" :assessment="assessment" edit />

    <div v-else-if="error">{{ $t('error.unexpected') }}</div>
  </ApolloQuery>
</template>

<script>
import titles from '@/mixins/titles.js'

export default {
  name: 'ManageEditAssessmentPage',
  mixins: [titles],
  head() {
    return {
      title: this.getTitle(this.title, null, 'manage'),
    }
  },
  computed: {
    assessmentId() {
      return this.$route.params.id
    },
    title() {
      return this.$t('assessment.edit')
    },
  },
  meta: {
    roles: ['teacher'],
  },
}
</script>

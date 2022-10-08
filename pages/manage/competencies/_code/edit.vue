<template>
  <ApolloQuery
    v-slot="{ isLoading, result: { data: competency, error } }"
    :query="require('~/gql/manage/edit/getCompetency.gql')"
    :update="(data) => data.competency"
    :variables="{ code: $route.params.code }"
  >
    <h2>{{ title }}</h2>

    <div v-if="isLoading">{{ $t('global.loading') }}</div>

    <form-competency v-else-if="competency" :competency="competency" edit />

    <div v-else-if="error">{{ $t('error.unexpected') }}</div>
  </ApolloQuery>
</template>

<script>
export default {
  name: 'ManageEditCompetencyPage',
  head() {
    return {
      title: this.title,
    }
  },
  computed: {
    title() {
      return this.$t('competency.edit')
    },
  },
  meta: {
    roles: ['teacher'],
  },
}
</script>

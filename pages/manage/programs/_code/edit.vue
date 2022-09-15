<template>
  <ApolloQuery
    v-slot="{ isLoading, result: { data: program, error } }"
    :query="require('~/gql/manage/edit/getProgram.gql')"
    :update="(data) => data.program"
    :variables="{ code: $route.params.code }"
  >
    <h2>{{ $t('program.edit') }}</h2>

    <div v-if="isLoading">{{ $t('global.loading') }}</div>

    <form-program v-else-if="program" edit :program="program" />

    <div v-else-if="error">{{ $t('error.unexpected') }}</div>
  </ApolloQuery>
</template>

<script>
export default {
  name: 'ManageEditProgramPage',
  head() {
    return {
      title: this.title,
    }
  },
  computed: {
    title() {
      return this.$t('program.edit')
    },
  },
  meta: {
    roles: ['teacher'],
  },
}
</script>

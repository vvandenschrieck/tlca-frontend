<template>
  <ApolloQuery
    :query="require('../../gql/getProgram.gql')"
    :update="updateProgram"
    :variables="{ code: $route.params.code }"
  >
    <template #default="{ result: { error, data: program }, isLoading }">
      <div v-if="isLoading" v-t="'global.loading'"></div>

      <div v-else-if="program">
        <bread-crumb :items="homespaceNavItems('program', program.code)" />

        <h2>{{ program.name }}</h2>

        <div>{{ program }}</div>
      </div>

      <div v-else-if="error">An error occurred</div>
    </template>
  </ApolloQuery>
</template>

<script>
import breadcrumb from '@/mixins/breadcrumb.js'

export default {
  name: 'ProgramPage',
  mixins: [breadcrumb],
  methods: {
    updateProgram(data) {
      const program = data.program
      return program
    },
  },
}
</script>

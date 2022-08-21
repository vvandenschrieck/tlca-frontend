<template>
  <ApolloQuery :query="require('../../gql/getPrograms.gql')">
    <template #default="{ result: { error, data }, isLoading }">
      <div v-if="isLoading || data">
        <list-page
          :title="title"
          :prop-name="propName"
          :component="component"
          :items="data && data.programs"
        />
      </div>

      <div v-else-if="error">An error occurred</div>
    </template>
  </ApolloQuery>
</template>

<script>
import ProgramCard from '~/components/cards/ProgramCard.vue'

export default {
  name: 'ProgramsPage',
  data() {
    return {
      propName: 'program',
      component: ProgramCard,
    }
  },
  head() {
    return {
      title: this.title,
    }
  },
  computed: {
    title() {
      return this.$tc('program._', 2)
    },
  },
  meta: {
    roles: ['guest'],
  },
}
</script>

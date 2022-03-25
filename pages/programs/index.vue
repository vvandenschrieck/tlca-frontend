<template>
  <ApolloQuery :query="require('../../gql/getPrograms.gql')">
    <template #default="{ result: { error, data }, isLoading }">
      <div v-if="isLoading || data">
        <list-page
          :title="title"
          :prop-name="propName"
          :component="component"
          :items="data && data.programs"
          :nav-items="homespaceNavItems('program')"
        />
      </div>

      <div v-else-if="error">An error occurred</div>
    </template>
  </ApolloQuery>
</template>

<script>
import ProgramCard from '~/components/cards/ProgramCard.vue'
import breadcrumb from '@/mixins/breadcrumb.js'

export default {
  name: 'ProgramsPage',
  mixins: [breadcrumb],
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
}
</script>

<template>
  <ApolloQuery
    :query="require('~/gql/manage/getPrograms.gql')"
    :update="(data) => data.programs"
  >
    <template #default="{ result: { error, data: programs }, isLoading }">
      <div v-if="isLoading || programs">
        <h2>{{ $tc('program._', 2) }}</h2>

        <programs-filter-bar v-model="filter" />

        <card-list
          class="mt-5"
          :component="component"
          link-prefix="manage-"
          :items="filteredPrograms(programs, filter)"
          :prop-name="propName"
        />
      </div>

      <div v-else-if="error">An error occurred</div>
    </template>
  </ApolloQuery>
</template>

<script>
import ProgramCard from '~/components/cards/ProgramCard.vue'
import programs from '@/mixins/programs.js'

export default {
  name: 'ManageProgramsPage',
  mixins: [programs],
  data() {
    return {
      filter: {},
      propName: 'program',
      component: ProgramCard,
    }
  },
  head() {
    return {
      title: this.$tc('program._', 2),
    }
  },
  meta: {
    roles: ['teacher'],
  },
}
</script>

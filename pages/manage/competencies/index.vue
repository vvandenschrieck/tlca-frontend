<template>
  <ApolloQuery
    :query="require('~/gql/manage/getCompetencies.gql')"
    :update="(data) => data.competencies"
  >
    <template #default="{ result: { error, data }, isLoading }">
      <div v-if="isLoading || data">
        <bread-crumb :items="navItems('manage', 'competency')" />

        <h2>{{ $tc('competency._', 2) }}</h2>

        <v-data-table
          v-if="data && data.length"
          :headers="headers"
          :items="data"
          :items-per-page="5"
          class="elevation-1"
        >
          <template #item.isPublic="{ value: isPublic }">
            <v-icon v-if="isPublic" small>mdi-check-bold</v-icon>
          </template>
        </v-data-table>

        <div v-else-if="data && !data.length" v-t="'competency.no'"></div>

        <v-skeleton-loader v-else type="table"></v-skeleton-loader>
      </div>

      <div v-else-if="error">An error occurred</div>
    </template>
  </ApolloQuery>
</template>

<script>
import breadcrumb from '@/mixins/breadcrumb.js'

export default {
  name: 'ManageCompetenciesPage',
  mixins: [breadcrumb],
  computed: {
    headers() {
      return [
        { text: this.$t('competency.code'), value: 'code' },
        { text: this.$t('competency.name'), value: 'name' },
        {
          text: this.$t('competency.public'),
          value: 'isPublic',
          align: 'center',
        },
      ]
    },
  },
  meta: {
    roles: ['teacher'],
  },
}
</script>
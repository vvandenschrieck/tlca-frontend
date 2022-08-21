<template>
  <ApolloQuery
    :query="require('~/gql/admin/getCompetencies.gql')"
    :update="(data) => data.competencies"
  >
    <template #default="{ result: { error, data: competencies }, isLoading }">
      <div v-if="isLoading || competencies">
        <h2>{{ $tc('competency._', 2) }}</h2>

        <v-data-table
          v-if="competencies"
          :headers="headers"
          :items="competencies"
          :items-per-page="5"
          class="elevation-1"
        >
          <template #item.partners="{ value: partners }">
            <v-chip-group
              v-if="partners?.length"
              active-class="primary--text"
              column
              max="0"
              multiple
            >
              <v-chip v-for="(partner, index) in partners" :key="index" small>
                {{ partner.abbreviation || partner.name }}
              </v-chip>
            </v-chip-group>
            <span v-else>–</span>
          </template>
          <template #item.isPublic="{ value: isPublic }">
            <v-icon small>
              {{ isPublic ? 'mdi-check-bold' : 'mdi-close-thick' }}
            </v-icon>
          </template>
        </v-data-table>

        <v-skeleton-loader v-else type="table"></v-skeleton-loader>
      </div>

      <div v-else-if="error">An error occurred</div>
    </template>
  </ApolloQuery>
</template>

<script>
export default {
  name: 'AdminCompetenciesPage',
  head() {
    return {
      title:
        this.$tc('competency._', 2) + ' | ' + this.$t('global.spaces.admin'),
    }
  },
  computed: {
    headers() {
      return [
        { text: this.$t('competency.code'), value: 'code' },
        { text: this.$t('competency.name'), value: 'name' },
        { text: this.$t('competency.partners'), value: 'partners' },
        { text: this.$t('competency.public'), value: 'isPublic' },
      ]
    },
  },
  meta: {
    roles: ['admin'],
  },
}
</script>

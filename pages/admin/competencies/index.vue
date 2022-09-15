<template>
  <ApolloQuery
    v-slot="{ result: { error, data: competencies }, isLoading }"
    :query="require('~/gql/admin/getCompetencies.gql')"
    :update="(data) => data.competencies"
  >
    <div v-if="!!isLoading || competencies">
      <h2>{{ $tc('competency._', 2) }}</h2>

      <v-data-table
        v-if="competencies"
        class="elevation-1"
        :headers="headers"
        :items="competencies"
        :items-per-page="5"
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

        <template #item.visibility="{ item: { isPublic } }">
          <v-icon :color="isPublic ? 'success' : 'error'" small>
            {{ isPublic ? 'mdi-check-circle' : 'mdi-minus-circle' }}
          </v-icon>
        </template>
      </v-data-table>

      <v-skeleton-loader v-else type="table" />
    </div>

    <div v-else-if="error">{{ $t('error.unexpected') }}</div>
  </ApolloQuery>
</template>

<script>
export default {
  name: 'AdminCompetenciesPage',
  head() {
    return {
      title: `${this.$tc('competency._', 2)} (${this.$t(
        'global.spaces.admin'
      ).toLowerCase()})`,
    }
  },
  computed: {
    headers() {
      return [
        { text: this.$t('competency.code'), value: 'code' },
        { text: this.$t('competency.name'), value: 'name' },
        { text: this.$t('competency.partners'), value: 'partners' },
        { text: this.$t('competency.visibility._'), value: 'visibility' },
      ]
    },
  },
  meta: {
    roles: ['admin'],
  },
}
</script>

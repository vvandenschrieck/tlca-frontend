<template>
  <ApolloQuery
    v-slot="{ result: { error, data: partners }, isLoading }"
    :query="require('~/gql/admin/getPartners.gql')"
    :update="(data) => data.partners"
  >
    <div v-if="!!isLoading || partners">
      <h2>{{ $tc('partner._', 2) }}</h2>

      <v-data-table
        v-if="partners"
        class="elevation-1"
        :headers="headers"
        :items="partners"
        :items-per-page="5"
      >
        <template #item.abbreviation="{ value: abbreviation }">
          {{ abbreviation || '—' }}
        </template>
      </v-data-table>

      <v-skeleton-loader v-else type="table" />
    </div>

    <div v-else-if="error">{{ $t('error.unexpected') }}</div>
  </ApolloQuery>
</template>

<script>
export default {
  name: 'AdminPartnersPage',
  head() {
    return {
      title: `${this.$tc('partner._', 2)} (${this.$t(
        'global.spaces.admin'
      ).toLowerCase()})`,
    }
  },
  computed: {
    headers() {
      return [
        { text: this.$t('partner.code'), value: 'code' },
        { text: this.$t('partner.name'), value: 'name' },
        { text: this.$t('partner.abbreviation'), value: 'abbreviation' },
      ]
    },
  },
  meta: {
    roles: ['admin'],
  },
}
</script>

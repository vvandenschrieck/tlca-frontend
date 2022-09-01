<template>
  <ApolloQuery
    v-slot="{ isLoading, result: { data: partners, error } }"
    :query="require('~/gql/manage/getPartners.gql')"
    :update="(data) => data.partners"
  >
    <div v-if="isLoading || partners">
      <h2>{{ title }}</h2>

      <generic-filter-bar
        v-model="filter"
        :create-link="{ name: 'manage-partners-create' }"
        hide-filter
      />

      <card-list
        class="mt-5"
        :component="component"
        :items="filteredPartners(partners, filter)"
        :items-per-page="8"
        link-prefix="manage-"
        prop-name="partner"
      />
    </div>

    <div v-else-if="error">{{ $t('error.unexpected') }}</div>
  </ApolloQuery>
</template>

<script>
import PartnerCard from '~/components/cards/PartnerCard.vue'
import partners from '@/mixins/partners.js'

export default {
  name: 'ManagePartnersPage',
  mixins: [partners],
  data() {
    return {
      filter: {},
      component: PartnerCard,
    }
  },
  head() {
    return {
      title: this.title,
    }
  },
  computed: {
    title() {
      return this.$tc('partner._', 2)
    },
  },
  meta: {
    roles: ['manager'],
  },
}
</script>

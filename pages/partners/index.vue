<template>
  <ApolloQuery :query="require('../../gql/getPartners.gql')">
    <template #default="{ result: { loading, error, data } }">
      <div v-if="loading">Loading...</div>

      <div v-else-if="error">An error occurred</div>

      <div v-else-if="data">
        <list-page
          :title="title"
          :name="name"
          :component="component"
          :items="data.partners"
          :nav-items="navItems"
        />
      </div>
    </template>
  </ApolloQuery>
</template>

<script>
import PartnerCard from '~/components/cards/PartnerCard.vue'

export default {
  name: 'PartnersPage',
  data() {
    return {
      name: 'partners',
      component: {
        name: PartnerCard,
        propName: 'partner',
      },
    }
  },
  head() {
    return {
      title: this.title,
    }
  },
  computed: {
    navItems() {
      return [
        {
          text: this.$tc('global.spaces.home'),
          exact: true,
          to: { name: 'index' },
        },
        {
          text: this.title,
          exact: true,
          to: { name: 'partners' },
        },
      ]
    },
    title() {
      return this.$tc('partner._', 2)
    },
  },
}
</script>

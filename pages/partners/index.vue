<template>
  <div>
    <v-card flat color="grey lighten-3" class="my-2">
      <v-breadcrumbs divider="/" :items="navItems" class="py-2"></v-breadcrumbs>
    </v-card>
    <h2 v-t="{ path: 'partner._', choice: 2 }" />
    <card-list :name="panel.name" :component="panel.component" :items="partners" />
  </div>
</template>

<script>
import { gql } from 'graphql-tag';
import PartnerCard from '~/components/cards/PartnerCard.vue';
import CardList from '~/components/cards/CardList.vue';

export default {
  name: 'PartnersPage',
  components: { CardList },
  data() {
    return {
      navItems: [{
        text: this.$tc('partner._', 2),
        exact: true,
        to: { name: 'partners' }
      }],
      panel: {
        name: 'partners',
        component: {
          name: PartnerCard,
          propName: 'partner'
        }
      }
    };
  },
  apollo: {
    partners: gql`query {
      partners {
        abbreviation
        banner
        code
        name
      }
    }`
  }
}
</script>

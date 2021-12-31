<template>
  <div v-if="partner">
    <v-card flat color="grey lighten-3" class="my-2">
      <v-breadcrumbs divider="/" :items="navItems" class="py-2"></v-breadcrumbs>
    </v-card>
    <h2 v-text="partner.name" />
    <div>{{ partner }}</div>
  </div>
</template>

<script>
import { gql } from 'graphql-tag';

export default {
  name: 'PartnerPage',
  computed: {
    navItems() {
      return [{
        text: this.$tc('partner._', 2),
        exact: true,
        to: { name: 'partners' }
      }, {
        text: this.partner.abbreviation ?? this.partner.name
      }];
    }
  },
  apollo: {
    partner: {
      query: gql`query Partner($code: String!) {
        partner(code: $code) {
          abbreviation
          code
          name
        }
      }`,
      variables() {
        return {
          code: this.$route.params.code
        };
      }
    }
  }
}
</script>

<template>
  <list-page :title="title" :name="name" :component="component" :items="partners" :nav-items="navItems" />
</template>

<script>
import { gql } from 'graphql-tag';
import PartnerCard from '~/components/cards/PartnerCard.vue';

export default {
  name: 'PartnersPage',
  data() {
    return {
      name: 'partners',
      component: {
        name: PartnerCard,
        propName: 'partner'
      }
    };
  },
  head() {
    return {
      title: this.title
    }
  },
  computed: {
    navItems() {
      return [{
        text: this.$tc('global.spaces.home'),
        exact: true,
        to: { name: 'index' }
      }, {
        text: this.title,
        exact: true,
        to: { name: 'partners' }
      }];
    },
    title() {
      return this.$tc('partner._', 2);
    }
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

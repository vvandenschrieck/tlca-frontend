<template>
  <list-page :title="title" :name="name" :component="component" :items="programs" :nav-items="navItems" />
</template>

<script>
import { gql } from 'graphql-tag';
import ProgramCard from '~/components/cards/ProgramCard.vue';

export default {
  name: 'ProgramsPage',
  data() {
    return {
      name: 'programs',
      component: {
        name: ProgramCard,
        propName: 'program'
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
        to: { name: 'programs' }
      }];
    },
    title() {
      return this.$tc('program._', 2);
    }
  },
  apollo: {
    programs: gql`query {
      programs {
        code
        name
      }
    }`
  }
}
</script>

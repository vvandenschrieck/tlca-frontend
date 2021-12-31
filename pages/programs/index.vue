<template>
  <div>
    <v-card flat color="grey lighten-3" class="my-2">
      <v-breadcrumbs divider="/" :items="navItems" class="py-2"></v-breadcrumbs>
    </v-card>
    <h2 v-t="{ path: 'program._', choice: 2 }" />
    <card-list :name="panel.name" :component="panel.component" :items="programs" />
  </div>
</template>

<script>
import { gql } from 'graphql-tag';
import ProgramCard from '~/components/cards/ProgramCard.vue';
import CardList from '~/components/cards/CardList.vue';

export default {
  name: 'ProgramsPage',
  components: { CardList },
  data() {
    return {
      navItems: [{
        text: this.$tc('program._', 2),
        exact: true,
        to: { name: 'programs' }
      }],
      panel: {
        name: 'programs',
        component: {
          name: ProgramCard,
          propName: 'program'
        }
      }
    };
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

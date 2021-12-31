<template>
  <div v-if="program">
    <v-card flat color="grey lighten-3" class="my-2">
      <v-breadcrumbs divider="/" :items="navItems" class="py-2"></v-breadcrumbs>
    </v-card>
    <h2 v-text="program.name" />
    <div>{{ program }}</div>
  </div>
</template>

<script>
import { gql } from 'graphql-tag';

export default {
  name: 'ProgramPage',
  computed: {
    navItems() {
      return [{
        text: this.$tc('program._', 2),
        exact: true,
        to: { name: 'programs' }
      }, {
        text: this.program.name
      }];
    }
  },
  apollo: {
    program: {
      query: gql`query Program($code: String!) {
        program(code: $code) {
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

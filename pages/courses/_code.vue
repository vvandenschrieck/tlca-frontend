<template>
  <div v-if="course">
    <v-card flat color="grey lighten-3" class="my-2">
      <v-breadcrumbs divider="/" :items="navItems" class="py-2"></v-breadcrumbs>
    </v-card>
    <p>Course: {{ course.code }} - {{ course.name }}</p>
  </div>
</template>

<script>
import { gql } from 'graphql-tag'

export default {
  apollo: {
    course: {
      query: gql`query Course($code: String!) {
        course(code: $code) {
          code
          name
          type
        }
      }`,
      variables() {
        return {
          code: this.$route.params.code
        };
      }
    }
  },
  name: 'CoursePage',
  computed: {
    navItems() {
      return [{
        text: this.$tc('course._', 2),
        exact: true,
        to: { name: 'courses' }
      }, {
        text: this.$route.params.code
      }];
    }
  }
}
</script>

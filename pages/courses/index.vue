<template>
  <div>
    <v-card flat color="grey lighten-3" class="my-2">
      <v-breadcrumbs divider="/" :items="navItems" class="py-2"></v-breadcrumbs>
    </v-card>
    <h2>{{ $tc('course._', 2) }}</h2>
    <card-list :name="panel.name" :component="panel.component" :items="courses" />
  </div>
</template>

<script>
import { gql } from 'graphql-tag';
import CourseCard from '~/components/cards/CourseCard.vue';
import CardList from '~/components/cards/CardList.vue';

export default {
  name: 'CoursesPage',
  components: { CardList },
  data() {
    return {
      navItems: [{
        text: this.$tc('course._', 2),
        exact: true,
        to: { name: 'courses' }
      }],
      panel: {
        name: 'courses',
        component: {
          name: CourseCard,
          propName: 'course'
        }
      }
    };
  },
  apollo: {
    courses: gql`query {
      courses {
        banner
        code
        name
        type
      }
    }`
  }
}
</script>

<style scoped>
.card {
  height: 100%;
}
</style>

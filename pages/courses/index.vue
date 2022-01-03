<template>
  <list-page :title="title" :name="name" :component="component" :items="courses" :nav-items="navItems" />
</template>

<script>
import { gql } from 'graphql-tag';
import CourseCard from '~/components/cards/CourseCard.vue';

export default {
  name: 'CoursesPage',
  data() {
    return {
      name: 'courses',
      component: {
        name: CourseCard,
        propName: 'course'
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
        to: { name: 'courses' }
      }];
    },
    title() {
      return this.$tc('course._', 2);
    }
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

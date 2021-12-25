<template>
  <v-row justify="center" align="center">
    <v-col v-for="course in courses" :key="course.code">
      <course-card :course="course" />
    </v-col>
  </v-row>
</template>

<script>
import { gql } from 'graphql-tag'

export default {
  apollo: {
    courses: gql`query {
      courses {
        banner
        code
        name
        type
      }
    }`
  },
  name: 'IndexPage'
}
</script>

<template>
  <v-row justify="center" align="center">
    <v-col cols="12" sm="8" md="6">
      <course-card v-for="course in courses" :key="course.code" :course="course" />
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

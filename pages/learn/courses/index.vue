<template>
  <ApolloQuery
    :query="require('~/gql/learn/getCourses.gql')"
    :update="(data) => data.courses"
  >
    <template #default="{ result: { error, data: courses }, isLoading }">
      <div v-if="isLoading || courses">
        <bread-crumb />

        <h2>{{ $tc('course._', 2) }}</h2>

        <v-row>
          <v-col cols="12" md="9">
            <card-list
              :component="component"
              link-prefix="learn-"
              :items="courses"
              :items-per-page="6"
              :cards-per-page="3"
              :prop-name="propName"
            />
          </v-col>
          <v-col
            cols="12"
            md="3"
            :order="$vuetify.breakpoint.smAndDown ? 'first' : undefined"
          >
            <p>TODO Add info panel</p>
          </v-col>
        </v-row>
      </div>

      <div v-else-if="error">An error occurred</div>
    </template>
  </ApolloQuery>
</template>

<script>
import CourseCard from '~/components/cards/CourseCard.vue'

export default {
  name: 'LearnCoursesPage',
  data() {
    return {
      propName: 'course',
      component: CourseCard,
    }
  },
  head() {
    return {
      title: this.$tc('course._', 2) + ' | ' + this.$t('global.spaces.learn'),
    }
  },
  meta: {
    roles: ['student'],
  },
}
</script>

<template>
  <ApolloMutation
    v-slot="{ loading, mutate }"
    :mutation="require('~/gql/registrations/register.gql')"
    :variables="{ courseCode }"
    @done="done"
  >
    <v-btn color="success" :loading="loading" small @click="mutate">
      <v-icon left>mdi-plus</v-icon>
      <span>{{ $t('course.register') }}</span>
    </v-btn>
  </ApolloMutation>
</template>

<script>
export default {
  name: 'CourseRegisterBtn',
  props: {
    courseCode: {
      type: String,
      required: true,
    },
  },
  methods: {
    done(result) {
      this.$emit('done', result)
    },
  },
}
</script>

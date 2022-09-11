<template>
  <ApolloMutation
    v-slot="{ loading, mutate }"
    :mutation="require('~/gql/registrations/requestInvitation.gql')"
    :variables="{ courseCode }"
    @done="done"
  >
    <v-btn color="success" :loading="loading" small @click="mutate">
      <v-icon left>mdi-email-plus</v-icon>
      <span>{{ $t('course.invitation.request') }}</span>
    </v-btn>
  </ApolloMutation>
</template>

<script>
export default {
  name: 'CourseRequestInvitationBtn',
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

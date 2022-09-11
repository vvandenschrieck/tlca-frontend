<template>
  <ApolloMutation
    v-slot="{ loading, mutate }"
    :mutation="require('~/gql/registrations/acceptInvitation.gql')"
    :variables="{ id }"
    @done="done"
  >
    <v-btn color="success" :loading="loading" small @click="mutate">
      <v-icon left>mdi-email-check</v-icon>
      <span>{{ $t('course.invitation.accept') }}</span>
    </v-btn>
  </ApolloMutation>
</template>

<script>
export default {
  name: 'CourseAcceptInvitationBtn',
  props: {
    id: {
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

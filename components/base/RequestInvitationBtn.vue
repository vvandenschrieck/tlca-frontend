<template>
  <ApolloMutation
    v-slot="{ loading, mutate }"
    :mutation="require('~/gql/registrations/requestInvitation.gql')"
    :variables="{ [`${entity}Code`]: code }"
    @done="done"
  >
    <v-btn color="success" :loading="loading" small @click="mutate">
      <v-icon left>mdi-email-plus</v-icon>
      <span>{{ $t(`registration.invitation.request.__`) }}</span>
    </v-btn>
  </ApolloMutation>
</template>

<script>
export default {
  name: 'RequestInvitationBtn',
  props: {
    code: {
      type: String,
      required: true,
    },
    entity: {
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

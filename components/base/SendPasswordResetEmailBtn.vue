<template>
  <ApolloMutation
    v-slot="{ loading, mutate }"
    :mutation="require('~/gql/accounts/sendPasswordResetEmail.gql')"
    :variables="{ usernameOrEmail }"
    @done="done"
  >
    <v-btn
      color="primary"
      :loading="loading"
      small
      v-bind="$attrs"
      @click="mutate"
    >
      <v-icon left>mdi-email-fast</v-icon>
      <span>{{ $t('user.reset_password.send_email') }}</span>
    </v-btn>
  </ApolloMutation>
</template>

<script>
export default {
  name: 'SendPasswordResetEmailBtn',
  props: {
    usernameOrEmail: {
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

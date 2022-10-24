<template>
  <ApolloMutation
    v-slot="{ loading, mutate }"
    :mutation="require('~/gql/accounts/sendConfirmationEmail.gql')"
    :tag="tag"
    :variables="{ usernameOrEmail }"
    @done="done"
  >
    <generic-btn
      icon="mdi-email-fast"
      :label="$t('user.confirm_email.resend')"
      :loading="loading"
      v-bind="$attrs"
      @click="mutate"
    />
  </ApolloMutation>
</template>

<script>
export default {
  name: 'SendConfirmationEmailBtn',
  props: {
    tag: {
      type: String,
      default: 'div',
    },
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

<template>
  <v-container class="d-flex" style="height: 85vh">
    <v-card
      class="align-self-center ma-auto"
      style="min-width: 30vw; max-width: 35vw"
    >
      <v-card-title class="text-h5">
        {{ $t('user.confirm_email._') }}
      </v-card-title>

      <v-card-text>
        {{ $t('user.confirm_email.dialog_instructions') }}
      </v-card-text>

      <v-card-actions>
        <v-spacer />

        <!-- Resend confirmation link button -->
        <resend-confirmation-email-btn
          v-if="showResendBtn && !confirmationEmailSent"
          class="mr-3"
          :username-or-email="username"
          @done="onConfirmationEmailSent"
        />

        <!-- Confirmation button -->
        <ApolloMutation
          v-slot="{ loading, mutate }"
          :mutation="require('~/gql/accounts/confirmAccount.gql')"
          :variables="{ username, emailConfirmationToken }"
          @done="onAccountConfirmed"
          @error="error"
        >
          <v-btn color="success" :loading="loading" small @click="mutate">
            <v-icon left>mdi-account-check</v-icon>
            <span>{{ $t('general.confirm') }}</span>
          </v-btn>
        </ApolloMutation>
      </v-card-actions>
    </v-card>
  </v-container>
</template>

<script>
export default {
  name: 'EmailConfirmationPage',
  layout: 'minimal',
  data() {
    return {
      showResendBtn: false,
      confirmationEmailSent: false,
    }
  },
  computed: {
    emailConfirmationToken() {
      return this.$route.params.emailConfirmationToken
    },
    username() {
      return this.$route.params.username
    },
  },
  methods: {
    onAccountConfirmed({ data: { confirmAccount: result } }) {
      if (result) {
        this.$notificationManager.displaySuccessMessage(
          this.$t('success.CONFIRM_EMAIL')
        )
        return this.$router.push({ name: 'login' })
      }

      this.$notificationManager.displayErrorMessage(
        this.$t('error.CONFIRM_EMAIL')
      )
    },
    onConfirmationEmailSent({ data: { resendConfirmationEmail: result } }) {
      if (result) {
        this.$notificationManager.displaySuccessMessage(
          this.$t('success.CONFIRMATION_EMAIL_RESEND')
        )
        this.confirmationEmailSent = true
      }
    },
    error(err) {
      const error = err.graphQLErrors[0]
      if (
        error?.extensions?.code === 'BAD_USER_INPUT' &&
        error?.message === 'INVALID_CONFIRMATION_TOKEN'
      ) {
        this.showResendBtn = true
      }
    },
  },
  meta: {
    roles: ['guest'],
  },
}
</script>

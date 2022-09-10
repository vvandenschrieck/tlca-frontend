<template>
  <ApolloMutation
    v-slot="{ loading, mutate }"
    :mutation="require('~/gql/accounts/validateAccount.gql')"
    :variables="{
      username: $route.params.username,
      emailConfirmationToken: $route.params.emailConfirmationToken,
    }"
    @done="done"
  >
    <v-container class="d-flex" style="height: 85vh">
      <v-card
        class="align-self-center ma-auto"
        style="min-width: 30vw; max-width: 35vw"
      >
        <v-card-title class="text-h5">
          {{ $t('user.validate_email._') }}
        </v-card-title>

        <v-card-text>
          {{ $t('user.validate_email.dialog_instructions') }}
        </v-card-text>

        <v-card-actions>
          <v-spacer />

          <v-btn color="success" :loading="loading" small @click="mutate">
            <v-icon left>mdi-account-check</v-icon>
            <span>{{ $t('general.validate') }}</span>
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-container>
  </ApolloMutation>
</template>

<script>
export default {
  name: 'EmailConfirmationPage',
  layout: 'minimal',
  methods: {
    done({ data: { validateAccount: result } }) {
      if (result) {
        this.$notificationManager.displaySuccessMessage(
          this.$t('success.EMAIL_VALIDATION')
        )
        this.$router.push({ name: 'login' })
      } else {
        this.$notificationManager.displayErrorMessage(
          this.$t('error.EMAIL_VALIDATION')
        )
      }
    },
  },
  meta: {
    roles: ['guest'],
  },
}
</script>

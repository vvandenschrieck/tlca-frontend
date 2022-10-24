<template>
  <v-container class="d-flex" style="height: 85vh">
    <v-card
      class="align-self-center ma-auto"
      style="min-width: 30vw; max-width: 35vw"
    >
      <ValidationObserver ref="form" v-slot="{ handleSubmit }">
        <v-form
          :disabled="formBusy"
          @submit.prevent="handleSubmit(resetPassword)"
        >
          <v-card-title class="text-h5">
            {{ $t('user.reset_password._') }}
          </v-card-title>

          <v-card-text>
            <v-alert v-if="formError" dense outlined type="error">
              {{ $t(formError) }}
            </v-alert>

            <password-field-with-validation
              v-model="password"
              :label="$t('user.newPassword')"
              required
              rules="required"
              vid="password"
            />
            <password-field-with-validation
              v-model="passwordConfirmation"
              :label="$t('user.passwordConfirmation')"
              required
              rules="required"
              vid="passwordConfirmation"
            />
          </v-card-text>

          <v-card-actions>
            <v-spacer />

            <cancel-btn :disabled="formBusy" @click="reset" />
            <submit-btn action="update" :loading="formBusy" />
          </v-card-actions>
        </v-form>
      </ValidationObserver>
    </v-card>
  </v-container>
</template>

<script>
import { ValidationObserver } from 'vee-validate'

import resetPasswordGql from '~/gql/accounts/resetPassword.gql'

export default {
  name: 'EmailConfirmationPage',
  components: { ValidationObserver },
  layout: 'minimal',
  data() {
    return {
      formBusy: false,
      formError: null,
      password: '',
      passwordConfirmation: '',
    }
  },
  computed: {
    token() {
      return this.$route.params.token
    },
    username() {
      return this.$route.params.username
    },
  },
  methods: {
    reset() {
      this.resetForm()
      this.$router.push({ name: 'index' })
    },
    resetForm() {
      this.formError = null
      this.password = ''
      this.passwordConfirmation = ''
      this.$refs.form.reset()
    },
    async resetPassword() {
      this.formBusy = true

      try {
        const response = await this.$apollo
          .mutate({
            mutation: resetPasswordGql,
            variables: {
              password: this.password,
              token: this.token,
              username: this.username,
            },
          })
          .then(({ data }) => data && data.resetPassword)

        if (response) {
          this.reset()
          this.$notificationManager.displaySuccessMessage(
            this.$t('success.PASSWORD_RESET')
          )
          return
        }
      } catch (err) {
        if (err.graphQLErrors?.length) {
          this.formError = `error.${err.graphQLErrors[0].message}`
        }
      }

      if (!this.formError) {
        this.formError = 'error._'
      }
      this.formBusy = false
    },
  },
  meta: {
    roles: ['guest'],
  },
}
</script>

<template>
  <v-card>
    <ValidationObserver ref="form" v-slot="{ handleSubmit }">
      <v-form :disabled="formBusy" @submit.prevent="handleSubmit(signIn)">
        <v-card-title class="text-h5">
          {{ $t('authentication.sign_in') }}
        </v-card-title>

        <v-card-text>
          <v-alert v-if="formError" dense outlined type="error">
            {{ $t(formError) }}
          </v-alert>

          <v-text-field-with-validation
            v-model="usernameOrEmail"
            autofocus
            :label="$t('user.username_or_email')"
            required
            rules="required"
            vid="usernameOrEmail"
          />
          <password-field-with-validation
            v-model="password"
            :label="$t('user.password')"
            required
            rules="required"
            vid="password"
          />
        </v-card-text>

        <v-card-actions>
          <resend-confirmation-email-btn
            v-if="showResendBtn && !confirmationEmailSent"
            class="ml-2"
            outlined
            :username-or-email="usernameOrEmail"
            @done="onConfirmationEmailSent"
          />

          <v-spacer />

          <v-btn color="error" :disabled="formBusy" text @click="reset">
            {{ $t('general.cancel') }}
          </v-btn>
          <v-btn color="primary" :loading="formBusy" text type="submit">
            {{ $t('authentication.sign_in') }}
          </v-btn>
        </v-card-actions>
      </v-form>
    </ValidationObserver>
  </v-card>
</template>

<script>
import { ValidationObserver } from 'vee-validate'

export default {
  name: 'SignInForm',
  components: { ValidationObserver },
  props: {
    value: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      confirmationEmailSent: false,
      formBusy: false,
      formError: null,
      password: '',
      showResendBtn: false,
      usernameOrEmail: '',
    }
  },
  watch: {
    formBusy(newVal, oldVal) {
      if (newVal !== oldVal) {
        this.$emit('input', newVal)
      }
    },
  },
  methods: {
    reset() {
      this.resetForm()
      this.$emit('reset')
    },
    resetForm() {
      this.formError = null
      this.password = ''
      this.usernameOrEmail = ''
      this.$refs.form.reset()
    },
    async signIn() {
      this.formBusy = true

      try {
        const response = await this.$auth.loginWith('graphql', {
          usernameOrEmail: this.usernameOrEmail,
          password: this.password,
        })

        if (response) {
          this.$notificationManager.displaySuccessMessage(
            this.$t('success.SIGN_IN_SUCCESSFUL')
          )
          this.resetForm()
          return
        }
      } catch (err) {
        if (err.graphQLErrors?.length) {
          const errKey = err.graphQLErrors[0].message
          this.showResendBtn = errKey === 'UNCONFIRMED_EMAIL_ADDRESS'
          this.formError = `error.${errKey}`
        }
      }

      if (!this.formError) {
        this.formError = 'error._'
      }
      this.formBusy = false
    },
    onConfirmationEmailSent({ data: { resendConfirmationEmail: result } }) {
      if (result) {
        this.$notificationManager.displaySuccessMessage(
          this.$t('success.CONFIRMATION_EMAIL_RESEND')
        )
        this.confirmationEmailSent = true
      }
    },
  },
}
</script>

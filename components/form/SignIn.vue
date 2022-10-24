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
          <send-confirmation-email-btn
            v-if="showResendBtn && !confirmationEmailSent"
            class="ml-2"
            outlined
            :username-or-email="usernameOrEmail"
            @done="onConfirmationEmailSent"
          />
          <send-password-reset-email-btn
            v-if="showPasswordResetBtn && !passwordResetEmailSent"
            class="ml-2"
            outlined
            :username-or-email="usernameOrEmail"
            @done="onPasswordResetEmailSent"
          />

          <v-spacer />

          <cancel-btn :disabled="formBusy" @click="reset" />
          <submit-btn action="sign_in" :loading="formBusy" />
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
      passwordResetEmailSent: false,
      showPasswordResetBtn: false,
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
          this.showPasswordResetBtn = errKey === 'INVALID_CREDENTIALS'
          this.showResendBtn = errKey === 'UNCONFIRMED_EMAIL_ADDRESS'
          this.formError = `error.${errKey}`
        }
      }

      if (!this.formError) {
        this.formError = 'error._'
      }
      this.formBusy = false
    },
    onConfirmationEmailSent({ data: { sendConfirmationEmail: result } }) {
      if (result) {
        this.$notificationManager.displaySuccessMessage(
          this.$t('success.CONFIRMATION_EMAIL_SEND')
        )
        this.confirmationEmailSent = true
      }
    },
    onPasswordResetEmailSent({ data: { sendPasswordResetEmail: result } }) {
      if (result) {
        this.$notificationManager.displaySuccessMessage(
          this.$t('success.PASSWORD_RESET_EMAIL_RESEND')
        )
        this.passwordResetEmailSent = true
      }
    },
  },
}
</script>

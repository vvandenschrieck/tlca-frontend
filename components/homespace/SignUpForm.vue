<template>
  <v-dialog
    v-model="dialog"
    :fullscreen="$vuetify.breakpoint.xsOnly"
    max-width="500"
    :persistent="formBusy"
  >
    <template #activator="{ on, attrs }">
      <v-btn small text v-bind="attrs" v-on="{ ...on }">
        {{ $t('authentication.sign_up') }}
      </v-btn>
    </template>

    <v-card>
      <ValidationObserver ref="form" v-slot="{ handleSubmit }">
        <v-form :disabled="formBusy" @submit.prevent="handleSubmit(signUp)">
          <v-card-title class="text-h5">
            {{ $t('authentication.sign_up') }}
          </v-card-title>

          <v-card-text>
            <v-alert v-if="formError" dense outlined type="error">
              {{ $t(formError) }}
            </v-alert>

            <v-text-field-with-validation
              v-model="email"
              autofocus
              :label="$t('user.email')"
              required
              rules="required"
              vid="email"
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
            <v-spacer></v-spacer>

            <v-btn color="error" :disabled="formBusy" text @click="reset">
              {{ $t('general.cancel') }}
            </v-btn>
            <v-btn color="primary" :loading="formBusy" text type="submit">
              {{ $t('authentication.sign_up') }}
            </v-btn>
          </v-card-actions>
        </v-form>
      </ValidationObserver>
    </v-card>
  </v-dialog>
</template>

<script>
import { ValidationObserver } from 'vee-validate'
import signUpGql from '~/gql/signUp.gql'

export default {
  name: 'SignUpForm',
  components: { ValidationObserver },
  data() {
    return {
      dialog: false,
      email: '',
      formBusy: false,
      formError: null,
      password: '',
    }
  },
  watch: {
    dialog(value) {
      if (!value) {
        this.reset()
      }
    },
  },
  methods: {
    reset() {
      this.dialog = false
      this.email = ''
      this.formError = null
      this.password = ''
      this.$refs.form.reset()
    },
    async signUp() {
      this.formBusy = true

      try {
        const response = await this.$apollo
          .mutate({
            mutation: signUpGql,
            variables: {
              email: this.email,
              password: this.password,
            },
          })
          .then(({ data }) => data && data.signUp)

        if (response) {
          this.reset()
          this.$notificationManager.displaySuccessMessage(
            this.$t('success.SIGN_UP_SUCCESSFUL')
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
}
</script>

<template>
  <v-dialog
    v-model="dialog"
    :persistent="formBusy"
    max-width="500"
    :fullscreen="$vuetify.breakpoint.xsOnly"
  >
    <template #activator="{ on, attrs }">
      <v-btn v-bind="attrs" text small v-on="{ ...on }">
        {{ $t('authentication.sign_up') }}
      </v-btn>
    </template>
    <v-card>
      <v-form ref="form" class="mt-5" @submit.prevent="signUp()">
        <v-card-title class="text-h5 grey lighten-2">
          {{ $t('authentication.sign_up') }}
        </v-card-title>
        <v-card-text>
          <v-alert
            v-if="error"
            v-t="error"
            type="error"
            outlined
            dense
            class="mt-5"
          ></v-alert>
          <v-text-field
            v-model="email"
            :label="$t('user.email')"
            required
          ></v-text-field>
          <base-password-field-with-validation
            v-model="password"
            :label="$t('user.password')"
            rules="required"
            required
          ></base-password-field-with-validation>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn :disabled="formBusy" color="error" text @click="reset()">
            {{ $t('general.cancel') }}
          </v-btn>
          <v-btn type="submit" :loading="formBusy" color="primary" text>
            {{ $t('authentication.sign_up') }}
          </v-btn>
        </v-card-actions>
      </v-form>
    </v-card>
  </v-dialog>
</template>

<script>
import signUpGql from '~/gql/signUp.gql'

export default {
  name: 'SignUpForm',
  data() {
    return {
      dialog: false,
      email: '',
      error: null,
      formBusy: false,
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
      this.error = null
      this.password = ''
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
          this.error = `error.${err.graphQLErrors[0].message}`
        }
      }

      if (!this.error) {
        this.error = 'error._'
      }
      this.formBusy = false
    },
  },
}
</script>

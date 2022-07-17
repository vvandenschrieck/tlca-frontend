<template>
  <v-dialog
    v-model="dialog"
    :persistent="formBusy"
    max-width="500"
    :fullscreen="$vuetify.breakpoint.xsOnly"
  >
    <template #activator="{ on, attrs }">
      <v-tooltip bottom open-delay="500">
        <template #activator="{ on: tooltip }">
          <v-btn v-bind="attrs" icon small v-on="{ ...on, ...tooltip }">
            <v-icon>mdi-login</v-icon>
          </v-btn>
        </template>
        <span>{{ $t('authentication.sign_in') }}</span>
      </v-tooltip>
    </template>
    <v-card>
      <ValidationObserver ref="form" v-slot="{ handleSubmit }">
        <v-form :disabled="formBusy" @submit.prevent="handleSubmit(signIn)">
          <v-card-title class="text-h5 grey lighten-2">
            {{ $t('authentication.sign_in') }}
          </v-card-title>
          <v-card-text>
            <v-alert v-if="error" type="error" outlined dense class="mt-5">
              {{ $t(error) }}
            </v-alert>

            <v-text-field-with-validation
              v-model="usernameOrEmail"
              :label="$t('user.username_or_email')"
              rules="required"
              required
              autofocus
            ></v-text-field-with-validation>
            <base-password-field-with-validation
              v-model="password"
              :label="$t('user.password')"
              rules="required"
              required
            />
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn :disabled="formBusy" color="error" text @click="reset()">
              {{ $t('general.cancel') }}
            </v-btn>
            <v-btn type="submit" :loading="formBusy" color="primary" text>
              {{ $t('authentication.sign_in') }}
            </v-btn>
          </v-card-actions>
        </v-form>
      </ValidationObserver>
    </v-card>
  </v-dialog>
</template>

<script>
import { ValidationObserver } from 'vee-validate'

export default {
  name: 'SignInForm',
  components: { ValidationObserver },
  data() {
    return {
      dialog: false,
      usernameOrEmail: '',
      error: null,
      formBusy: false,
      password: '',
      showPassword: false,
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
      this.error = null
      this.password = ''
      this.usernameOrEmail = ''
    },
    async signIn() {
      this.formBusy = true

      try {
        const response = await this.$auth.loginWith('graphql', {
          usernameOrEmail: this.usernameOrEmail,
          password: this.password,
        })

        if (response) {
          this.reset()
          this.$notificationManager.displaySuccessMessage(
            this.$t('success.SIGN_IN_SUCCESSFUL')
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

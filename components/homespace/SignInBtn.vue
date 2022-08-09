<template>
  <v-dialog
    v-model="dialog"
    :fullscreen="$vuetify.breakpoint.xsOnly"
    max-width="500"
    :persistent="formBusy"
  >
    <template #activator="{ on, attrs }">
      <v-tooltip bottom open-delay="500">
        <template #activator="{ on: tooltip }">
          <v-btn icon small v-bind="attrs" v-on="{ ...on, ...tooltip }">
            <v-icon>mdi-login</v-icon>
          </v-btn>
        </template>
        <span>{{ $t('authentication.sign_in') }}</span>
      </v-tooltip>
    </template>

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
            <v-spacer></v-spacer>

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
  </v-dialog>
</template>

<script>
import { ValidationObserver } from 'vee-validate'

export default {
  name: 'SignInBtn',
  components: { ValidationObserver },
  data() {
    return {
      dialog: false,
      usernameOrEmail: '',
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
          this.reset()
          this.$notificationManager.displaySuccessMessage(
            this.$t('success.SIGN_IN_SUCCESSFUL')
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

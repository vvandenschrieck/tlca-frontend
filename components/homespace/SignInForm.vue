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
        <span v-t="'authentication.sign_in'"></span>
      </v-tooltip>
    </template>
    <v-card>
      <v-form ref="form" @submit.prevent="signIn()">
        <v-card-title
          v-t="'authentication.sign_in'"
          class="text-h5 grey lighten-2"
        ></v-card-title>
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
            v-model="usernameOrEmail"
            :label="$t('user.username_or_email')"
            required
          ></v-text-field>
          <v-text-field
            v-model="password"
            type="password"
            :label="$t('user.password')"
            required
          ></v-text-field>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            v-t="'general.cancel'"
            :disabled="formBusy"
            color="error"
            text
            @click="cancel()"
          ></v-btn>
          <v-btn
            v-t="'authentication.sign_in'"
            type="submit"
            :loading="formBusy"
            color="primary"
            text
          ></v-btn>
        </v-card-actions>
      </v-form>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: 'SignInForm',
  data() {
    return {
      dialog: false,
      usernameOrEmail: '',
      error: null,
      formBusy: false,
      password: '',
    }
  },
  watch: {
    dialog(value) {
      if (!value) {
        this.cancel()
      }
    },
  },
  methods: {
    cancel() {
      this.usernameOrEmail = ''
      this.password = ''
      this.error = null
      this.dialog = false
    },
    async signIn() {
      this.formBusy = true

      try {
        const credentials = {
          usernameOrEmail: this.usernameOrEmail,
          password: this.password,
        }
        await this.$auth.loginWith('graphql', credentials)
        this.dialog = false
      } catch (err) {
        if (err.graphQLErrors?.length) {
          this.error = `error.${err.graphQLErrors[0].message}`
        } else {
          this.error = 'error._'
        }
      }
      this.formBusy = false
    },
  },
}
</script>

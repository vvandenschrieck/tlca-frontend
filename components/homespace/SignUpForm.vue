<template>
  <v-dialog
    v-model="dialog"
    :persistent="formBusy"
    max-width="500"
    :fullscreen="$vuetify.breakpoint.xsOnly"
  >
    <template #activator="{ on, attrs }">
      <v-btn
        v-t="'authentication.sign_up'"
        v-bind="attrs"
        text
        small
        v-on="{ ...on }"
      ></v-btn>
    </template>
    <v-card>
      <v-form ref="form" class="mt-5" @submit.prevent="signUp()">
        <v-card-title
          v-t="'authentication.sign_up'"
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
            v-model="email"
            :label="$t('user.email')"
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
            v-t="'authentication.sign_up'"
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
        this.cancel()
      }
    },
  },
  methods: {
    cancel() {
      this.dialog = false
      this.email = ''
      this.error = null
      this.password = ''
    },
    async signUp() {
      this.formBusy = true

      try {
        const data = {
          email: this.email,
          password: this.password,
        }

        const response = await this.$apollo
          .mutate({
            mutation: signUpGql,
            variables: data,
          })
          .then(({ data }) => data && data.signUp)

        if (response) {
          this.dialog = false
        } else {
          this.error = 'error._'
        }
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

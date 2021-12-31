<template>
  <v-dialog v-model="dialog" width="50%" persistent>
    <template #activator="{ on, attrs }">
      <v-btn v-t="'authentication.signin'" v-bind="attrs" outlined small v-on="on"></v-btn>
    </template>
    <v-card>
      <v-card-title v-t="'authentication.signin'" class="text-h5 grey lighten-2"></v-card-title>
      <v-card-text>
        <v-alert v-if="error" type="error" outlined dense class="mt-5">
          <span v-t="error"></span>
        </v-alert>
        <v-form ref="form" class="mt-5">
          <v-text-field v-model="email" :label="$t('user.email')" required></v-text-field>
          <v-text-field v-model="password" type="password" :label="$t('user.password')" required></v-text-field>
        </v-form>
      </v-card-text>
      <v-divider></v-divider>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn v-t="'general.cancel'" :disabled="connecting" color="error" text @click="cancel()"></v-btn>
        <v-btn :loading="connecting" color="primary" text @click="signIn()">{{ $t('authentication.signin') }}</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { gql } from 'graphql-tag';

export default {
  name: 'SignInForm',
  data() {
    return {
      connecting: false,
      dialog: false,
      email: '',
      error: null,
      password: ''
    };
  },
  methods: {
    cancel() {
      this.dialog = false;
      this.error = null;
      this.email = '';
      this.password = '';
    },
    async signIn() {
      this.connecting = true;

      try {
        const { data: { signIn: { token }} } = await this.$apollo.mutate({
          mutation: gql`mutation ($email: String!, $password: String!) {
            signIn(email: $email, password: $password) {
              token
            }
          }`,
          variables: {
            email: this.email,
            password: this.password
          }
        });
        this.dialog = false;
        console.log('SUCCESS', token);
      } catch (err) {
        if(err.message === 'GraphQL error: Invalid credentials') {
          this.error = 'error.invalidCredentials';
        } else {
          this.error = 'error._';
        }
      }

      this.connecting = false;
    }
  }
}
</script>
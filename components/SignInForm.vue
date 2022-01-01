<template>
  <v-dialog v-model="dialog" width="50%" persistent>
    <template #activator="{ on, attrs }">
      <v-btn v-bind="attrs" outlined small v-on="on">{{ $t('authentication.signin') }}</v-btn>
    </template>
    <v-card>
      <v-card-title class="text-h5 grey lighten-2">{{ $t('authentication.signin') }}</v-card-title>
      <v-card-text>
        <v-alert v-if="error" type="error" outlined dense class="mt-5">
          {{ $t(error) }}
        </v-alert>
        <v-form ref="form" class="mt-5">
          <v-text-field v-model="email" :label="$t('user.email')" required></v-text-field>
          <v-text-field v-model="password" type="password" :label="$t('user.password')" required></v-text-field>
        </v-form>
      </v-card-text>
      <v-divider></v-divider>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn :disabled="formBusy" color="error" text @click="cancel()">{{ $t('general.cancel') }}</v-btn>
        <v-btn :loading="formBusy" color="primary" text @click="signIn()">{{ $t('authentication.signin') }}</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: 'SignInForm',
  data() {
    return {
      dialog: false,
      email: '',
      error: null,
      formBusy: false,
      password: ''
    };
  },
  methods: {
    cancel() {
      this.email = '';
      this.password = '';
      this.error = null;
      this.dialog = false;
    },
    async signIn() {
      this.formBusy = true;

      try {
        const credentials = { email: this.email, password: this.password };
        await this.$auth.loginWith('graphql', credentials);
        this.dialog = false;
      } catch (err) {
        if(err.message === 'GraphQL error: Invalid credentials') {
          this.error = 'error.invalidCredentials';
        } else {
          this.error = 'error._';
        }
      }
      this.formBusy = false;
    }
  }
}
</script>
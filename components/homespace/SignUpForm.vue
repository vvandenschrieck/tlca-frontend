<template>
  <v-dialog v-model="dialog" :persistent="formBusy" max-width="500" :fullscreen="$vuetify.breakpoint.xsOnly">
    <template #activator="{ on, attrs }">
      <v-btn v-bind="attrs" text small v-on="{ ...on }">
        {{ $t('authentication.sign_up') }}
      </v-btn>
    </template>
    <v-card>
      <v-card-title class="text-h5 grey lighten-2">{{ $t('authentication.sign_up') }}</v-card-title>
      <v-card-text>
        <v-alert v-if="error" type="error" outlined dense class="mt-5">
          {{ $t(error) }}
        </v-alert>
        <v-form ref="form" class="mt-5">
          <v-text-field v-model="firstName" :label="$t('user.first_name')" required></v-text-field>
          <v-text-field v-model="lastName" :label="$t('user.last_name')" required></v-text-field>
          <v-text-field v-model="email" :label="$t('user.email')" required></v-text-field>
          <v-text-field v-model="password" type="password" :label="$t('user.password')" required></v-text-field>
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn :disabled="formBusy" color="error" text @click="cancel()">{{ $t('general.cancel') }}</v-btn>
        <v-btn :loading="formBusy" color="primary" text @click="signUp()">{{ $t('authentication.sign_up') }}</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import signUpGql from '~/gql/signUp.gql';

export default {
  name: 'SignUpForm',
  data() {
    return {
      dialog: false,
      email: '',
      error: null,
      firstName: '',
      formBusy: false,
      lastName: '',
      password: ''
    };
  },
  watch: {
    dialog(value) {
      if (!value) {
        this.cancel();
      }
    }
  },
  methods: {
    cancel() {
      this.email = '';
      this.firstName = '';
      this.lastName = '';
      this.password = '';
      this.error = null;
      this.dialog = false;
    },
    async signUp() {
      this.formBusy = true;

      try {
        const data = { firstName: this.firstName, lastName: this.lastName, email: this.email, password: this.password };

        const response = await this.$apollo.mutate({
          mutation: signUpGql,
          variables: data
        }).then(({ data }) => data && data.signUp);

        if (response) {
          this.dialog = false;
        } else {
          this.error = 'error._';
        }
      } catch (err) {
        if (err.graphQLErrors?.length) {
          this.error = `error.${err.graphQLErrors[0].message}`
        } else {
          this.error = 'error._';
        }
      }
      this.formBusy = false;
    }
  }
}
</script>

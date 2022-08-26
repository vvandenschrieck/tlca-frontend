<template>
  <ApolloMutation
    v-slot="{ loading, mutate }"
    :mutation="require('../../gql/manage/sendInvitation.gql')"
    :variables="{ courseCode, email }"
    @done="success"
    @error="error"
  >
    <v-dialog
      v-model="dialog"
      :fullscreen="$vuetify.breakpoint.xsOnly"
      max-width="500"
      :persistent="loading"
    >
      <template #activator="{ on, attrs }">
        <v-btn color="success" small v-bind="attrs" v-on="on">
          <v-icon left>mdi-archive</v-icon>
          <span>{{ $t('course.invitation.send') }}</span>
        </v-btn>
      </template>

      <v-card>
        <ValidationObserver ref="form" v-slot="{ handleSubmit }">
          <v-form :disabled="loading" @submit.prevent="handleSubmit(mutate)">
            <v-card-title class="text-h5" dense>
              {{ $t('course.invitation.send') }}
            </v-card-title>

            <v-card-text>
              <v-alert v-if="formError" dense outlined type="error">
                {{ $t(formError) }}
              </v-alert>

              <div class="text--primary">
                {{ $t('course.invitation.dialog_instructions') }}
              </div>

              <v-text-field-with-validation
                v-model="email"
                autofocus
                :label="$t('user.email')"
                required
                rules="required"
                vid="email"
              />
            </v-card-text>

            <v-card-actions>
              <v-spacer></v-spacer>

              <v-btn color="error" :disabled="loading" text @click="reset">
                {{ $t('general.cancel') }}
              </v-btn>
              <v-btn type="submit" color="primary" :loading="loading" text>
                {{ $t('general.send') }}
              </v-btn>
            </v-card-actions>
          </v-form>
        </ValidationObserver>
      </v-card>
    </v-dialog>
  </ApolloMutation>
</template>

<script>
import { ValidationObserver } from 'vee-validate'

export default {
  name: 'CourseSendInvitationBtn',
  components: { ValidationObserver },
  props: {
    courseCode: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      dialog: false,
      email: '',
      formError: null,
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
    error(err) {
      if (err.graphQLErrors?.length) {
        const gqlError = err.graphQLErrors[0]
        if (gqlError.extensions?.formErrors) {
          this.$refs.form.setErrors(gqlError.extensions.formErrors)
        } else {
          this.formError = `error.${gqlError.message}`
        }
      }

      if (!this.formError) {
        this.formError = 'error._'
      }
    },
    reset() {
      this.dialog = false
      this.email = ''
      this.formError = null
    },
    success({ data: { sendInvitation: registration } }) {
      this.reset()
      this.$emit('success', registration)
    },
  },
}
</script>

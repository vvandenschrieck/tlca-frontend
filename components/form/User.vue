<template>
  <ValidationObserver ref="form" v-slot="{ handleSubmit }">
    <v-form :disabled="formBusy" @submit.prevent="handleSubmit(submit)">
      <v-alert v-if="formError" class="mt-5" dense outlined type="error">
        {{ $t(formError) }}
      </v-alert>

      <v-stepper non-linear vertical>
        <stepper-step step="1" :title="$t('general.information.general')">
          <v-row>
            <v-col cols="12" md="6">
              <v-text-field-with-validation
                v-model="firstName"
                :label="$t('user.first_name')"
                vid="firstName"
              />
            </v-col>

            <v-col cols="12" md="6">
              <v-text-field-with-validation
                v-model="lastName"
                :label="$t('user.last_name')"
                vid="lastName"
              />
            </v-col>
          </v-row>
        </stepper-step>
      </v-stepper>

      <div class="text-right mt-5">
        <reset-btn :disabled="formBusy" @click="resetForm" />
        <submit-btn action="edit" :loading="formBusy" />
      </div>
    </v-form>
  </ValidationObserver>
</template>

<script>
import { ValidationObserver } from 'vee-validate'

export default {
  name: 'FormUser',
  components: { ValidationObserver },
  props: {
    user: {
      type: Object,
      default: null,
    },
  },
  data() {
    return {
      firstName: '',
      formBusy: false,
      formError: null,
      lastName: '',
      username: '',
    }
  },
  mounted() {
    this.reset()
  },
  methods: {
    reset() {
      const user = this.user

      this.firstName = user?.firstName ?? ''
      this.lastName = user?.lastName ?? ''
      this.username = user?.username ?? ''
    },
    resetForm() {
      this.reset()
      this.formError = null
      this.$refs.form.reset()
    },
    async submit() {
      this.formBusy = true

      const data = {
        firstName: this.firstName,
        lastName: this.lastName,
        username: this.username,
      }
      const mutation = require('~/gql/users/editUser.gql')

      try {
        const response = await this.$apollo
          .mutate({
            mutation,
            variables: data,
          })
          .then(({ data }) => data && data.editUser)

        if (response) {
          const username = this.username
          this.$notificationManager.displaySuccessMessage(
            this.$t('success.USER_EDIT')
          )
          this.$router.push({
            name: 'profiles-username',
            params: { username },
          })
          return
        }
      } catch (err) {
        if (err.graphQLErrors?.length) {
          const gqlError = err.graphQLErrors[0]
          if (gqlError.extensions?.formErrors) {
            this.$refs.form.setErrors(gqlError.extensions.formErrors)
          } else {
            this.formError = `error.${gqlError.message}`
          }
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

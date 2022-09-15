<template>
  <ValidationObserver ref="form" v-slot="{ handleSubmit }">
    <v-form
      :disabled="formBusy"
      @submit.prevent="
        formSubmitted = true
        handleSubmit(submit)
      "
    >
      <v-alert v-if="formError" class="mt-5" dense outlined type="error">
        {{ $t(formError) }}
      </v-alert>

      <v-stepper non-linear vertical>
        <ValidationObserver v-slot="{ touched, valid }">
          <v-stepper-step
            editable
            step="1"
            :rules="[() => !((touched || formSubmitted) && !valid)]"
          >
            {{ $t('general.information.general') }}
          </v-stepper-step>

          <v-stepper-content step="1">
            <v-row>
              <v-col cols="12" md="2">
                <v-text-field-with-validation
                  v-model="code"
                  :disabled="edit"
                  :label="$t('partner.code')"
                  required
                  rules="required|alpha_dash"
                  vid="code"
                />
              </v-col>

              <v-col cols="12" md="10">
                <v-text-field-with-validation
                  v-model="name"
                  :label="$t('partner.name')"
                  required
                  rules="required"
                  vid="name"
                />
              </v-col>
            </v-row>

            <v-row>
              <v-col cols="12" md="12">
                <v-textarea-with-validation
                  v-model="description"
                  auto-grow
                  clear-icon="mdi-close-circle"
                  clearable
                  filled
                  :label="$t('partner.description._')"
                  required
                  rules="required"
                  vid="description"
                />
              </v-col>
            </v-row>
          </v-stepper-content>
        </ValidationObserver>

        <ValidationObserver v-slot="{ touched, valid }">
          <v-stepper-step
            editable
            step="2"
            :rules="[() => !((touched || formSubmitted) && !valid)]"
          >
            {{ $t('general.information.additional') }}
          </v-stepper-step>

          <v-stepper-content step="2">
            <v-row>
              <v-col cols="12" md="4">
                <v-text-field-with-validation
                  v-model="abbreviation"
                  :label="$t('partner.abbreviation')"
                  vid="abbreviation"
                />
              </v-col>

              <v-col cols="12" md="8">
                <v-text-field-with-validation
                  v-model="website"
                  :label="$t('partner.website')"
                  vid="website"
                />
              </v-col>
            </v-row>
          </v-stepper-content>
        </ValidationObserver>
      </v-stepper>

      <div class="text-right mt-5">
        <v-btn color="error" :disabled="formBusy" text @click="resetForm">
          {{ $t('general.reset') }}
        </v-btn>
        <v-btn color="primary" :loading="formBusy" text type="submit">
          {{ $t(`general.${action}`) }}
        </v-btn>
      </div>
    </v-form>
  </ValidationObserver>
</template>

<script>
import { ValidationObserver } from 'vee-validate'

export default {
  name: 'FormPartner',
  components: { ValidationObserver },
  props: {
    partner: {
      type: Object,
      default: null,
    },
    edit: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      abbreviation: '',
      code: '',
      description: '',
      formBusy: false,
      formError: null,
      formSubmitted: false,
      name: '',
      website: '',
    }
  },
  computed: {
    action() {
      return !this.edit ? 'create' : 'edit'
    },
  },
  mounted() {
    this.reset()
  },
  methods: {
    reset() {
      const { partner } = this

      this.abbreviation = partner?.abbreviation ?? ''
      this.code = partner?.code ?? ''
      this.description = partner?.description ?? ''
      this.name = partner?.name ?? ''
      this.website = partner?.website ?? ''
    },
    resetForm() {
      this.reset()
      this.formError = null
      this.formSubmitted = false
      this.$refs.form.reset()
    },
    async submit() {
      this.formBusy = true
      this.formSubmitted = true

      try {
        const data = {
          abbreviation: this.abbreviation,
          code: this.partner?.code ?? this.code,
          description: this.description,
          name: this.name,
          website: this.website,
        }

        const mutation = require(`~/gql/manage/${this.action}Partner.gql`)
        const response = await this.$apollo
          .mutate({
            mutation,
            variables: data,
          })
          .then(({ data }) => data && data[`${this.action}Partner`])

        if (response) {
          const code = this.code
          this.reset()
          this.$notificationManager.displaySuccessMessage(
            this.$t('success.PARTNER_CREATED')
          )
          this.$router.push({
            name: 'manage-partners-code',
            params: { code },
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

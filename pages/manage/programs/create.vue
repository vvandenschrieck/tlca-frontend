<template>
  <div>
    <h2>{{ title }}</h2>

    <ValidationObserver ref="form" v-slot="{ handleSubmit }">
      <v-form :disabled="formBusy" @submit.prevent="handleSubmit(create)">
        <v-alert v-if="formError" type="error" outlined dense class="mt-5">
          {{ $t(formError) }}
        </v-alert>

        <v-stepper non-linear vertical>
          <v-stepper-step editable step="1">
            {{ $t('general.information.general') }}
          </v-stepper-step>

          <v-stepper-content step="1">
            <v-row>
              <v-col cols="12" md="2">
                <v-text-field-with-validation
                  v-model="code"
                  vid="code"
                  required
                  rules="required|alpha_dash"
                  :label="$t('program.code')"
                />
              </v-col>

              <v-col cols="12" md="6">
                <v-text-field-with-validation
                  v-model="name"
                  vid="name"
                  required
                  rules="required"
                  :label="$t('program.name')"
                />
              </v-col>

              <v-col cols="12" md="2">
                <v-select-with-validation
                  v-model="type"
                  :items="types"
                  vid="type"
                  required
                  rules="required"
                  :label="$t('program.type._')"
                />
              </v-col>

              <v-col cols="12" md="2">
                <v-select-with-validation
                  v-model="visibility"
                  :items="visibilities"
                  vid="visibility"
                  required
                  rules="required"
                  :label="$t('program.visibility._')"
                />
              </v-col>
            </v-row>

            <v-row>
              <v-col cols="12" md="12">
                <v-textarea-with-validation
                  v-model="description"
                  vid="description"
                  required
                  rules="required"
                  :label="$t('program.description')"
                  filled
                  auto-grow
                  clearable
                />
              </v-col>
            </v-row>
          </v-stepper-content>

          <v-stepper-step editable step="2">
            {{ $t('program.courses._') }}
          </v-stepper-step>

          <v-stepper-content step="2">
            <select-program-courses v-model="courses" :disabled="formBusy" />
          </v-stepper-content>
        </v-stepper>
        <div class="text-right mt-5">
          <v-btn color="error" :disabled="formBusy" text @click="reset()">
            {{ $t('general.reset') }}
          </v-btn>
          <v-btn color="primary" :loading="formBusy" text type="submit">
            {{ $t('general.create') }}
          </v-btn>
        </div>
      </v-form>
    </ValidationObserver>
  </div>
</template>

<script>
import { ValidationObserver } from 'vee-validate'

import createProgram from '~/gql/manage/createProgram.gql'

export default {
  name: 'ManageCreateProgramPage',
  components: { ValidationObserver },
  data() {
    return {
      code: '',
      courses: [{}],
      description: '',
      formBusy: false,
      formError: null,
      name: '',
      type: '',
      visibility: '',
    }
  },
  head() {
    return {
      title: this.title,
    }
  },
  computed: {
    title() {
      return this.$tc('program.create', 2)
    },
    types() {
      const type = 'program.type'
      return [
        { text: this.$t(`${type}.uprogram`), value: 'UPROGRAM' },
        { text: this.$t(`${type}.training`), value: 'TRAINING' },
      ]
    },
    visibilities() {
      const visibility = 'program.visibility'
      return [
        { text: this.$t(`${visibility}.public`), value: 'PUBLIC' },
        { text: this.$t(`${visibility}.invite_only`), value: 'INVITE_ONLY' },
        { text: this.$t(`${visibility}.private`), value: 'PRIVATE' },
      ]
    },
  },
  methods: {
    async create() {
      this.formBusy = true

      try {
        const data = {
          code: this.code,
          courses: this.courses,
          description: this.description,
          name: this.name,
          type: this.type,
          visibility: this.visibility,
        }

        const response = await this.$apollo
          .mutate({
            mutation: createProgram,
            variables: data,
          })
          .then(({ data }) => data && data.createProgram)

        if (response) {
          const code = this.code
          this.reset()
          this.$notificationManager.displaySuccessMessage(
            this.$t('success.PROGRAM_CREATED')
          )
          this.$router.push({
            name: 'manage-programs-code',
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
    reset() {
      this.code = ''
      this.courses = [{}]
      this.description = ''
      this.formError = null
      this.name = ''
      this.type = ''
      this.visibility = ''
    },
  },
  meta: {
    roles: ['teacher'],
  },
}
</script>

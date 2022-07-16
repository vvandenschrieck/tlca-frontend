<template>
  <div>
    <h2>{{ $t('course.create') }}</h2>

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
                  :label="$t('course.code')"
                >
                </v-text-field-with-validation>
              </v-col>

              <v-col cols="12" md="6">
                <v-text-field-with-validation
                  v-model="name"
                  vid="name"
                  required
                  rules="required"
                  :label="$t('course.name')"
                >
                </v-text-field-with-validation>
              </v-col>

              <v-col cols="12" md="2">
                <v-select-with-validation
                  v-model="type"
                  :items="types"
                  vid="type"
                  required
                  rules="required"
                  :label="$t('course.type._')"
                ></v-select-with-validation>
              </v-col>

              <v-col cols="12" md="2">
                <v-select-with-validation
                  v-model="visibility"
                  :items="visibilities"
                  vid="visibility"
                  required
                  rules="required"
                  :label="$t('course.visibility._')"
                ></v-select-with-validation>
              </v-col>
            </v-row>

            <v-row>
              <v-col cols="12" md="12">
                <v-textarea-with-validation
                  v-model="description"
                  vid="description"
                  required
                  rules="required"
                  :label="$t('course.description')"
                  filled
                  auto-grow
                  clearable
                  clear-icon="mdi-close-circle"
                ></v-textarea-with-validation>
              </v-col>
            </v-row>
          </v-stepper-content>

          <v-stepper-step editable step="2">
            {{ $t('course.competencies._') }}
          </v-stepper-step>

          <v-stepper-content step="2">
            <select-course-competencies
              v-model="competencies"
              :disabled="formBusy"
            ></select-course-competencies>
          </v-stepper-content>
        </v-stepper>
        <div class="text-right mt-5">
          <v-btn
            v-t="'general.reset'"
            :disabled="formBusy"
            color="error"
            text
            @click="reset()"
          ></v-btn>
          <v-btn type="submit" :loading="formBusy" color="primary" text>
            {{ $t('general.create') }}
          </v-btn>
        </div>
      </v-form>
    </ValidationObserver>
  </div>
</template>

<script>
import { ValidationObserver } from 'vee-validate'

import createCourse from '~/gql/manage/createCourse.gql'

export default {
  name: 'ManageCreateCoursePage',
  components: { ValidationObserver },
  data() {
    return {
      code: '',
      competencies: [{}],
      description: '',
      formBusy: false,
      formError: null,
      name: '',
      type: '',
      visibility: '',
    }
  },
  computed: {
    types() {
      return [
        { text: this.$t('course.type.unit'), value: 'UNIT' },
        { text: this.$t('course.type.project'), value: 'PROJECT' },
        { text: this.$t('course.type.ucourse'), value: 'UCOURSE' },
        { text: this.$t('course.type.training'), value: 'TRAINING' },
      ]
    },
    visibilities() {
      return [
        { text: this.$t('course.visibility.public'), value: 'PUBLIC' },
        {
          text: this.$t('course.visibility.invite_only'),
          value: 'INVITE_ONLY',
        },
        { text: this.$t('course.visibility.private'), value: 'PRIVATE' },
      ]
    },
  },
  methods: {
    async create() {
      this.formBusy = true

      try {
        const data = {
          code: this.code,
          competencies: this.competencies,
          description: this.description,
          name: this.name,
          type: this.type,
          visibility: this.visibility,
        }

        const response = await this.$apollo
          .mutate({
            mutation: createCourse,
            variables: data,
          })
          .then(({ data }) => data && data.createCourse)

        if (response) {
          const code = this.code
          this.reset()
          this.$notificationManager.displaySuccessMessage(
            this.$t('success.COURSE_CREATED')
          )
          this.$router.push({
            name: 'manage-courses-code',
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
      this.competencies = []
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

<template>
  <div>
    <h2>{{ $t('course.create') }}</h2>

    <ValidationObserver ref="form" v-slot="{ handleSubmit }">
      <v-form :disabled="formBusy" @submit.prevent="handleSubmit(create)">
        <v-alert v-if="formError" class="mt-5" dense outlined type="error">
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
                  :label="$t('course.code')"
                  required
                  rules="required|alpha_dash"
                  vid="code"
                />
              </v-col>

              <v-col cols="12" md="6">
                <v-text-field-with-validation
                  v-model="name"
                  :label="$t('course.name')"
                  required
                  rules="required"
                  vid="name"
                />
              </v-col>

              <v-col cols="12" md="2">
                <v-select-with-validation
                  v-model="type"
                  :items="types"
                  :label="$t('course.type._')"
                  required
                  rules="required"
                  vid="type"
                />
              </v-col>

              <v-col cols="12" md="2">
                <v-select-with-validation
                  v-model="visibility"
                  :items="visibilities"
                  :label="$t('course.visibility._')"
                  required
                  rules="required"
                  vid="visibility"
                />
              </v-col>
            </v-row>

            <v-row>
              <v-col cols="12" md="12">
                <v-textarea-with-validation
                  v-model="description"
                  auto-grow
                  clearable
                  clear-icon="mdi-close-circle"
                  filled
                  :label="$t('course.description')"
                  required
                  rules="required"
                  vid="description"
                />
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
              vid="competencies"
            />
          </v-stepper-content>

          <v-stepper-step editable step="3">
            {{ $t('course.team') }}
          </v-stepper-step>

          <v-stepper-content step="3">
            <v-row>
              <v-col cols="12" md="9">
                <teachers-select-field v-model="teachers" class="mt-3" />
              </v-col>

              <v-col cols="12" md="3">
                <v-switch
                  v-model="hasTeachingGroup"
                  :disabled="teachers?.length === 0"
                  :label="$t('course.groups._')"
                  @change="switchTeachingGroup"
                ></v-switch>
              </v-col>
            </v-row>

            <v-row v-if="hasTeachingGroup">
              <v-col cols="12" md="12">
                <h3>{{ $t('course.groups._') }}</h3>

                <select-course-groups
                  v-model="groups.teaching"
                  class="mt-5"
                  :disabled="formBusy"
                  :teachers="teachers"
                  vid="teachingGroups"
                />
              </v-col>
            </v-row>
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
      groups: {
        teaching: [],
        working: [],
      },
      hasTeachingGroup: false,
      name: '',
      teachers: [],
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
      this.formError = null

      try {
        const data = {
          code: this.code,
          competencies: this.competencies,
          description: this.description,
          groups: this.groups,
          name: this.name,
          teachers: this.teachers,
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
      this.competencies = [{}]
      this.description = ''
      this.formError = null
      this.groups = {
        teaching: [],
        working: [],
      }
      this.hasTeachingGroup = false
      this.name = ''
      this.teachers = []
      this.type = ''
      this.visibility = ''
    },
    switchTeachingGroup(value) {
      if (!value) {
        this.groups.teaching = []
      }
    },
  },
  meta: {
    roles: ['teacher'],
  },
}
</script>

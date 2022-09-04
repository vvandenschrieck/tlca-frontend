<template>
  <div>
    <h2>{{ title }}</h2>

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
                  :items="courseTypes"
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
              class="mb-3"
              :disabled="formBusy"
              vid="competencies"
            />
          </v-stepper-content>

          <v-stepper-step editable step="3">
            {{ $t('general.information.additional') }}
          </v-stepper-step>

          <v-stepper-content step="3">
            <v-row>
              <v-col cols="12" md="3">
                <v-text-field
                  v-model="language"
                  clearable
                  :label="$t('course.language')"
                />
              </v-col>

              <v-col cols="12" md="3">
                <v-text-field
                  v-model="field"
                  clearable
                  :label="$t('course.field')"
                />
              </v-col>
            </v-row>

            <v-row>
              <v-col cols="12" md="6">
                <partner-select-field v-model="partners" />
              </v-col>

              <v-col cols="12" md="6">
                <v-combobox
                  v-model="tags"
                  append-icon=""
                  chips
                  clearable
                  deletable-chips
                  dense
                  :label="$tc('course.tags', 2)"
                  multiple
                  small-chips
                />
              </v-col>
            </v-row>

            <v-row>
              <v-col cols="12" md="12">
                <v-textarea
                  v-model="colophon"
                  auto-grow
                  clearable
                  clear-icon="mdi-close-circle"
                  filled
                  :label="$t('course.colophon')"
                  vid="colophon"
                />
              </v-col>
            </v-row>
          </v-stepper-content>

          <v-stepper-step editable step="4">
            {{ $t('course.load._') }}
          </v-stepper-step>

          <v-stepper-content step="4">
            <v-row>
              <v-col cols="12" md="4">
                <v-text-field
                  v-model="load.ects"
                  clearable
                  :label="$t('course.load.ects')"
                  type="number"
                />
              </v-col>
            </v-row>

            <v-row>
              <v-col cols="12" md="4">
                <v-select
                  v-model="loadType"
                  clearable
                  :items="loadTypes"
                  :label="$t('course.load.type._')"
                />
              </v-col>

              <v-col v-if="loadType === 'WEEKLY'" cols="12" md="4">
                <v-text-field-with-validation
                  v-model="load.weekload"
                  :hint="$t('general.in.hours')"
                  :label="$t('course.load.weekload')"
                  required
                  rules="required"
                  type="number"
                />
              </v-col>

              <v-col v-if="loadType === 'THEO_PRAC'" cols="12" md="4">
                <v-text-field-with-validation
                  v-model="load.theory"
                  :hint="$t('general.in.hours')"
                  :label="$t('course.load.theory')"
                  required
                  rules="required"
                  type="number"
                />
              </v-col>

              <v-col v-if="loadType === 'THEO_PRAC'" cols="12" md="4">
                <v-text-field-with-validation
                  v-model="load.practice"
                  :hint="$t('general.in.hours')"
                  :label="$t('course.load.practice')"
                  required
                  rules="required"
                  type="number"
                />
              </v-col>
            </v-row>
          </v-stepper-content>

          <v-stepper-step editable step="5">
            {{ $t('course.schedule._') }}
          </v-stepper-step>

          <v-stepper-content step="5">
            <v-row>
              <v-col cols="12" md="4">
                <v-text-field
                  v-model="span"
                  clearable
                  :hint="$t('general.in.weeks')"
                  :label="$t('course.span._')"
                  type="number"
                />
              </v-col>
            </v-row>

            <v-row>
              <v-col cols="12" md="4">
                <b>{{ $tc('course._', 1) }}</b>
              </v-col>

              <v-col cols="12" md="4">
                <b>{{ $tc('registration._', 1) }}</b>
              </v-col>

              <v-col cols="12" md="4">
                <b>{{ $tc('evaluation._', 1) }}</b>
              </v-col>
            </v-row>

            <v-row>
              <v-col cols="12" md="4">
                <date-time-picker-with-validation
                  v-model="schedule.start"
                  :label="$t('course.schedule.start')"
                  vid="schedule-start"
                />
              </v-col>

              <v-col cols="12" md="4">
                <date-time-picker-with-validation
                  v-model="schedule.registrationsStart"
                  :label="$t('course.schedule.registrationsStart')"
                  vid="schedule-registrationsStart"
                />
              </v-col>
            </v-row>

            <v-row>
              <v-col cols="12" md="4">
                <date-time-picker-with-validation
                  v-model="schedule.end"
                  :label="$t('course.schedule.end')"
                  vid="schedule-end"
                />
              </v-col>

              <v-col cols="12" md="4">
                <date-time-picker-with-validation
                  v-model="schedule.registrationsEnd"
                  :label="$t('course.schedule.registrationsEnd')"
                  vid="schedule-registrationsEnd"
                />
              </v-col>

              <v-col cols="12" md="4">
                <date-time-picker-with-validation
                  v-model="schedule.evaluationsEnd"
                  class="align-self-end d-block"
                  :label="$t('course.schedule.evaluationsEnd')"
                  vid="schedule-evaluationsEnd"
                />
              </v-col>
            </v-row>
          </v-stepper-content>

          <v-stepper-step editable step="6">
            {{ $t('course.progress_guide._') }}
          </v-stepper-step>

          <v-stepper-content step="6">
            <v-alert type="info" dense outlined>Upcoming feature</v-alert>
          </v-stepper-content>

          <v-stepper-step editable step="7">
            {{ $t('course.team') }}
          </v-stepper-step>

          <v-stepper-content step="7">
            <v-row>
              <v-col cols="12" md="7">
                <teachers-select-field v-model="teachers" class="mt-3" />
              </v-col>
            </v-row>

            <v-row>
              <v-col cols="12" md="12">
                <h3>{{ $t('course.groups.teaching._') }}</h3>

                <select-course-groups
                  v-model="groups.teaching"
                  class="mt-5"
                  :disabled="formBusy"
                  :teachers="teachers"
                  vid="teachingGroups"
                />

                <h3>{{ $t('course.groups.working._') }}</h3>

                <v-alert type="info" dense outlined>Upcoming feature</v-alert>
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
      colophon: '',
      competencies: [{}],
      description: '',
      field: '',
      formBusy: false,
      formError: null,
      groups: {
        teaching: [],
        working: [],
      },
      language: '',
      load: {
        ects: '',
        practice: '',
        theory: '',
        weekload: '',
      },
      loadType: '',
      name: '',
      partners: [],
      schedule: {
        end: '',
        evaluationsEnd: '',
        registrationsEnd: '',
        registrationsStart: '',
        start: '',
      },
      span: '',
      tags: [],
      teachers: [],
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
    courseTypes() {
      return [
        { text: this.$t('course.type.unit'), value: 'UNIT' },
        { text: this.$t('course.type.project'), value: 'PROJECT' },
        { text: this.$t('course.type.ucourse'), value: 'UCOURSE' },
        { text: this.$t('course.type.training'), value: 'TRAINING' },
      ]
    },
    loadTypes() {
      return [
        { text: this.$t('course.load.type.theo_prac'), value: 'THEO_PRAC' },
        { text: this.$t('course.load.type.weekly'), value: 'WEEKLY' },
      ]
    },
    title() {
      return this.$t('course.create')
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
  watch: {
    loadType(newLoadType, oldLoadType) {
      if (oldLoadType !== newLoadType) {
        switch (newLoadType) {
          case 'THEO_PRAC':
            this.load.weekload = ''
            break

          case 'WEEKLY':
            this.load.practice = ''
            this.load.theory = ''
            break

          default:
            this.load.practice = ''
            this.load.theory = ''
            this.load.weekload = ''
        }
      }
    },
    teachers(value) {
      if (!value?.length) {
        this.groups.teaching = []
      }
    },
  },
  methods: {
    async create() {
      this.formBusy = true
      this.formError = null

      const load = {}
      if (this.loadType) {
        load.type = this.loadType
      }
      for (const field of ['practice', 'theory', 'weekload']) {
        if (this[field]) {
          load[field] = parseInt(this[field], 10)
        }
      }

      const schedule = Object.entries(this.schedule)
        .map(([name, datetime]) => ({
          datetime,
          name,
        }))
        .filter((event) => event.datetime)

      const data = {
        code: this.code,
        colophon: this.colophon,
        competencies: this.competencies,
        description: this.description,
        field: this.field,
        groups: this.groups,
        language: this.language,
        load,
        name: this.name,
        partners: this.partners,
        schedule,
        span: parseInt(this.span, 10),
        tags: this.tags,
        teachers: this.teachers,
        type: this.type,
        visibility: this.visibility,
      }

      try {
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
      this.colophon = ''
      this.competencies = [{}]
      this.description = ''
      this.field = ''
      this.formError = null
      this.groups = {
        teaching: [],
        working: [],
      }
      this.language = ''
      this.load = {
        ects: '',
        practice: '',
        theory: '',
        weekload: '',
      }
      this.loadType = ''
      this.name = ''
      this.partners = []
      this.schedule = {
        end: '',
        evaluationsEnd: '',
        registrationsEnd: '',
        registrationsStart: '',
        start: '',
      }
      this.span = ''
      this.tags = []
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

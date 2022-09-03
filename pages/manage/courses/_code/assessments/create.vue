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
                  :label="$t('assessment.code')"
                  rules="alpha_dash"
                  vid="code"
                />
              </v-col>

              <v-col cols="12" md="8">
                <v-text-field-with-validation
                  v-model="name"
                  :label="$t('assessment.name')"
                  required
                  rules="required"
                  vid="name"
                />
              </v-col>

              <v-col cols="12" md="2">
                <v-select-with-validation
                  v-model="category"
                  :items="categories"
                  :label="$t('assessment.category._')"
                  required
                  rules="required"
                  vid="category"
                />
              </v-col>
            </v-row>

            <v-row>
              <v-col cols="12" md="12">
                <v-textarea-with-validation
                  v-model="description"
                  auto-grow
                  clearable
                  filled
                  :label="$t('assessment.description')"
                  required
                  rules="required"
                  vid="description"
                />
              </v-col>
            </v-row>
          </v-stepper-content>

          <v-stepper-step editable step="2">
            {{ $t('assessment.takes') }}
          </v-stepper-step>

          <v-stepper-content step="2">
            <v-row>
              <v-col cols="12" md="4">
                <v-text-field-with-validation
                  v-model="instances"
                  clearable
                  :hint="$t('general.max_nb')"
                  :label="$t('assessment.instances')"
                  rules="positive"
                  type="number"
                  vid="instances"
                />
              </v-col>

              <v-col cols="12" md="4">
                <v-switch
                  v-model="isIncremental"
                  class="ml-3"
                  dense
                  :label="$t('assessment.incremental')"
                />
              </v-col>
            </v-row>
          </v-stepper-content>

          <v-stepper-step editable step="3">
            {{ $t('assessment.competencies._') }}
          </v-stepper-step>

          <v-stepper-content step="3">
            <select-assessment-competencies
              v-model="competencies"
              class="mb-3"
              :disabled="formBusy"
              vid="competencies"
            />
          </v-stepper-content>

          <v-stepper-step editable step="4">
            {{ $t('assessment.schedule._') }}
          </v-stepper-step>

          <v-stepper-content step="4">
            <v-row>
              <v-col cols="12" md="6">
                <date-time-field-with-validation
                  v-model="start"
                  :label="$t('assessment.schedule.start')"
                  vid="start"
                />

                <date-time-field-with-validation
                  v-model="end"
                  :label="$t('assessment.schedule.end')"
                  vid="end"
                />
              </v-col>

              <v-col cols="12" md="1"></v-col>

              <v-col cols="12" md="5">
                <v-switch
                  v-model="createEvent"
                  :disabled="!canCreateEvent"
                  :label="$t('assessment.create_event')"
                />
              </v-col>
            </v-row>
          </v-stepper-content>

          <v-stepper-step editable step="5">
            {{ $t('general.information.additional') }}
          </v-stepper-step>

          <v-stepper-content step="5">
            <v-switch
              v-model="hasOralDefense"
              class="ml-3"
              dense
              :label="$t('assessment.oral_defense')"
            />
          </v-stepper-content>

          <v-stepper-step editable step="6">
            {{ $t('global.workload') }}
          </v-stepper-step>

          <v-stepper-content step="6">
            <v-row>
              <v-col cols="12" md="4">
                <b>{{ $tc('course.learner', 1) }}</b>
              </v-col>

              <v-col cols="12" md="4">
                <h4>{{ $tc('course.teacher', 1) }}</h4>
              </v-col>
            </v-row>

            <v-row class="mt-0">
              <v-col cols="12" md="4">
                <v-text-field-with-validation
                  v-model="load.work"
                  clearable
                  :label="$t('assessment.load.work')"
                  :hint="$t('general.in.minutes')"
                  rules="positive"
                  type="number"
                  vid="load-work"
                />
              </v-col>

              <v-col cols="12" md="4">
                <v-text-field-with-validation
                  v-model="load.grading"
                  clearable
                  :label="$t('assessment.load.grading')"
                  :hint="$t('general.in.minutes')"
                  rules="positive"
                  type="number"
                  vid="load-grading"
                />
              </v-col>

              <v-col cols="12" md="4">
                <v-text-field-with-validation
                  v-if="hasOralDefense"
                  v-model="load.defense"
                  clearable
                  :label="$t('assessment.load.defense')"
                  :hint="$t('general.in.minutes')"
                  rules="positive"
                  type="number"
                  vid="load-defense"
                />
              </v-col>
            </v-row>
          </v-stepper-content>
        </v-stepper>

        <div class="text-right mt-5">
          <v-btn color="error" :disabled="formBusy" text @click="reset">
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

import createAssessment from '~/gql/manage/createAssessment.gql'

export default {
  name: 'ManageCreateAssessmentPage',
  components: { ValidationObserver },
  data() {
    return {
      category: '',
      code: '',
      competencies: [{}],
      createEvent: false,
      description: '',
      end: '',
      formBusy: false,
      formError: null,
      hasOralDefense: false,
      instances: '',
      isIncremental: false,
      name: '',
      load: {
        defense: '',
        grading: '',
        work: '',
      },
      start: '',
    }
  },
  head() {
    return {
      title: this.title,
    }
  },
  computed: {
    canCreateEvent() {
      return this.start && this.end
    },
    categories() {
      const categories = [
        'quiz',
        'exercise',
        'coding',
        'mission',
        'project',
        'interview',
        'casestudy',
      ]
      return categories.map((c) => ({
        text: this.$t(`assessment.category.${c}`),
        value: c.toUpperCase(),
      }))
    },
    title() {
      return this.$t('assessment.create')
    },
  },
  methods: {
    async create() {
      this.formBusy = true

      const load = {}
      for (const field of ['defense', 'grading', 'work']) {
        if (this.load[field]) {
          load[field] = parseInt(this.load[field], 10)
        }
      }

      const data = {
        category: this.category,
        code: this.code,
        course: this.$route.params.code,
        competencies: this.competencies,
        createEvent: this.createEvent,
        description: this.description,
        end: this.end,
        incremental: this.isIncremental,
        instances: parseInt(this.instances, 10),
        load,
        name: this.name,
        oralDefense: this.hasOralDefense,
        start: this.start,
      }

      try {
        const response = await this.$apollo
          .mutate({
            mutation: createAssessment,
            variables: data,
          })
          .then(({ data }) => data && data.createAssessment)

        if (response) {
          const { id } = response
          this.reset()
          this.$notificationManager.displaySuccessMessage(
            this.$t('success.ASSESSMENT_CREATED')
          )
          this.$router.push({
            name: 'manage-courses-code-assessments-id',
            params: { code: this.$route.params.code, id },
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
      this.category = ''
      this.code = ''
      this.competencies = [{}]
      this.createEvent = false
      this.description = ''
      this.end = ''
      this.formError = null
      this.hasOralDefense = false
      this.instances = ''
      this.isIncremental = false
      this.name = ''
      this.load = {
        defense: '',
        grading: '',
        work: '',
      }
      this.start = ''
    },
  },
  meta: {
    roles: ['teacher'],
  },
}
</script>

<template>
  <ValidationObserver ref="form" v-slot="{ handleSubmit }">
    <v-form :disabled="formBusy" @submit.prevent="handleSubmit(submit)">
      <v-alert v-if="formError" class="mt-5" dense outlined type="error">
        {{ $t(formError) }}
      </v-alert>

      <v-stepper non-linear vertical>
        <stepper-step step="1" :title="$t('general.information.general')">
          <v-row>
            <v-col cols="12" md="2">
              <v-text-field-with-validation
                v-model="code"
                :label="$t('assessment.code')"
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
        </stepper-step>

        <stepper-step step="2" :title="$t('assessment.takes._')">
          <v-row>
            <v-col cols="12" md="4">
              <v-text-field-with-validation
                v-model="instances"
                clearable
                :hint="$t('general.max_nb')"
                :label="$tc('assessment.instance._', 2)"
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
                :label="$t('assessment.type.incremental')"
              />
            </v-col>

            <v-col cols="12" md="4">
              <v-text-field-with-validation
                v-if="isIncremental"
                v-model="takes"
                clearable
                :hint="$t('general.max_nb')"
                :label="$t('assessment.takes._')"
                rules="min_value:2"
                type="number"
                vid="takes"
              />
            </v-col>
          </v-row>

          <v-row>
            <v-col cols="12" md="4" />

            <v-col cols="12" md="4">
              <v-switch
                v-model="isPhased"
                class="ml-3"
                dense
                :label="$t('assessment.type.phased')"
              />
            </v-col>

            <v-col cols="12" md="4">
              <v-text-field-with-validation
                v-if="isPhased"
                v-model="nbPhases"
                clearable
                :label="$t('assessment.phase.nb')"
                rules="min_value:2"
                type="number"
                vid="nbPhases"
              />
            </v-col>
          </v-row>
        </stepper-step>

        <stepper-step step="3" :title="competenciesTitle">
          <select-assessment-competencies
            v-if="!isPhased"
            v-model="competencies"
            class="mb-3"
            :disabled="formBusy"
            vid="competencies"
          />

          <select-assessment-phases
            v-else
            v-model="phases"
            class="mb-3"
            :disabled="formBusy"
            :nb="parseInt(nbPhases, 10)"
            vid="phases"
          />
        </stepper-step>

        <stepper-step step="4" :title="$t('assessment.schedule._')">
          <v-row>
            <v-col cols="12" md="6">
              <date-time-picker-with-validation
                v-model="start"
                :label="$t('assessment.schedule.start')"
                vid="start"
              />

              <date-time-picker-with-validation
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
        </stepper-step>

        <stepper-step step="5" :title="$t('general.information.additional')">
          <v-row>
            <v-col cols="12" md="6">
              <v-switch
                v-model="hasOralDefense"
                class="ml-3"
                dense
                :label="$t('assessment.oral_defense')"
              />
            </v-col>

            <v-col cols="12" md="6">
              <v-switch
                v-model="evaluationRequest"
                class="ml-3"
                dense
                :label="$t('assessment.evaluation_request')"
              />
            </v-col>
          </v-row>
        </stepper-step>

        <stepper-step step="6" :title="$t('global.workload')">
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
        </stepper-step>
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
  name: 'FormAssessment',
  components: { ValidationObserver },
  props: {
    assessment: {
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
      category: '',
      code: '',
      competencies: [{}],
      createEvent: false,
      description: '',
      end: '',
      evaluationRequest: false,
      formBusy: false,
      formError: null,
      hasOralDefense: false,
      instances: '',
      isIncremental: false,
      isPhased: false,
      name: '',
      nbPhases: '',
      load: {
        defense: '',
        grading: '',
        work: '',
      },
      phases: [],
      start: '',
      takes: '',
    }
  },
  computed: {
    action() {
      return !this.edit ? 'create' : 'edit'
    },
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
    competenciesTitle() {
      return !this.isPhased
        ? this.$t('assessment.competencies._')
        : this.$tc('assessment.phase._', this.nbPhases)
    },
    courseCode() {
      return this.$route.params.code
    },
  },
  mounted() {
    this.reset()
  },
  methods: {
    reset() {
      const assessment = this.assessment
      const load = assessment?.load

      this.category = assessment?.category ?? ''
      this.code = assessment?.code ?? ''
      this.competencies = assessment?.competencies.map((c) => ({
        ...c,
        checklist: c.checklist
          ? {
              private: c.checklist.private ?? undefined,
              public: c.checklist.public ?? undefined,
              __typename: undefined,
            }
          : undefined,
        competency: c.competency.code,
        __typename: undefined,
      })) ?? [{}]
      //   this.createEvent = false
      this.description = assessment?.description ?? ''
      this.end = assessment?.end ?? ''
      this.evaluationRequest = assessment?.evaluationRequest ?? false
      this.hasOralDefense = assessment?.hasOralDefense ?? false
      this.instances = assessment?.instances ?? ''
      this.isIncremental = assessment?.isIncremental ?? false
      this.isPhased = false
      this.name = assessment?.name ?? ''
      this.nbPhases = ''
      this.load = {
        defense: load?.defense ?? '',
        grading: load?.grading ?? '',
        work: load?.work ?? '',
      }
      this.start = assessment?.start ?? ''
      this.takes = assessment?.takes ?? ''
    },
    resetForm() {
      this.reset()
      this.formError = null
      this.$refs.form.reset()
    },
    async submit() {
      this.formBusy = true

      const load = {}
      for (const field of ['defense', 'grading', 'work']) {
        if (this.load[field]) {
          load[field] = parseInt(this.load[field], 10)
        }
      }
      const cleanCompetencies = (c) => ({
        ...c,
        isOptional: undefined,
        optional: c.isOptional,
      })
      const competencies = !this.isPhased
        ? this.competencies.map(cleanCompetencies)
        : undefined
      const phases = this.isPhased
        ? this.phases.map((p) => ({
            ...p,
            competencies: p.competencies.map(cleanCompetencies),
          }))
        : undefined

      const data = {
        category: this.category,
        code: this.code,
        competencies,
        createEvent: this.createEvent,
        description: this.description,
        end: this.end,
        evaluationRequest: this.evaluationRequest,
        incremental: this.isIncremental,
        instances: parseInt(this.instances, 10),
        load,
        name: this.name,
        oralDefense: this.hasOralDefense,
        phased: this.isPhased,
        phases,
        start: this.start,
        takes: parseInt(this.takes, 10),
      }

      if (this.edit) {
        data.id = this.assessment.id
      } else {
        data.course = this.courseCode
      }
      const mutation = require(`~/gql/manage/${this.action}Assessment.gql`)

      try {
        const response = await this.$apollo
          .mutate({
            mutation,
            variables: data,
          })
          .then(({ data }) => data && data[`${this.action}Assessment`])

        if (response) {
          const { id } = response
          this.reset()
          this.$notificationManager.displaySuccessMessage(
            this.$t(`success.ASSESSMENT_${this.action.toUpperCase()}`)
          )
          this.$router.push({
            name: 'manage-courses-code-assessments-id',
            params: { code: this.courseCode, id },
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

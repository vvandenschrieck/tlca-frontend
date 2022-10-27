<template>
  <ValidationObserver ref="form" v-slot="{ handleSubmit }">
    <v-form :disabled="formBusy" @submit.prevent="handleSubmit(submit)">
      <v-alert v-if="formError" class="mt-5" dense outlined type="error">
        {{ $t(formError) }}
      </v-alert>

      <v-stepper non-linear vertical>
        <v-alert
          v-if="course?.isPublished"
          class="ma-3"
          dense
          outlined
          type="warning"
        >
          {{ $t('course.edit.warning') }}
        </v-alert>

        <stepper-step step="1" :title="$t('general.information.general')">
          <v-row>
            <v-col cols="12" md="2">
              <v-text-field-with-validation
                v-model="code"
                :disabled="edit"
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
        </stepper-step>

        <stepper-step step="2" :title="$t('course.competencies._')">
          <select-course-competencies
            v-model="competencies"
            class="mb-3"
            :disabled="formBusy"
            vid="competencies"
          />
        </stepper-step>

        <stepper-step step="3" :title="$t('general.information.additional')">
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
        </stepper-step>

        <stepper-step step="4" :title="$t('course.load._')">
          <v-row>
            <v-col cols="12" md="4">
              <v-text-field-with-validation
                v-model="load.ects"
                clearable
                :label="$t('course.load.ects')"
                rules="positive"
                type="number"
                vid="load-ects"
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
                vid="load-type"
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
                vid="load-weekload"
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
                vid="load-theory"
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
                vid="load-practice"
              />
            </v-col>
          </v-row>
        </stepper-step>

        <stepper-step step="5" :title="$t('course.schedule._')">
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
        </stepper-step>

        <stepper-step step="6" :title="$t('course.progress_guide._')">
          <v-alert type="info" dense outlined>Upcoming feature</v-alert>
        </stepper-step>

        <stepper-step step="7" :title="$t('course.team')">
          <v-row>
            <v-col cols="12" md="7">
              <teachers-select-field v-model="teachers" class="mt-3" />
            </v-col>
          </v-row>

          <v-row>
            <v-col cols="12" md="12">
              <h3>{{ $t('course.groups.teaching._') }}</h3>

              <select-course-teaching-groups
                v-model="groups.teaching"
                :disabled="formBusy"
                :teachers="teachers"
                vid="groups-teaching"
              />

              <h3>{{ $t('course.groups.working._') }}</h3>

              <select-course-working-groups
                v-model="groups.working"
                :disabled="formBusy"
                vid="groups-working"
              />
            </v-col>
          </v-row>
        </stepper-step>
      </v-stepper>

      <div class="text-right mt-5">
        <reset-btn :disabled="formBusy" @click="resetForm" />
        <submit-btn :action="action" :loading="formBusy" />
      </div>
    </v-form>
  </ValidationObserver>
</template>

<script>
import { ValidationObserver } from 'vee-validate'

export default {
  name: 'FormCourse',
  components: { ValidationObserver },
  props: {
    course: {
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
  computed: {
    action() {
      return !this.edit ? 'create' : 'edit'
    },
    courseTypes() {
      return ['UNIT', 'PROJECT', 'UCOURSE', 'TRAINING'].map((value) => ({
        text: this.$t(`course.type.${value.toLowerCase()}`),
        value,
      }))
    },
    loadTypes() {
      return ['THEO_PRAC', 'WEEKLY'].map((value) => ({
        text: this.$t(`course.load.type.${value.toLowerCase()}`),
        value,
      }))
    },
    visibilities() {
      return ['PUBLIC', 'INVITE_ONLY', 'PRIVATE'].map((value) => ({
        text: this.$t(`course.visibility.${value.toLowerCase()}`),
        value,
      }))
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
  mounted() {
    this.reset()
  },
  methods: {
    reset() {
      const course = this.course

      // Initialise the groups.
      const groups = {
        teaching: [],
        working: [],
      }
      if (course?.groups) {
        if (course.groups.teaching) {
          groups.teaching = course.groups.teaching.map((g) => ({
            ...g,
            supervisor: g.supervisor.username,
            __typename: undefined,
          }))
        }
        if (course.groups.working) {
          groups.working = course.groups.working.map((g) => ({
            ...g,
            __typename: undefined,
          }))
        }
      }

      // Initialise the schedule.
      const schedule = {
        end: '',
        evaluationsEnd: '',
        registrationsEnd: '',
        registrationsStart: '',
        start: '',
      }
      if (course?.schedule) {
        for (const item of course.schedule) {
          schedule[item.name] = item.datetime
        }
      }

      // Initialise all the fields of the course.
      this.code = course?.code ?? ''
      this.colophon = course?.colophon ?? ''
      this.competencies = course?.competencies.map((c) => ({
        ...c,
        competency: c.competency.code,
        __typename: undefined,
      })) ?? [{}]
      this.description = course?.description ?? ''
      this.field = course?.field ?? ''
      this.groups = groups
      this.language = course?.language ?? ''
      this.load = {
        ects: course?.load?.ects ?? '',
        practice: course?.load?.practice ?? '',
        theory: course?.load?.theory ?? '',
        weekload: course?.load?.weekload ?? '',
      }
      this.loadType = course?.load?.type ?? ''
      this.name = course?.name ?? ''
      this.partners = course?.partners?.map((p) => p.code) ?? []
      this.schedule = schedule
      this.span = course?.span ?? ''
      this.tags = course?.tags ?? []
      this.teachers = course?.teachers?.map((t) => t.username) ?? []
      this.type = course?.type ?? ''
      this.visibility = course?.visibility ?? ''
    },
    resetForm() {
      this.reset()
      this.formError = null
      this.$refs.form.reset()
    },
    async submit() {
      this.formBusy = true

      const groups = {
        teaching: this.groups.teaching,
        working: this.groups.working.map((g) => ({
          ...g,
          size: parseInt(g.size, 10),
        })),
      }

      const load = {}
      if (this.loadType) {
        load.type = this.loadType
      }
      for (const field of ['ects', 'practice', 'theory', 'weekload']) {
        if (this.load[field]) {
          load[field] = parseInt(this.load[field], 10)
        }
      }

      const schedule = Object.entries(this.schedule)
        .map(([name, datetime]) => ({
          datetime,
          name,
        }))
        .filter((event) => event.datetime)

      const data = {
        code: this.course?.code ?? this.code,
        colophon: this.colophon,
        competencies: this.competencies,
        description: this.description,
        field: this.field,
        groups,
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
      const mutation = require(`~/gql/manage/${this.action}Course.gql`)

      try {
        const response = await this.$apollo
          .mutate({
            mutation,
            variables: data,
          })
          .then(({ data }) => data && data[`${this.action}Course`])

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
    switchTeachingGroup(value) {
      if (!value) {
        this.groups.teaching = []
      }
    },
  },
}
</script>

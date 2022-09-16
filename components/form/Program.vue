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
                :disabled="edit"
                :label="$t('program.code')"
                required
                rules="required|alpha_dash"
                vid="code"
              />
            </v-col>

            <v-col cols="12" md="6">
              <v-text-field-with-validation
                v-model="name"
                :label="$t('program.name')"
                required
                rules="required"
                vid="name"
              />
            </v-col>

            <v-col cols="12" md="2">
              <v-select-with-validation
                v-model="type"
                :items="types"
                :label="$t('program.type._')"
                required
                rules="required"
                vid="type"
              />
            </v-col>

            <v-col cols="12" md="2">
              <v-select-with-validation
                v-model="visibility"
                :items="visibilities"
                :label="$t('program.visibility._')"
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
                filled
                :label="$t('program.description')"
                required
                rules="required"
                vid="description"
              />
            </v-col>
          </v-row>
        </stepper-step>

        <stepper-step step="2" :title="$t('program.courses._')">
          <select-program-courses
            v-model="courses"
            :disabled="formBusy"
            vid="courses"
          />
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
  name: 'FormProgram',
  components: { ValidationObserver },
  props: {
    program: {
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
      courses: [{}],
      description: '',
      formBusy: false,
      formError: null,
      name: '',
      type: '',
      visibility: '',
    }
  },
  computed: {
    action() {
      return !this.edit ? 'create' : 'edit'
    },
    types() {
      return ['UPROGRAM', 'UNIT', 'TRAINING'].map((value) => ({
        text: this.$t(`program.type.${value.toLowerCase()}`),
        value,
      }))
    },
    visibilities() {
      return ['PUBLIC', 'INVITE_ONLY', 'PRIVATE'].map((value) => ({
        text: this.$t(`program.visibility.${value.toLowerCase()}`),
        value,
      }))
    },
  },
  mounted() {
    this.reset()
  },
  methods: {
    reset() {
      const program = this.program

      this.code = program?.code ?? ''
      this.courses = program?.courses.map((c) => ({
        ...c,
        course: c.course.code,
        __typename: undefined,
      })) ?? [{}]
      this.description = program?.description ?? ''
      this.name = program?.name ?? ''
      this.type = program?.type ?? ''
      this.visibility = program?.visibility ?? ''
    },
    resetForm() {
      this.reset()
      this.formError = null
      this.$refs.form.reset()
    },
    async submit() {
      this.formBusy = true

      const data = {
        code: this.program?.code ?? this.code,
        courses: this.courses.map((c) => ({
          ...c,
          isOptional: undefined,
          optional: c.isOptional,
        })),
        description: this.description,
        name: this.name,
        type: this.type,
        visibility: this.visibility,
      }
      const mutation = require(`~/gql/manage/${this.action}Program.gql`)

      try {
        const response = await this.$apollo
          .mutate({
            mutation,
            variables: data,
          })
          .then(({ data }) => data && data[`${this.action}Program`])

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
  },
}
</script>

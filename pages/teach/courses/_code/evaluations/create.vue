<template>
  <ApolloQuery
    v-slot="{ result: { data, error }, isLoading }"
    :query="require('~/gql/teach/getEvaluations.gql')"
    :variables="{ courseCode: $route.params.code }"
    @result="setTitle"
  >
    <h2>{{ title }}</h2>

    <v-row v-if="!error">
      <v-col cols="12" md="9">
        <v-progress-linear v-if="!!isLoading" :indeterminate="true" />

        <ValidationObserver v-if="data" ref="form" v-slot="{ handleSubmit }">
          <v-form :disabled="formBusy" @submit.prevent="handleSubmit(create)">
            <v-alert v-if="formError" class="mt-5" dense outlined type="error">
              {{ $t(formError) }}
            </v-alert>

            {{ data.course.code }}

            <v-row>
              <v-col cols="12" md="6">
                <learner-select-field
                  v-model="learner"
                  :course-code="data.course.code"
                  :disabled="formLoading"
                  @change="updateForm"
                />
              </v-col>

              <v-col cols="12" md="6">
                <assessment-select-field
                  v-model="assessment"
                  :course-code="data.course.code"
                  :disabled="formLoading"
                  @change="updateForm"
                />
              </v-col>
            </v-row>

            <div v-if="formLoading">{{ $t('global.loading') }}</div>

            <div v-show="showAllForm">
              <v-row>
                <v-col cols="12" md="6">
                  <date-time-picker-with-validation
                    v-model="evalDate"
                    :label="$t('evaluation.date')"
                    vid="evalDate"
                  />
                </v-col>
              </v-row>

              <v-row>
                <v-col cols="12" md="12">
                  <v-textarea
                    v-model="comment"
                    auto-grow
                    clear-icon="mdi-close-circle"
                    clearable
                    filled
                    :label="$t('evaluation.comment')"
                  />
                </v-col>
              </v-row>

              <div class="text-right mt-5">
                <v-btn
                  v-t="'general.reset'"
                  :disabled="formBusy"
                  color="error"
                  text
                  @click="reset"
                />
                <v-btn
                  v-t="'general.create'"
                  type="submit"
                  :loading="formBusy"
                  color="primary"
                  text
                />
              </div>
            </div>
          </v-form>
        </ValidationObserver>
      </v-col>

      <v-col
        cols="12"
        md="3"
        :order="$vuetify.breakpoint.smAndDown ? 'first' : undefined"
      >
        <course-schedule-panel
          v-if="!!isLoading || data?.course.schedule"
          :loading="!!isLoading"
          :schedule="data?.course.schedule"
        />
      </v-col>
    </v-row>

    <div v-else-if="error">{{ $t('error.unexpected') }}</div>
  </ApolloQuery>
</template>

<script>
import { ValidationObserver } from 'vee-validate'
import createEvaluation from '~/gql/teach/createEvaluation.gql'
import getLearnerEvaluations from '~/gql/teach/getLearnerEvaluations.gql'

export default {
  name: 'TeachCreateEvaluationPage',
  components: { ValidationObserver },
  data() {
    return {
      assessment: null,
      comment: '',
      evalDate: '',
      formBusy: false,
      formError: null,
      formLoading: false,
      learner: null,
      showAllForm: false,
      title: '',
    }
  },
  head() {
    return {
      title: this.title,
    }
  },
  methods: {
    async create() {
      this.formBusy = true

      const data = {
        assessment: this.assessment,
        comment: this.comment,
        evalDate: this.evalDate,
        learner: this.learner,
      }

      try {
        const response = await this.$apollo
          .mutate({
            mutation: createEvaluation,
            variables: data,
          })
          .then(({ data }) => data && data.createEvaluation)

        if (response) {
          const id = response.id
          this.reset()
          this.$notificationManager.displaySuccessMessage(
            this.$t('success.EVALUATION_CREATED')
          )
          this.$router.push({
            name: 'teach-courses-code-evaluations-id',
            params: { id },
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
      this.assessment = null
      this.comment = ''
      this.evalDate = ''
      this.formError = null
      this.learner = null
      this.showAllForm = false
    },
    setTitle({ data }) {
      this.title = data?.course?.name || ''
    },
    async updateForm() {
      this.showAllForm = false

      if (this.assessment && this.learner) {
        this.formLoading = true
        const evaluations = await this.$apollo
          .query({
            query: getLearnerEvaluations,
            variables: {
              assessment: this.assessment,
              courseCode: this.$route.params.code,
              learner: this.learner,
            },
          })
          .then(({ data }) => data.evaluations)

        this.formLoading = false
        this.showAllForm = true
        console.log(evaluations)
      }
    },
  },
  meta: {
    roles: ['teacher'],
  },
}
</script>

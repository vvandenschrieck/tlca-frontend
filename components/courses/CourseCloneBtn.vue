<template>
  <ApolloMutation
    v-if="canClone"
    v-slot="{ loading, mutate }"
    :mutation="require('../../gql/manage/cloneCourse.gql')"
    :variables="{ cloneCode: code, code: course.code }"
    @done="success"
    @error="error"
  >
    <v-dialog
      v-model="dialog"
      :fullscreen="$vuetify.breakpoint.xsOnly"
      max-width="500"
      :persistent="loading"
    >
      <template #activator="{ on, attrs }">
        <v-btn color="primary" small v-bind="attrs" v-on="on">
          <v-icon left>mdi-archive</v-icon>
          <span>{{ $t('course.clone._') }}</span>
        </v-btn>
      </template>

      <v-card>
        <ValidationObserver ref="form" v-slot="{ handleSubmit }">
          <v-form :disabled="loading" @submit.prevent="handleSubmit(mutate)">
            <v-card-title class="text-h5" dense>
              {{ $t('course.clone._') }}
            </v-card-title>

            <v-card-text>
              <v-alert v-if="formError" dense outlined type="error">
                {{ $t(formError) }}
              </v-alert>

              <div class="text--primary">
                {{ $t('course.clone.dialog_instructions') }}
              </div>

              <v-text-field-with-validation
                v-model="code"
                autofocus
                :label="$t('course.code')"
                rules="alpha_dash"
                vid="code"
              />
            </v-card-text>

            <v-card-actions>
              <v-spacer></v-spacer>

              <v-btn color="error" :disabled="loading" text @click="reset">
                {{ $t('general.cancel') }}
              </v-btn>
              <v-btn type="submit" color="primary" :loading="loading" text>
                {{ $t('course.clone._') }}
              </v-btn>
            </v-card-actions>
          </v-form>
        </ValidationObserver>
      </v-card>
    </v-dialog>
  </ApolloMutation>
</template>

<script>
import { ValidationObserver } from 'vee-validate'

export default {
  name: 'CourseCloneBtn',
  components: { ValidationObserver },
  props: {
    course: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      code: '',
      dialog: false,
      formError: null,
    }
  },
  computed: {
    canClone() {
      return this.course.status === 'ARCHIVED'
    },
  },
  watch: {
    dialog(value) {
      if (!value) {
        this.reset()
      }
    },
  },
  methods: {
    error(err) {
      if (err.graphQLErrors?.length) {
        const gqlError = err.graphQLErrors[0]
        if (gqlError.extensions?.formErrors) {
          this.$refs.form.setErrors(gqlError.extensions.formErrors)
        } else {
          this.formError = `error.${gqlError.message}`
        }
      }

      if (!this.formError) {
        this.formError = 'error._'
      }
    },
    reset() {
      this.code = ''
      this.dialog = false
      this.formError = null
    },
    success({ data: { cloneCourse: course } }) {
      this.reset()
      this.$emit('success', course)
    },
  },
}
</script>

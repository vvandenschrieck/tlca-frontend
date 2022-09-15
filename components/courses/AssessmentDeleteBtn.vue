<template>
  <ApolloMutation
    v-if="canDelete"
    v-slot="{ mutate, loading }"
    :mutation="require('../../gql/manage/deleteAssessment.gql')"
    :variables="{ id: assessment.id }"
    @done="success"
  >
    <v-dialog
      v-model="dialog"
      :fullscreen="$vuetify.breakpoint.xsOnly"
      max-width="290"
      :persistent="loading"
    >
      <template #activator="{ on, attrs }">
        <v-btn small color="error" v-bind="attrs" v-on="on">
          <v-icon left>mdi-delete</v-icon>
          <span>{{ $t('assessment.delete._') }}</span>
        </v-btn>
      </template>

      <v-card>
        <v-card-title class="text-h5">
          {{ $t('general.confirmation') }}
        </v-card-title>

        <v-card-text>
          {{ $t('assessment.delete.dialog_instructions') }}
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>

          <v-btn :disabled="loading" text @click="cancel">
            {{ $t('general.cancel') }}
          </v-btn>

          <v-btn :disabled="loading" :loading="loading" text @click="mutate">
            {{ $t('general.delete') }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </ApolloMutation>
</template>

<script>
export default {
  name: 'AssessmentDeleteBtn',
  props: {
    assessment: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      dialog: false,
    }
  },
  computed: {
    canDelete() {
      return !this.assessment.evaluations?.length
    },
  },
  methods: {
    cancel() {
      this.dialog = false
    },
    success({ data: { deleteAssessment } }) {
      this.dialog = false
      this.$emit(deleteAssessment ? 'success' : 'error')
    },
  },
}
</script>

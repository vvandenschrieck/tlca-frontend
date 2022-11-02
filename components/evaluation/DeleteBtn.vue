<template>
  <ApolloMutation
    v-slot="{ loading, mutate }"
    :mutation="require('~/gql/teach/deleteEvaluation.gql')"
    tag="span"
    :variables="{ id: evaluationId }"
    @done="success"
  >
    <confirm-dialog
      ref="dialog"
      v-slot="{ on, attrs }"
      :action="$t('general.delete')"
      :loading="loading"
      :text="$t('evaluation.delete.dialog_instructions')"
      @confirm="mutate"
    >
      <v-btn icon small v-bind="attrs" v-on="on">
        <v-icon small>mdi-delete</v-icon>
      </v-btn>
    </confirm-dialog>
  </ApolloMutation>
</template>

<script>
export default {
  name: 'EvaluationDeleteBtn',
  props: {
    evaluationId: {
      type: String,
      required: true,
    },
  },
  methods: {
    success({ data: { deleteEvaluation } }) {
      this.$refs.dialog.close()
      this.$emit(deleteEvaluation ? 'success' : 'error')
    },
  },
}
</script>

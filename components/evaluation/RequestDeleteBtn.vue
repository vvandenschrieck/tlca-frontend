<template>
  <ApolloMutation
    v-slot="{ loading, mutate }"
    :mutation="require('~/gql/learn/deleteEvaluationRequest.gql')"
    tag="span"
    :variables="{ id: evaluationId }"
    @done="success"
  >
    <confirm-dialog
      ref="dialog"
      v-slot="{ on, attrs }"
      :action="$t('general.delete')"
      :loading="loading"
      :text="$t('evaluation.request.delete.dialog_instructions')"
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
  name: 'EvaluationRequestDeleteBtn',
  props: {
    evaluationId: {
      type: String,
      required: true,
    },
  },
  methods: {
    success({ data: { deleteEvaluationRequest } }) {
      this.$refs.dialog.close()
      this.$emit(deleteEvaluationRequest ? 'success' : 'error')
    },
  },
}
</script>

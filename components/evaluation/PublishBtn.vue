<template>
  <ApolloMutation
    v-slot="{ loading, mutate }"
    :mutation="require('../../gql/teach/publishEvaluation.gql')"
    tag="span"
    :variables="{ id: evaluationId }"
    @done="done"
  >
    <v-btn icon :loading="loading" small @click.stop="mutate">
      <v-icon small>mdi-cloud-upload</v-icon>
    </v-btn>
  </ApolloMutation>
</template>

<script>
export default {
  name: 'EvaluationPublishBtn',
  props: {
    evaluationId: {
      type: String,
      required: true,
    },
  },
  methods: {
    done({ data: { publishEvaluation } }) {
      this.$emit(publishEvaluation ? 'success' : 'error')
    },
  },
}
</script>

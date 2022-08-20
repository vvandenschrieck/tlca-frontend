<template>
  <ApolloMutation
    v-if="canPublish"
    v-slot="{ mutate, loading }"
    :mutation="require('../../gql/teach/publishEvaluation.gql')"
    :variables="{ id: evaluation.id }"
    @done="success"
  >
    <v-btn color="primary" :loading="loading" small @click="mutate">
      <v-icon left>mdi-cloud-upload</v-icon>
      <span>{{ $t('evaluation.publish') }}</span>
    </v-btn>
  </ApolloMutation>
</template>

<script>
export default {
  name: 'EvaluationPublishBtn',
  props: {
    evaluation: {
      type: Object,
      required: true,
    },
  },
  computed: {
    canPublish() {
      return this.evaluation.status === 'UNPUBLISHED'
    },
  },
  methods: {
    success({ data: { publishEvaluation: evaluation } }) {
      this.$emit('success', evaluation)
    },
  },
}
</script>

<template>
  <ApolloMutation
    v-slot="{ mutate, loading }"
    :mutation="require('../../gql/manage/openCloseAssessment.gql')"
    tag="span"
    :variables="{ id }"
  >
    <v-btn icon :loading="loading" small @click.stop="mutate">
      <v-icon small>{{ isClosed ? 'mdi-lock' : 'mdi-lock-open' }}</v-icon>
    </v-btn>
  </ApolloMutation>
</template>

<script>
export default {
  name: 'AssessmentOpenCloseBtn',
  props: {
    id: {
      type: String,
      required: true,
    },
    isClosed: {
      type: Boolean,
      required: true,
    },
  },
}
</script>

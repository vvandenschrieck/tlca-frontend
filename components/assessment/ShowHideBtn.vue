<template>
  <ApolloMutation
    v-slot="{ mutate, loading }"
    :mutation="require('../../gql/manage/showHideAssessment.gql')"
    tag="span"
    :variables="{ id }"
  >
    <v-btn icon :loading="loading" small @click.stop="mutate">
      <v-icon small>{{ isHidden ? 'mdi-eye-off' : 'mdi-eye' }}</v-icon>
    </v-btn>
  </ApolloMutation>
</template>

<script>
export default {
  name: 'AssessmentShowHideBtn',
  props: {
    id: {
      type: String,
      required: true,
    },
    isHidden: {
      type: Boolean,
      required: true,
    },
  },
}
</script>

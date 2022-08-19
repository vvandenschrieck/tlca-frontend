<template>
  <ApolloMutation
    v-if="canPublish"
    v-slot="{ mutate, loading }"
    :mutation="require('../../gql/manage/publishProgram.gql')"
    :variables="{ code: program.code }"
    @done="success"
  >
    <v-btn color="primary" :loading="loading" small @click="mutate">
      <v-icon left>mdi-cloud-upload</v-icon>
      <span>{{ $t('program.publish') }}</span>
    </v-btn>
  </ApolloMutation>
</template>

<script>
export default {
  name: 'ProgramPublishBtn',
  props: {
    program: {
      type: Object,
      required: true,
    },
  },
  computed: {
    canPublish() {
      return this.program.status === 'UNPUBLISHED'
    },
  },
  methods: {
    success({ data: { publishProgram: program } }) {
      this.$emit('success', program)
    },
  },
}
</script>

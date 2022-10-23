<template>
  <ApolloQuery
    v-slot="{ isLoading, result: { error } }"
    :query="require('~/gql/cards/getResourcesInfo.gql')"
    :update="(data) => data.resources"
    :variables="{ courseCode }"
    @result="setResult"
  >
    <generic-info-card
      icon="mdi-file-document"
      :loading="!!isLoading"
      :title="$tc('resource._', 2)"
    >
      <div v-if="!error">
        <resources-list :items="resources" />
      </div>
    </generic-info-card>
  </ApolloQuery>
</template>

<script>
export default {
  name: 'ResourcesInfoCard',
  props: {
    courseCode: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      resources: null,
    }
  },
  methods: {
    setResult({ data: resources }) {
      this.resources = resources
    },
  },
}
</script>

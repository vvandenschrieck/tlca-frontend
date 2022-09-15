<template>
  <ApolloQuery
    v-slot="{ isLoading, result: { data, error } }"
    :query="require('~/gql/cards/getProgressInfo.gql')"
    :variables="{ courseCode }"
  >
    <generic-info-card
      icon="mdi-progress-check"
      :link="{
        icon: 'mdi-view-list',
        text: $tc('competency._', 2),
        to: {
          name: 'learn-courses-code-competencies',
          params: { code: courseCode },
        },
      }"
      :loading="!!isLoading"
      :title="$t('registration.progress')"
    >
      <v-row v-if="!error">
        <v-col
          v-if="data?.registration"
          class="d-flex justify-space-around mt-3"
          cols="12"
          md="8"
        >
          <competencies-progress
            :label="$t('competency.category.basic')"
            :value="data.registration.progress.basic"
          />
          <competencies-progress
            :label="$t('competency.category.advanced')"
            :value="data.registration.progress.advanced"
          />
        </v-col>

        <v-col cols="12" md="4" class="text-center"></v-col>
      </v-row>

      <span v-else>{{ $t('error.unexpected') }}</span>
    </generic-info-card>
  </ApolloQuery>
</template>

<script>
export default {
  name: 'ProgressInfoCard',
  props: {
    courseCode: {
      type: String,
      required: true,
    },
  },
}
</script>

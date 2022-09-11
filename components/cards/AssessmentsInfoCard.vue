<template>
  <ApolloQuery
    v-slot="{ isLoading, result: { data, error } }"
    :query="require('~/gql/cards/getAssessmentsInfo.gql')"
    :variables="{ courseCode }"
  >
    <generic-info-card
      icon="mdi-clipboard"
      :link="link"
      :loading="!!isLoading"
      :title="$tc('assessment._', 2)"
    >
      <div v-if="!error">
        <div v-if="data?.assessments?.length">
          <v-simple-table dense>
            <tbody>
              <tr>
                <td class="pa-0 text-center"></td>
                <td class="pl-2">{{ $tc('assessment._', 2) }}</td>
                <td class="text-center">{{ data.assessments.length }}</td>
              </tr>
            </tbody>
          </v-simple-table>
        </div>

        <span v-else>{{ $t('assessment.no') }}</span>
      </div>

      <span v-else>{{ $t('error.unexpected') }}</span>
    </generic-info-card>
  </ApolloQuery>
</template>

<script>
export default {
  name: 'AssessmentsInfoCard',
  props: {
    courseCode: {
      type: String,
      required: true,
    },
    space: {
      type: String,
      required: true,
    },
  },
  computed: {
    link() {
      return {
        icon: 'mdi-view-list',
        text: this.$t('general.list'),
        to: {
          name: `${this.space}-courses-code-assessments`,
          params: { code: this.courseCode },
        },
      }
    },
  },
}
</script>

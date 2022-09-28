<template>
  <ApolloQuery
    v-slot="{ isLoading, result: { error } }"
    :query="require('~/gql/cards/getEvaluationsInfo.gql')"
    :update="(data) => data.evaluations"
    :variables="{ courseCode, learner }"
    @result="setEvaluations"
  >
    <generic-info-card
      icon="mdi-clipboard-edit"
      :link="link"
      :loading="!!isLoading"
      :title="$tc('evaluation._', 2)"
    >
      <div v-if="!error">
        <div v-if="evaluations?.length">
          <v-simple-table dense>
            <tbody>
              <tr v-for="(stat, i) in stats" :key="i">
                <td class="pl-1 pr-0 text-center">
                  <v-tooltip v-if="stat.alert" bottom open-delay="500">
                    <template #activator="{ on, attrs }">
                      <v-icon color="red" small v-bind="attrs" v-on="on">
                        mdi-alert
                      </v-icon>
                    </template>

                    <span>{{ stat.alert }}</span>
                  </v-tooltip>
                </td>
                <td class="pl-2">{{ stat.text }}</td>
                <td class="text-center">{{ stat.value }}</td>
              </tr>
            </tbody>
          </v-simple-table>
        </div>

        <span v-else>{{ $t('evaluation.no') }}</span>
      </div>

      <span v-else>{{ $t('error.unexpected') }}</span>
    </generic-info-card>
  </ApolloQuery>
</template>

<script>
export default {
  name: 'EvaluationsInfoCard',
  props: {
    courseCode: {
      type: String,
      required: true,
    },
    space: {
      type: String,
      required: true,
    },
    teacherView: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      evaluations: null,
    }
  },
  computed: {
    learner() {
      return this.$auth.user?.username
    },
    link() {
      return {
        icon: 'mdi-view-list',
        text: this.$t('general.list'),
        to: {
          name: `${this.space}-courses-code-evaluations`,
          params: { code: this.courseCode },
        },
      }
    },
    stats() {
      const items = [
        {
          text: this.$t('evaluation.published'),
          filter: (e) => e.isPublished,
        },
        {
          text: this.$t('evaluation.submitted'),
          filter: (e) => e.isSubmitted,
        },
      ]

      // Compute the registrations stats.
      const stats = items.map((i) => ({
        ...i,
        value: this.evaluations?.filter(i.filter)?.length ?? 0,
      }))

      return stats
    },
  },
  methods: {
    setEvaluations({ data: evaluations }) {
      this.evaluations = evaluations
    },
  },
}
</script>

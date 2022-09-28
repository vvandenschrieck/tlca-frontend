<template>
  <ApolloQuery
    v-slot="{ isLoading, result: { error } }"
    :query="require('~/gql/cards/getAssessmentsInfo.gql')"
    :update="(data) => data.assessments"
    :variables="{ courseCode, teacherView }"
    @result="setAssessments"
  >
    <generic-info-card
      icon="mdi-clipboard-text"
      :link="link"
      :loading="!!isLoading"
      :title="$tc('assessment._', 2)"
    >
      <div v-if="!error">
        <div v-if="assessments?.length">
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
    hideClosed: {
      type: Boolean,
      default: false,
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
      assessments: null,
    }
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
    stats() {
      const items = [
        {
          text: this.$t('general.available'),
          filter: (a) => !(a.isClosed || a.isHidden),
        },
        {
          text: this.$t('assessment.closed'),
          filter: (a) => a.isClosed,
        },
      ]

      if (this.$auth.user.hasAnyRoles('teacher') && !this.hideClosed) {
        items.push({
          text: this.$t('assessment.hidden'),
          filter: (a) => a.isHidden,
        })
      }

      // Compute the registrations stats.
      const stats = items.map((i) => ({
        ...i,
        value: this.assessments?.filter(i.filter)?.length ?? 0,
      }))

      // Check if there is no available assessments.
      if (
        this.$auth.user.hasAnyRoles('teacher') &&
        this.teacherView &&
        stats[0].value === 0
      ) {
        stats[0].alert = this.$t('assessment.no_available')
      }

      return stats
    },
  },
  methods: {
    setAssessments({ data: assessments }) {
      this.assessments = assessments
    },
  },
}
</script>

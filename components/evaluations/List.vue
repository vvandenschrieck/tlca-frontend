<template>
  <ApolloQuery
    v-slot="{ isLoading, result: { error } }"
    :query="require('~/gql/components/getEvaluationsList.gql')"
    :update="(data) => data.evaluations"
    :variables="{
      assessmentId,
      courseCode,
      published,
      hideAssessment,
      hideLearner,
    }"
    @result="setEvaluations"
  >
    <generic-filter-bar
      v-if="!hideFilterBar"
      v-slot="{ filter: innerFilter, on }"
      v-model="filter"
      class="mt-1"
    >
      <evaluations-filter
        :course-code="courseCode"
        :value="innerFilter"
        v-on="on"
      />
    </generic-filter-bar>

    <v-data-table
      v-if="!error"
      :group-by="groupByStatus ? 'status.text' : null"
      :group-desc="false"
      :headers="headers"
      :items="filteredEvaluations(evaluations, filter)"
      :items-per-page="15"
      :loading="!!isLoading"
      @click:row="goToEvaluation"
    >
      <template #group.header="{ group, headers, isOpen, toggle }">
        <td :colspan="headers.length">
          <v-row align="center">
            <v-col class="group-header">
              <b>{{ group }}</b>
            </v-col>

            <v-col align="right">
              <v-btn icon @click="toggle">
                <v-icon>{{ `mdi-chevron-${isOpen ? 'up' : 'down'}` }}</v-icon>
              </v-btn>
            </v-col>
          </v-row>
        </td>
      </template>

      <template v-if="!hideFooter" #footer.prepend>
        <v-switch v-model="groupByStatus" dense>
          <span slot="label" class="text-subtitle-2">
            {{ $t('evaluation.group_by_status') }}
          </span>
        </v-switch>
      </template>

      <template #item.status="{ value: status }">
        <v-chip :color="status.color" small>
          {{ status.text }}
        </v-chip>
      </template>

      <template v-if="!hideActions" #item.actions="{ item }">
        <slot name="actions" :item="item" />
      </template>
    </v-data-table>

    <div v-else>{{ $t('error.unexpected') }}</div>
  </ApolloQuery>
</template>

<script>
import assessments from '@/mixins/assessments.js'
import datetime from '@/mixins/datetime.js'
import evaluations from '@/mixins/evaluations.js'

export default {
  name: 'EvaluationsList',
  mixins: [assessments, datetime, evaluations],
  props: {
    assessmentId: {
      type: String,
      default: null,
    },
    courseCode: {
      type: String,
      required: true,
    },
    hideActions: {
      type: Boolean,
      default: false,
    },
    hideAssessment: {
      type: Boolean,
      default: false,
    },
    hideFilterBar: {
      type: Boolean,
      default: false,
    },
    hideFooter: {
      type: Boolean,
      default: false,
    },
    hideLearner: {
      type: Boolean,
      default: false,
    },
    published: {
      type: Boolean,
      default: null,
    },
    space: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      evaluations: null,
      filter: {},
      groupByStatus: true,
    }
  },
  computed: {
    headers() {
      const items = []

      if (!this.hideAssessment) {
        items.push({
          text: this.$t('evaluation.assessment'),
          value: 'assessment',
        })
      }

      if (!this.hideLearner) {
        items.push({
          text: this.$t('evaluation.learner'),
          value: 'learner.displayName',
        })
      }

      items.push({
        text: this.$t('evaluation.date'),
        value: 'date',
      })

      if (!this.groupByStatus) {
        items.push({
          text: this.$t('evaluation.status._'),
          value: 'status',
        })
      }

      if (!this.hideActions) {
        items.push({
          cellClass: 'text-right',
          class: 'text-right',
          sortable: false,
          text: this.$tc('general.action', 2),
          value: 'actions',
        })
      }

      return items
    },
  },
  methods: {
    goToEvaluation({ id }) {
      this.$router.push({
        name: `${this.space}-courses-code-evaluations-id`,
        params: { code: this.$route.params.code, id },
      })
    },
    setEvaluations({ data: evaluations }) {
      if (!evaluations) {
        return
      }

      this.evaluations = evaluations.map((e) => ({
        ...e,
        assessment: this.assessmentName(e.assessment),
        date: this.formatDateTimeFull(e.date),
        status: {
          _: e.status,
          color: this.statusColor(e.status),
          text: this.$t(`evaluation.status.${e.status.toLowerCase()}`),
        },
      }))
    },
    statusColor(status) {
      return {
        PUBLISHED: 'success',
        REQUESTED: 'primary',
        UNPUBLISHED: 'default',
      }[status]
    },
  },
}
</script>

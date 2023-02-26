<template>
  <ApolloQuery
    v-slot="{ isLoading, result: { error } }"
    :query="require('~/gql/components/getAssessmentsList.gql')"
    :update="(data) => data.assessments"
    :variables="{ courseCode: $route.params.code, teacherView }"
    @result="setResult"
  >
    <v-data-table
      v-if="!error"
      :group-by="groupByCategory ? 'categoryText' : null"
      :group-desc="false"
      :headers="dataHeaders"
      :items="assessments ?? []"
      :items-per-page="-1"
      :loading="!!isLoading"
      @dblclick:row="goToAssessment"
    >
      <template #group.header="{ group, headers, isOpen, toggle }">
        <td :colspan="headers.length">
          <v-row align="center">
            <v-col class="group-header">
              <b>{{ group }}</b>
            </v-col>

            <v-col align="right">
              <v-btn icon @click="toggle">
                <v-icon>
                  {{ isOpen ? 'mdi-chevron-up' : 'mdi-chevron-down' }}
                </v-icon>
              </v-btn>
            </v-col>
          </v-row>
        </td>
      </template>

      <template #footer.prepend>
        <v-switch v-model="groupByCategory" dense>
          <span slot="label" class="text-subtitle-2">
            {{ $t('assessment.group_by_category') }}
          </span>
        </v-switch>
      </template>

      <template #item.takesStatus="{ item: assessment }">
        <assessment-takes-status :assessment="assessment" dense />
      </template>

      <template #item.category="{ item: { categoryText } }">
        {{ categoryText }}
      </template>

      <template #item.isHidden="{ value: isHidden }">
        <v-icon small>{{ isHidden ? 'mdi-eye-off' : 'mdi-eye' }}</v-icon>
      </template>

      <template #item.actions="{ item }">
        <slot name="actions" :item="item" />
        <detail-link-btn :to="item.link" />
      </template>
    </v-data-table>

    <div v-else>{{ $t('error.unexpected') }}</div>
  </ApolloQuery>
</template>

<script>
import assessments from '@/mixins/assessments.js'

export default {
  name: 'AssessmentsList',
  mixins: [assessments],
  props: {
    courseCode: {
      type: String,
      required: true,
    },
    hideOpenness: {
      type: Boolean,
      default: false,
    },
    hideTakesStatus: {
      type: Boolean,
      default: false,
    },
    hideVisibility: {
      type: Boolean,
      default: false,
    },
    space: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      assessments: null,
      groupByCategory: true,
    }
  },
  computed: {
    dataHeaders() {
      const headers = []

      if (!this.hideTakesStatus) {
        headers.push({
          cellClass: 'pl-2 pr-0',
          class: 'pl-2 pr-0',
          value: 'takesStatus',
          width: 5,
        })
      }

      headers.push({
        text: this.$t('assessment.name'),
        value: 'name',
      })

      if (!this.groupByCategory) {
        headers.push({
          text: this.$t('assessment.category._'),
          value: 'category',
        })
      }

      if (!this.hideVisibility) {
        headers.push({
          text: this.$t('assessment.visibility'),
          value: 'isHidden',
        })
      }

      headers.push({
        cellClass: 'text-right',
        sortable: false,
        value: 'actions',
      })

      return headers
    },
    teacherView() {
      return this.$auth.user.hasAnyRoles('teacher')
    },
  },
  methods: {
    goToAssessment(_, { item: { link } }) {
      this.$router.push(link)
    },
    setResult({ data: assessments }) {
      if (!assessments) {
        return
      }

      this.assessments = assessments.map((assessment) => ({
        ...assessment,
        categoryText: this.$t(
          `assessment.category.${assessment.category.toLowerCase()}`
        ),
        link: {
          name: `${this.space}-courses-code-assessments-id`,
          params: { code: this.courseCode, id: assessment.id },
        },
        name:
          (!this.hideOpenness && assessment.isClosed
            ? `[${this.$t('assessment.closed')}] `
            : '') + this.assessmentName(assessment),
      }))
    },
  },
}
</script>

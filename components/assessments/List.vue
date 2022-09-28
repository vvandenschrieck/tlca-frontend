<template>
  <ApolloQuery
    v-slot="{ isLoading, result: { data, error } }"
    :query="require('~/gql/components/getAssessmentsList.gql')"
    :variables="{ courseCode: $route.params.code, teacherView }"
  >
    <v-data-table
      v-if="!error"
      :group-by="groupByCategory ? 'categoryText' : null"
      :group-desc="false"
      :headers="dataHeaders"
      :items="assessments(data?.assessments)"
      :items-per-page="10"
      :loading="!!isLoading"
      @click:row="goToAssessment"
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

      <template #footer.prepend>
        <v-switch v-model="groupByCategory" dense>
          <span slot="label" class="text-subtitle-2">
            {{ $t('assessment.group_by_category') }}
          </span>
        </v-switch>
      </template>

      <template #item.name="{ item: assessment }">
        {{ assessmentName(assessment) }}
      </template>

      <template #item.category="{ item: { categoryText } }">
        {{ categoryText }}
      </template>

      <template #item.isHidden="{ value: isHidden }">
        <v-icon small>{{ isHidden ? 'mdi-eye-off' : 'mdi-eye' }}</v-icon>
      </template>

      <template v-if="!hideActions" #item.actions="{ item }">
        <slot name="actions" :item="item" />
      </template>
    </v-data-table>

    <div v-else>{{ $t('error.unexpected') }}</div>
  </ApolloQuery>
</template>

<script>
export default {
  name: 'AssessmentsList',
  props: {
    courseCode: {
      type: String,
      required: true,
    },
    hideActions: {
      type: Boolean,
      default: false,
    },
    hideOpenness: {
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
      groupByCategory: false,
    }
  },
  computed: {
    dataHeaders() {
      const headers = [
        {
          text: this.$t('assessment.name'),
          value: 'name',
        },
        {
          text: this.$t('assessment.category._'),
          value: 'category',
        },
      ]

      if (!this.hideVisibility) {
        headers.push({
          text: this.$t('assessment.visibility'),
          value: 'isHidden',
        })
      }

      if (!this.hideActions) {
        headers.push({
          cellClass: 'text-right',
          class: 'text-right',
          sortable: false,
          text: this.$tc('general.action', 2),
          value: 'actions',
        })
      }

      return headers
    },
    teacherView() {
      return this.$auth.user.hasAnyRoles('teacher')
    },
  },
  methods: {
    assessmentName(assessment) {
      const closed =
        !this.hideOpenness && assessment.isClosed
          ? `[${this.$t('assessment.closed')}] `
          : ''
      const prefix = assessment.code ? `${assessment.code} – ` : ''

      return closed + prefix + assessment.name
    },
    assessments(items) {
      return items?.map((i) => ({
        ...i,
        categoryText: this.$t(
          `assessment.category.${i.category.toLowerCase()}`
        ),
      }))
    },
    goToAssessment({ id }) {
      this.$router.push({
        name: `${this.space}-courses-code-assessments-id`,
        params: { code: this.courseCode, id },
      })
    },
  },
}
</script>

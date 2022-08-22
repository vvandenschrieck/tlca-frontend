<template>
  <div>
    <!-- <generic-filter-bar
      v-slot="{ filter: innerFilter, on }"
      v-model="filter"
      class="mt-1"
      :create-link="{
        name: 'teach-courses-code-evaluations-create',
        params: { code: courseCode },
      }"
    >
      <evaluations-filter
        :course-code="courseCode"
        :value="innerFilter"
        v-on="on"
      />
    </generic-filter-bar> -->

    <v-data-table
      v-if="items"
      :headers="dataHeaders"
      :items="assessments"
      :items-per-page="5"
      @click:row="goToAssessment"
    >
      <template #item.name="{ item: assessment }">
        {{ assessmentName(assessment) }}
      </template>

      <template #item.category="{ value: category }">
        {{ $t(`assessment.category.${category.toLowerCase()}`) }}
      </template>

      <template #item.actions="{ item: { id, isClosed, isHidden } }">
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
        <ApolloMutation
          v-slot="{ mutate, loading }"
          :mutation="require('../../gql/manage/openCloseAssessment.gql')"
          tag="span"
          :variables="{ id }"
        >
          <v-btn icon :loading="loading" small @click.stop="mutate">
            <v-icon small>{{ isClosed ? 'mdi-lock' : 'mdi-lock-open' }}</v-icon>
          </v-btn>
        </ApolloMutation>
      </template>
    </v-data-table>
  </div>
</template>

<script>
export default {
  name: 'AssessmentsList',
  props: {
    courseCode: {
      type: String,
      required: true,
    },
    items: {
      type: Array,
      required: true,
    },
  },
  computed: {
    dataHeaders() {
      return [
        {
          text: this.$t('assessment.name'),
          value: 'name',
        },
        {
          text: this.$t('assessment.category._'),
          value: 'category',
        },
        {
          cellClass: 'text-right',
          class: 'text-right',
          sortable: false,
          text: this.$tc('general.action', 2),
          value: 'actions',
        },
      ]
    },
    assessments() {
      return this.items
    },
  },
  methods: {
    assessmentName(assessment) {
      return (assessment.code ? `${assessment.code} – ` : '') + assessment.name
    },
    goToAssessment({ id }) {
      this.$router.push({
        name: 'manage-courses-code-assessments-id',
        params: { code: this.courseCode, id },
      })
    },
  },
}
</script>

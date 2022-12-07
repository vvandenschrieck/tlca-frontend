<template>
  <ApolloQuery
    v-slot="{ isLoading, result: { error } }"
    :query="require('~/gql/components/getAssessments.gql')"
    :update="(data) => data.assessments"
    :variables="{ courseCode, open: true }"
    @result="setResult"
  >
    <v-autocomplete
      v-if="!error"
      clearable
      dense
      :disabled="!!isLoading || disabled"
      :filter="filter"
      :items="assessments"
      item-value="id"
      :label="$t('evaluation.assessment')"
      :loading="!!isLoading"
      :value="value"
      @change="$emit('change')"
      @input="$emit('input', $event)"
    >
      <template #selection="{ item }">
        <span v-if="item.id">{{ item.fullName }}</span>
      </template>

      <template #item="{ item }">
        <span v-if="item.id">{{ item.fullName }}</span>
      </template>
    </v-autocomplete>

    <div v-else>{{ $t('error.unexpected') }}</div>
  </ApolloQuery>
</template>

<script>
import assessments from '@/mixins/assessments.js'

export default {
  name: 'AssessmentSelect',
  mixins: [assessments],
  props: {
    courseCode: {
      type: String,
      required: true,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    value: {
      type: String,
      default: null,
    },
  },
  data() {
    return {
      assessments: null,
    }
  },
  methods: {
    filter(item, q) {
      const query = q.trim().toLowerCase()

      return (
        item.header ||
        item.code?.toLowerCase().includes(query) ||
        item.name?.toLowerCase().includes(query)
      )
    },
    setResult({ data }) {
      if (!data) {
        return
      }

      const items = []

      if (data.length) {
        const categories = [
          ...new Set(data.map((a) => a.category)).map((c) => ({
            category: c,
            text: this.$t(`assessment.category.${c.toLowerCase()}`),
          })),
        ].sort((a, b) => (a.text < b.text ? -1 : 1))

        categories.forEach((c) => {
          items.push({ header: c.text })
          items.push(
            ...data
              .filter((a) => a.category === c.category)
              .map((a) => ({
                ...a,
                fullName: this.assessmentName(a),
              }))
          )
        })
      }

      this.assessments = items
    },
  },
}
</script>

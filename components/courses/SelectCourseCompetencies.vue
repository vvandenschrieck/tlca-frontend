<template>
  <ApolloQuery
    v-slot="{ isLoading, result: { data: competencies, error } }"
    :query="require('~/gql/manage/getCompetencies.gql')"
    :update="(data) => data.competencies"
  >
    <ValidationProvider
      v-if="!isLoading && competencies"
      v-slot="{ errors }"
      :vid="$attrs.vid"
    >
      <div v-if="value.length > 0">
        <v-row>
          <v-col
            v-for="(header, i) in headers"
            :key="i"
            cols="12"
            :md="header.size"
          >
            <b>{{ header.title }}</b>
          </v-col>
        </v-row>

        <template v-for="(competency, index) in value">
          <v-row :key="index">
            <v-col cols="12" md="6">
              <v-autocomplete-with-validation
                dense
                :item-text="competencyName"
                item-value="code"
                :items="competencies"
                required
                rules="required"
                :value="competency.competency"
                :vid="`competency-${index}`"
                @input="update(index, 'competency', $event)"
              >
                <template #item="{ item: { code, name } }">
                  <b>{{ code }}</b>
                  &nbsp;–&nbsp;{{ name }}
                </template>
              </v-autocomplete-with-validation>
            </v-col>

            <v-col cols="12" md="2">
              <v-select-with-validation
                dense
                :items="categories"
                required
                rules="required"
                :value="competency.category"
                :vid="`competency-category-${index}`"
                @input="update(index, 'category', $event)"
              />
            </v-col>

            <v-col cols="12" md="2">
              <v-text-field
                dense
                :value="competency.subcategory"
                :vid="`competency-subcategory-${index}`"
                @input="update(index, 'subcategory', $event)"
              />
            </v-col>

            <v-col cols="12" md="1">
              <v-switch
                class="mt-0"
                dense
                :disabled="!hasLearningOutcomes(competencies, index)"
                :value="competency.useLearningOutcomes"
                :vid="`competency-useLearningOutcomes-${index}`"
                @change="update(index, 'useLearningOutcomes', $event)"
              />
            </v-col>

            <v-col cols="12" md="1" class="text-center">
              <v-btn :disabled="disabled" icon @click="removeCompetency(index)">
                <v-icon small>mdi-delete</v-icon>
              </v-btn>
            </v-col>
          </v-row>
        </template>
      </div>

      <div v-else>{{ $t('competency.no') }}</div>

      <div class="text-right mt-5">
        <v-row>
          <v-col class="v-messages error--text" cols="12" md="6">
            {{ errors[0] }}
          </v-col>

          <v-col cols="12" md="6">
            <v-btn small :disabled="disabled" @click="addCompetency()">
              <v-icon left>mdi-plus</v-icon>
              {{ $t('course.competencies.add') }}
            </v-btn>
          </v-col>
        </v-row>
      </div>
    </ValidationProvider>

    <div v-else-if="isLoading">
      <v-skeleton-loader type="table-heading, table-row-divider" />
    </div>

    <div v-else-if="error">{{ $t('error.unexpected') }}</div>
  </ApolloQuery>
</template>

<script>
import { ValidationProvider } from 'vee-validate'

export default {
  name: 'SelectCourseCompetencies',
  components: { ValidationProvider },
  props: {
    disabled: {
      type: Boolean,
      default: false,
    },
    value: {
      type: Array,
      default: () => [{}],
    },
  },
  computed: {
    categories() {
      return [
        { text: this.$t('competency.category.basic'), value: 'BASIC' },
        { text: this.$t('competency.category.advanced'), value: 'ADVANCED' },
      ]
    },
    headers() {
      return [
        { title: this.$tc('competency._', 1), size: 6 },
        { title: this.$t('course.competencies.category'), size: 2 },
        { title: this.$t('course.competencies.subcategory'), size: 2 },
        { title: this.$t('course.competencies.use_lo'), size: 1 },
        { title: this.$tc('general.action', 1), size: 1 },
      ]
    },
  },
  methods: {
    addCompetency() {
      if (!this.disabled) {
        this.$emit('input', [...this.value, {}])
      }
    },
    competencyName(competency) {
      return competency.code + ' – ' + competency.name
    },
    hasLearningOutcomes(competencies, index) {
      const code = this.value[index].competency
      return !!competencies.find((c) => c.code === code)?.hasLearningOutcomes
    },
    removeCompetency(index) {
      if (!this.disabled) {
        this.$emit('input', [
          ...this.value.slice(0, index),
          ...this.value.slice(index + 1),
        ])
      }
    },
    update(index, field, value) {
      const useLearningOutcomes =
        field === 'competency' && field !== 'useLearningOutcomes'
          ? null
          : field === 'useLearningOutcomes'
          ? value
          : this.value[index].useLearningOutcomes

      this.$emit('input', [
        ...this.value.slice(0, index),
        {
          ...this.value[index],
          [field]: value,
          useLearningOutcomes,
        },
        ...this.value.slice(index + 1),
      ])
    },
  },
}
</script>

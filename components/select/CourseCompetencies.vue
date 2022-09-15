<template>
  <ApolloQuery
    v-slot="{ isLoading, result: { data: competenciesList, error } }"
    :query="require('~/gql/manage/getCompetencies.gql')"
    :update="(data) => data.competencies"
  >
    <ValidationProvider
      v-if="!isLoading && competenciesList"
      v-slot="{ errors }"
      :vid="$attrs.vid"
    >
      <div v-if="competencies.length > 0">
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

        <v-row v-for="(competency, index) in competencies" :key="index">
          <v-col cols="12" md="6">
            <v-autocomplete-with-validation
              v-model="competency.competency"
              dense
              :item-text="competencyName"
              item-value="code"
              :items="competenciesList"
              required
              rules="required"
              :vid="`competency-${index}`"
            >
              <template #item="{ item }">{{ competencyName(item) }}</template>
            </v-autocomplete-with-validation>
          </v-col>

          <v-col cols="12" md="2">
            <v-select-with-validation
              v-model="competency.category"
              dense
              :items="categories"
              required
              rules="required"
              :vid="`competency-${index}-category`"
            />
          </v-col>

          <v-col cols="12" md="2">
            <v-text-field
              v-model="competency.subcategory"
              dense
              :vid="`competency-${index}-subcategory`"
            />
          </v-col>

          <v-col cols="12" md="1">
            <v-switch
              v-model="competency.useLearningOutcomes"
              class="mt-0"
              dense
              :disabled="!hasLearningOutcomes(competenciesList, index)"
              :vid="`competency-${index}-useLearningOutcomes`"
            />
          </v-col>

          <v-col class="text-center" cols="12" md="1">
            <v-btn :disabled="disabled" icon @click="removeCompetency(index)">
              <v-icon small>mdi-delete</v-icon>
            </v-btn>
          </v-col>
        </v-row>
      </div>

      <div v-else>{{ $t('competency.no') }}</div>

      <div class="text-right mt-5">
        <v-row>
          <v-col class="v-messages error--text" cols="12" md="6">
            <span v-if="errors[0]">{{ $t(`error.${errors[0]}`) }}</span>
          </v-col>

          <v-col cols="12" md="6">
            <v-btn small :disabled="disabled" @click="addCompetency">
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
      return ['BASIC', 'ADVANCED'].map((value) => ({
        text: this.$t(`competency.category.${value.toLowerCase()}`),
        value,
      }))
    },
    competencies: {
      get() {
        return this.value
      },
      set(value) {
        this.$emit('input', value)
      },
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
        this.competencies.push({})
      }
    },
    competencyName(competency) {
      return competency.code + ' – ' + competency.name
    },
    hasLearningOutcomes(competencies, index) {
      const code = this.competencies[index].competency
      return !!competencies.find((c) => c.code === code)?.hasLearningOutcomes
    },
    removeCompetency(index) {
      if (!this.disabled) {
        this.competencies.splice(index, 1)
      }
    },
  },
}
</script>

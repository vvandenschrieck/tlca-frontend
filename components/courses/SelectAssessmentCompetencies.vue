<template>
  <ApolloQuery
    v-slot="{ isLoading, result: { data: course, error } }"
    :query="require('~/gql/manage/getCourseCompetencies.gql')"
    :variables="{ courseCode: $route.params.code }"
    :update="(data) => data.course"
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
            :class="header.class"
            cols="12"
            :md="header.size"
          >
            <b>{{ header.title }}</b>
          </v-col>
        </v-row>

        <v-row v-for="(competency, index) in value" :key="index">
          <v-col cols="12" md="7">
            <v-autocomplete-with-validation
              dense
              :item-text="({ code, name }) => code + ' – ' + name"
              item-value="code"
              :items="competencies(course)"
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

          <v-col cols="12" md="3">
            <v-row v-if="useLearningOutcomes(course, index)">
              <v-col cols="12" md="12">
                <v-select
                  chips
                  clearable
                  dense
                  :items="learningOutcomes(course, index)"
                  multiple
                  small-chips
                  :value="competency.learningOutcomes"
                  :vid="`competency-learningOutcomes-${index}`"
                  @input="update(index, 'learningOutcomes', $event)"
                >
                  <template #item="{ item }">
                    {{ loFullName(item) }}
                  </template>

                  <template #selection="{ item, index: i }">
                    <v-chip v-if="i < 2" small>
                      {{ loAbbr(item) }}
                    </v-chip>
                    <span v-if="i === 2" class="grey--text text-caption">
                      {{
                        $tc('general.plus_other', value.length - 1, {
                          n: value.length - 1,
                        })
                      }}
                    </span>
                  </template>
                </v-select>
              </v-col>
            </v-row>

            <v-row v-else>
              <v-col cols="12" md="6">
                <stars-field-with-validation
                  background-color="grey"
                  dense
                  empty-icon="mdi-star-outline"
                  full-icon="mdi-star"
                  hover
                  length="3"
                  rules="stars_required"
                  :value="competency.stars || 0"
                  :vid="`competency-stars-${index}`"
                  @input="update(index, 'stars', $event)"
                />
              </v-col>

              <v-col cols="12" md="6">
                <v-select
                  clearable
                  dense
                  :items="[1, 2, 3, 4, 5]"
                  :value="competency.maxStars"
                  :vid="`competency-maxStars-${index}`"
                  @input="update(index, 'maxStars', $event)"
                />
              </v-col>
            </v-row>
          </v-col>

          <v-col class="text-center" cols="12" md="1">
            <v-simple-checkbox
              dense
              hide-details
              :value="competency.isOptional"
              :vid="`competency-isOptional-${index}`"
              @input="update(index, 'isOptional', $event)"
            />
          </v-col>

          <v-col class="text-center" cols="12" md="1">
            <v-btn icon :disabled="disabled" @click="removeCompetency(index)">
              <v-icon small>mdi-delete</v-icon>
            </v-btn>
          </v-col>
        </v-row>
      </div>
      <div v-else>
        {{ $t('competency.no') }}
      </div>

      <div class="text-right mt-5">
        <v-row>
          <v-col class="v-messages error--text" cols="12" md="6">
            {{ errors[0] }}
          </v-col>

          <v-col cols="12" md="6">
            <v-btn :disabled="disabled" small @click="addCompetency()">
              <v-icon left>mdi-plus</v-icon>
              {{ $t('course.competencies.add') }}
            </v-btn>
          </v-col>
        </v-row>
      </div>
    </ValidationProvider>

    <v-skeleton-loader
      v-else-if="isLoading"
      type="table-heading, table-row-divider"
    />

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
    headers() {
      return [
        { title: this.$tc('competency._', 1), size: 7 },
        { title: this.$t('assessment.progress_measure'), size: 3 },
        {
          title: this.$t('assessment.competencies.optional'),
          size: 1,
          class: 'text-center',
        },
        { title: this.$tc('general.action', 1), size: 1, class: 'text-center' },
      ]
    },
  },
  methods: {
    _competency(course, index) {
      return course.competencies.find(
        (c) => c.competency.code === this.value[index].competency
      )
    },
    addCompetency() {
      if (!this.disabled) {
        this.$emit('input', [...this.value, {}])
      }
    },
    competencies(course) {
      return course.competencies.map((c) => c.competency)
    },
    learningOutcomes(course, index) {
      return this._competency(course, index).competency.learningOutcomes.map(
        (lo, i) => ({ text: lo, value: i })
      )
    },
    loAbbr(item) {
      const loNb = item.value + 1
      return this.$t('competency.learning_outcomes.abbr') + ' ' + loNb
    },
    loFullName(item) {
      return this.loAbbr(item) + ' – ' + item.text
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
      this.$emit('input', [
        ...this.value.slice(0, index),
        {
          ...this.value[index],
          [field]: value,
        },
        ...this.value.slice(index + 1),
      ])
    },
    useLearningOutcomes(course, index) {
      return this._competency(course, index).useLearningOutcomes
    },
  },
}
</script>

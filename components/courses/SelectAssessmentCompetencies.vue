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
      <div v-if="competencies.length > 0">
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

        <v-row v-for="(competency, index) in competencies" :key="index">
          <v-col cols="12" md="6">
            <v-autocomplete-with-validation
              v-model="competency.competency"
              dense
              :item-text="({ code, name }) => code + ' – ' + name"
              item-value="code"
              :items="courseCompetencies(course)"
              required
              rules="required"
              :vid="`competency-${index}`"
            >
              <template #item="{ item: { code, name } }">
                <b>{{ code }}</b>
                &nbsp;–&nbsp;{{ name }}
              </template>
            </v-autocomplete-with-validation>

            <div v-if="competency.checklist">
              <check-list
                v-model="competency.checklist.public"
                class="mt-3 ml-3"
                :name="$t('assessment.checklist.public')"
                :vid="`competency-${index}-checklist-public`"
              />
              <check-list
                v-model="competency.checklist.private"
                class="mt-5 ml-3"
                :name="$t('assessment.checklist.private')"
                :vid="`competency-${index}-checklist-private`"
              />
            </div>
          </v-col>

          <v-col cols="12" md="3">
            <template v-if="competency.competency">
              <v-row v-if="useLearningOutcomes(course, index)">
                <v-col cols="12" md="12">
                  <v-select
                    v-model="competency.learningOutcomes"
                    chips
                    clearable
                    dense
                    :items="learningOutcomes(course, index)"
                    multiple
                    small-chips
                    :vid="`competency-learningOutcomes-${index}`"
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
                          $tc(
                            'general.plus_other',
                            competency.learningOutcomes.length - 1,
                            {
                              n: competency.learningOutcomes.length - 1,
                            }
                          )
                        }}
                      </span>
                    </template>
                  </v-select>
                </v-col>
              </v-row>

              <v-row v-else>
                <v-col cols="12" md="6">
                  <stars-field-with-validation
                    v-model="competency.stars"
                    length="3"
                    rules="stars_required"
                    :vid="`competency-stars-${index}`"
                  />
                </v-col>

                <v-col cols="12" md="6">
                  <v-select
                    v-model="competency.maxStars"
                    clearable
                    dense
                    :items="[1, 2, 3, 4, 5]"
                    :vid="`competency-maxStars-${index}`"
                  />
                </v-col>
              </v-row>
            </template>
          </v-col>

          <v-col class="text-center" cols="12" md="1">
            <v-simple-checkbox
              v-model="competency.isOptional"
              dense
              hide-details
              :vid="`competency-isOptional-${index}`"
            />
          </v-col>

          <v-col class="text-center" cols="12" md="2">
            <v-btn
              :disabled="
                disabled || !competency.competency || !!competency.checklist
              "
              icon
              @click="addCheckList(index)"
            >
              <v-icon small>mdi-playlist-check</v-icon>
            </v-btn>

            <v-btn :disabled="disabled" icon @click="removeCompetency(index)">
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
            <v-btn :disabled="disabled" small @click="addCompetency">
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
  name: 'SelectAssessmentCompetencies',
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
        { title: this.$tc('competency._', 1), size: 6 },
        { title: this.$t('assessment.progress_measure'), size: 3 },
        {
          title: this.$t('assessment.competencies.optional'),
          size: 1,
          class: 'text-center',
        },
        { title: this.$tc('general.action', 2), size: 2, class: 'text-center' },
      ]
    },
    competencies: {
      get() {
        return this.value
      },
      set(value) {
        this.$emit('input', value)
      },
    },
  },
  methods: {
    _competency(course, index) {
      return course.competencies.find(
        (c) => c.competency.code === this.value[index].competency
      )
    },
    addCheckList(index) {
      const competencyConfig = this.competencies[index]

      if (!competencyConfig.checklist) {
        competencyConfig.checklist = {
          private: [],
          public: [],
        }
      }
    },
    addCompetency() {
      if (!this.disabled) {
        this.competencies.push({})
      }
    },
    courseCompetencies(course) {
      return course?.competencies.map((c) => c.competency)
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
      return this.loAbbr(item) + ' – ' + item.text.name
    },
    removeCompetency(index) {
      if (!this.disabled) {
        this.competencies.splice(index, 1)
      }
    },
    useLearningOutcomes(course, index) {
      return this._competency(course, index)?.useLearningOutcomes
    },
  },
}
</script>

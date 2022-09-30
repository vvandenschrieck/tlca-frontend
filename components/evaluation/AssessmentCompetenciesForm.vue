<!-- FIXME: maybe merge with the 'non form' component
     on which it suffices to add a form props so that to
     turn it into a form just as with the checklist
     or learning outcomes -->
<template>
  <ApolloQuery
    v-slot="{ isLoading, result: { error } }"
    :query="require('~/gql/components/getAssessmentCompetencies.gql')"
    :variables="{ assessmentId, courseCode, teacherView }"
    @result="setCompetencies"
  >
    <v-progress-linear v-if="!!isLoading" indeterminate />

    <v-list v-if="!error" class="pa-0">
      <template v-for="(c, i) in competencies">
        <v-list-item
          :key="c.competency.code"
          class="unselected"
          :class="{
            selected: selectedCompetencies[i]?.selected,
          }"
        >
          <v-list-item-content>
            <v-list-item-title>
              <v-checkbox
                v-model="selectedCompetencies[i].selected"
                class="ml-1"
                dense
                :disabled="selectedCompetencies[i].disabled"
                :label="competencyName(c.competency)"
                :readonly="c.useLearningOutcomes || readonly"
              />
            </v-list-item-title>

            <v-list-item-subtitle>
              <learning-outcomes-list
                v-if="c.useLearningOutcomes"
                v-model="selectedCompetencies[i].learningOutcomes"
                class="mt-3 ml-3"
                :disabled="selectedCompetencies[i].disabled"
                :form="!readonly"
                hide-divider
                hide-takes
                :items="c.learningOutcomes"
                @change="() => learningOutcomesUpdated(i)"
              />

              <competency-check-list
                v-if="c.checklist?.public"
                v-model="selectedCompetencies[i].checklist.public"
                class="mt-3 ml-3"
                :disabled="selectedCompetencies[i].disabled"
                :form="!readonly"
                :items="c.checklist.public"
                :name="$t(`assessment.checklist.public`)"
              />

              <competency-check-list
                v-if="c.checklist?.private"
                v-model="selectedCompetencies[i].checklist.private"
                class="mt-3 ml-3"
                :disabled="selectedCompetencies[i].disabled"
                :form="!readonly"
                :items="c.checklist.private"
                :name="$t('assessment.checklist.private')"
              />
            </v-list-item-subtitle>
          </v-list-item-content>

          <v-list-item-action class="align-self-baseline">
            <stars-field
              v-if="!c.useLearningOutcomes"
              :color="selectedCompetencies[i]?.selected ? 'success' : 'primary'"
              :length="3"
              readonly
              :value="c.stars"
            />
            <v-chip
              v-else
              :color="selectedCompetencies[i]?.selected ? 'success' : 'primary'"
              small
            >
              {{ $t('competency.learning_outcomes.abbr') }}
            </v-chip>
          </v-list-item-action>
        </v-list-item>

        <v-divider v-if="i < competencies.length - 1" :key="i" />
      </template>
    </v-list>

    <div v-else>{{ $t('error.unexpected') }}</div>
  </ApolloQuery>
</template>

<script>
import competencies from '@/mixins/competencies.js'

export default {
  name: 'EvaluationAssessmentCompetenciesForm',
  mixins: [competencies],
  props: {
    assessmentId: {
      type: String,
      required: true,
    },
    courseCode: {
      type: String,
      required: true,
    },
    readonly: {
      type: Boolean,
      default: false,
    },
    teacherView: {
      type: Boolean,
      default: true,
    },
    value: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      competencies: [],
    }
  },
  computed: {
    selectedCompetencies: {
      get() {
        return this.value
      },
      set(value) {
        this.$emit('input', value)
      },
    },
  },
  methods: {
    learningOutcomesUpdated(i) {
      const competency = this.selectedCompetencies[i]
      competency.selected = competency.learningOutcomes.every(
        (lo) => lo.selected
      )
    },
    setCompetencies({ data }) {
      this.competencies =
        data?.assessment.competencies.map((item) => {
          const courseCompetency = data.course.competencies.find(
            ({ competency }) => competency.code === item.competency.code
          )
          const learningOutcomes = courseCompetency.competency.learningOutcomes

          return {
            ...item,
            useLearningOutcomes: courseCompetency?.useLearningOutcomes,
            learningOutcomes: item.learningOutcomes?.map(
              (lo) => learningOutcomes[lo]
            ),
          }
        }) ?? null

      this.selectedCompetencies =
        this.competencies?.map(
          ({ checklist, competency, learningOutcomes }) => {
            return {
              checklist: {
                private: Array.from(
                  { length: checklist?.private?.length ?? 0 },
                  () => false
                ),
                public: Array.from(
                  { length: checklist?.public?.length ?? 0 },
                  () => false
                ),
              },
              competency: competency.code,
              disabled: false,
              learningOutcomes: Array.from(
                { length: learningOutcomes?.length ?? 0 },
                () => ({ disabled: false, selected: false })
              ),
              selected: false,
            }
          }
        ) ?? []
    },
  },
}
</script>

<style scoped>
.selected {
  border-left: 3px solid green;
  padding-left: 0px !important;
}
.unselected {
  padding-left: 3px;
}
</style>

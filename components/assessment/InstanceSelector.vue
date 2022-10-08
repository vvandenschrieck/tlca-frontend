<!-- eslint-disable vue/no-v-html -->
<template>
  <ApolloQuery
    v-slot="{ isLoading, result: { error } }"
    :query="require('~/gql/components/getAssessmentInstancesEvaluations.gql')"
    :variables="{ assessmentId, courseCode, learner }"
    @result="setResult"
  >
    <v-progress-linear v-if="!!isLoading" indeterminate />

    <div v-if="!error">
      <v-row>
        <v-col cols="12" md="4">
          <v-switch
            v-model="newInstance"
            class="ml-2"
            dense
            :disabled="selectedInstance !== null"
            :label="$t('assessment.instance.new')"
            @change="switchNewInstance"
          />
        </v-col>

        <v-col cols="12" md="5">
          <v-select
            v-model="selectedInstance"
            clearable
            :disabled="newInstance || !instances?.length"
            :items="instances"
            item-value="i"
            :label="$tc('assessment.instance._', 1)"
            @change="selectInstance"
          >
            <template #item="{ item }">
              <span v-html="instanceName(item)" />
            </template>

            <template #selection="{ item }">
              <span v-html="instanceName(item)" />
            </template>
          </v-select>
        </v-col>

        <v-col cols="12" md="3">
          <span v-if="showLimit">{{ $t('general.limit') }}</span>

          <v-progress-linear
            v-if="newInstance"
            height="20"
            :value="instancesPercentage"
          >
            <span class="font-weight-black text-caption">
              {{ instancesNb }}
            </span>
          </v-progress-linear>

          <v-progress-linear
            v-if="selectedInstance !== null && assessment.isIncremental"
            height="20"
            :value="takesPercentage"
          >
            <span class="font-weight-black text-caption">
              {{ takesNb }}
            </span>
          </v-progress-linear>
        </v-col>
      </v-row>

      <div v-if="showDetail">
        <v-alert
          v-if="!canAddEvaluation"
          class="mt-3"
          dense
          outlined
          type="info"
        >
          Cannot add evaluation
        </v-alert>
        <slot
          v-else
          name="body"
          :assessment="assessment"
          :has-unpublished-evaluations="hasUnpublishedEvaluations"
          :selected="newInstance ? [] : selectedCompetencies"
        />
      </div>
    </div>

    <div v-else>{{ $t('error.unexpected') }}</div>
  </ApolloQuery>
</template>

<script>
import datetime from '@/mixins/datetime.js'

export default {
  name: 'AssessmentInstanceSelector',
  mixins: [datetime],
  props: {
    assessmentId: {
      type: String,
      required: true,
    },
    courseCode: {
      type: String,
      required: true,
    },
    learner: {
      type: String,
      default: null,
    },
    value: {
      type: String,
      default: null,
    },
  },
  data() {
    return {
      assessment: null,
      evaluations: null,
      instances: null,
      newInstance: false,
      selectedCompetencies: [],
      selectedInstance: null,
    }
  },
  computed: {
    canAddEvaluation() {
      if (!this.showDetail || !this.assessment || !this.instances) {
        return false
      }

      // It is not possible to create a new instance if the limit has been reached.
      const maxInstances = this.assessment.instances
      const nbInstances = this.instances.length
      if (this.newInstance && maxInstances && nbInstances >= maxInstances) {
        return false
      }

      // It is not possible to add an evaluation if it is not an incremental
      // or if the limit of takes has been reached
      // or if all the competencies have already been acquired.
      if (this.selectedInstance !== null) {
        if (!this.assessment.isIncremental) {
          return false
        }

        if (
          this.assessment.takes &&
          this.instanceEvaluations.length >= this.assessment.takes
        ) {
          return false
        }

        // Check what has been acquired by all the previous published evaluations
        const evaluations = this.instanceEvaluations.filter(
          (e) => e.isPublished
        )
        // const mandatoryCompetencies = {}
        const allCompetencies = {}
        this.assessment.competencies.forEach(({ competency, isOptional }) => {
          allCompetencies[competency.code] = {
            selected: false,
            learningOutcomes: [],
          }
          // if (!isOptional) {
          //   mandatoryCompetencies[competency.code] = false
          // }
        })
        evaluations.forEach((e) => {
          e.competencies.forEach(
            ({ competency, learningOutcomes, selected }) => {
              allCompetencies[competency.code].selected ||= selected
              if (learningOutcomes) {
                learningOutcomes.forEach((lo, i) => {
                  allCompetencies[competency.code].learningOutcomes[i] ||= lo
                })
              }
              // if (competency.code in mandatoryCompetencies) {
              //   mandatoryCompetencies[competency.code] ||= selected
              // }
            }
          )
        })

        if (
          Object.keys(allCompetencies).every((c) => allCompetencies[c].selected)
        ) {
          return false
        }

        // Compute the competencies and learning outcomes
        // that have been acquired.
        Object.keys(allCompetencies).forEach((code) => {
          if (allCompetencies[code].learningOutcomes?.length) {
            const sc = this.selectedCompetencies.find(
              (c) => c.competency === code
            )
            if (sc) {
              allCompetencies[code].learningOutcomes.forEach((lo, i) => {
                if (lo) {
                  sc.learningOutcomes[i] = true
                }
              })
            }
          }

          if (allCompetencies[code].selected) {
            const sc = this.selectedCompetencies.find(
              (c) => c.competency === code
            )
            if (sc) {
              sc.disabled = true
              sc.selected = true
            }
          }
        })
      }

      return true
    },
    hasUnpublishedEvaluations() {
      return this.instanceEvaluations.filter((e) => !e.isPublished).length > 0
    },
    instanceEvaluations() {
      if (this.selectedInstance === null || !this.evaluations) {
        return []
      }

      const instanceId = this.instances[this.selectedInstance].id
      return this.evaluations.filter((e) => e.instance.id === instanceId)
    },
    instancesNb() {
      const nb = this.instances.length
      const max = this.assessment.instances ?? this.$t('general.infinity')
      return `${nb} / ${max}`
    },
    instancesPercentage() {
      return (
        (this.instances.length * 100) /
        (this.assessment.instances ?? this.instances.length + 1)
      )
    },
    showDetail() {
      return this.newInstance || this.selectedInstance !== null
    },
    showLimit() {
      return (
        this.newInstance ||
        (this.selectedInstance !== null && this.assessment.isIncremental)
      )
    },
    takesNb() {
      const nb = this.instanceEvaluations.length
      const max = this.assessment.takes ?? this.$t('general.infinity')
      return `${nb} / ${max}`
    },
    takesPercentage() {
      const evaluationsNb = this.instanceEvaluations.length
      return (
        (evaluationsNb * 100) / (this.assessment.takes ?? evaluationsNb + 1)
      )
    },
  },
  watch: {
    canAddEvaluation(newValue, oldValue) {
      if (newValue !== oldValue) {
        this.$emit('change', newValue)
      }
    },
  },
  methods: {
    instanceName(item) {
      const name = this.$t('assessment.instance.instance_name', {
        nb: item.i + 1,
      })
      const date = this.formatDateTimeCompact(item.datetime)
      return `${name}&nbsp;<small>(${date})</small>`
    },
    selectInstance(value) {
      if (value !== null) {
        this.newInstance = false
        this.$emit('input', this.instances[value].id)
      }
    },
    setResult({ data }) {
      if (!data) {
        return
      }

      this.assessment = data.assessment
      this.evaluations = data.evaluations
      this.instances = data.assessmentInstances
        .sort((a, b) => (a.datetime > b.datetime ? 1 : -1))
        .map((ai, i) => ({ ...ai, i }))
      this.selectedCompetencies =
        this.assessment.competencies.map(
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
                () => false
              ),
              selected: false,
            }
          }
        ) ?? []
    },
    switchNewInstance(value) {
      if (value) {
        this.selectedInstance = null
      }
    },
  },
}
</script>

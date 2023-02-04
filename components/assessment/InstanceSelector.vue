<!-- eslint-disable vue/no-v-html -->
<template>
  <ApolloQuery
    v-slot="{ isLoading, result: { error } }"
    fetch-policy="no-cache"
    :query="require('~/gql/components/getPastEvaluations.gql')"
    :variables="{
      assessmentId,
      courseCode,
      learner: !massCreation ? learner : null,
      massCreation,
    }"
    @result="setResult"
  >
    <v-progress-linear v-if="!!isLoading" indeterminate />

    <div v-if="!error">
      <div v-if="showInstanceSelector">
        <v-row v-if="!edit && !massCreation">
          <v-col cols="12" md="5">
            <v-select
              v-model="selectedInstance"
              clearable
              :disabled="
                !canSelectInstance ||
                newInstance ||
                !instances ||
                !instances.length
              "
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
            <v-switch
              v-model="newInstance"
              class="ml-2"
              dense
              :disabled="!canCreateInstance || selectedInstance !== null"
              :label="$t('assessment.instance.new')"
              @change="switchNewInstance"
            />
          </v-col>

          <v-col cols="12" md="4">
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
      </div>

      <v-row v-if="showPhaseSelector">
        <v-col cols="12" md="5">
          <assessment-phase-select
            v-model="phase"
            :assessment-id="assessment.id"
            @change="selectPhase"
          />
        </v-col>
      </v-row>

      <div v-if="showDetail || edit">
        <v-alert
          v-if="!canAddEvaluation && !edit"
          class="mt-3"
          dense
          outlined
          type="info"
        >
          {{ $t('evaluation.cannot_add') }}
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
import utils from '@/mixins/utils.js'

export default {
  name: 'AssessmentInstanceSelector',
  mixins: [datetime, utils],
  props: {
    assessmentId: {
      type: String,
      required: true,
    },
    courseCode: {
      type: String,
      required: true,
    },
    edit: {
      type: Boolean,
      default: false,
    },
    evaluationId: {
      type: String,
      default: null,
    },
    learner: {
      type: [Array, String],
      default: null,
    },
    value: {
      type: Object,
      default: null,
    },
  },
  data() {
    return {
      assessment: null,
      canCreateInstance: true,
      canSelectInstance: true,
      evaluations: null,
      instances: null,
      newInstance: false,
      phase: null,
      selectedCompetencies: [],
      selectedInstance: null,
    }
  },
  computed: {
    canAddEvaluation() {
      // Can always add evaluations for mass encoding.
      if (this.massCreation) {
        return true
      }

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
        evaluations
          .filter((e) => !!e.competencies)
          .forEach((e) => {
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
      return !!this.instanceEvaluations.find(
        (e) => e.id !== this.evaluationId && !e.isPublished
      )
    },
    instance() {
      return this.instances && this.selectedInstance !== null
        ? this.instances[this.selectedInstance].id
        : null
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
    massCreation() {
      return Array.isArray(this.learner)
    },
    showDetail() {
      return (
        (this.newInstance ||
          this.selectedInstance !== null ||
          (this.massCreation && this.learner?.length > 0)) &&
        (this.assessment?.type !== 'PHASED' || this.phase !== null)
      )
    },
    showInstanceSelector() {
      return (
        this.assessment &&
        !(
          !this.instances ||
          this.instances.length === 0 ||
          !this.assessment.isIncremental ||
          this.assessment.instances === 1
        )
      )
    },
    showLimit() {
      return (
        this.newInstance ||
        (this.selectedInstance !== null && this.assessment.isIncremental)
      )
    },
    showPhaseSelector() {
      return this.assessment?.type === 'PHASED'
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
    assessmentId(newValue, oldValue) {
      if (newValue !== oldValue) {
        this.reset()
      }
    },
    canAddEvaluation(newValue, oldValue) {
      if (newValue !== oldValue) {
        this.$emit('change', newValue)
      }
    },
    learner(newValue, oldValue) {
      if (newValue !== oldValue) {
        this.reset()
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
    reset() {
      this.instances = null
      this.newInstance = false
      this.phase = null
      this.selectedCompetencies = []
      this.selectedInstance = null

      this.$emit('input', null)
    },
    selectInstance(value) {
      if (value === null) {
        this.selectedInstance = null
      }

      this.$emit('input', {
        instance: this.instance,
        phase: this.phase,
      })
    },
    selectPhase(value) {
      if (value === null) {
        this.phase = null
      }

      this.$emit('input', {
        instance: this.instance,
        phase: this.phase,
      })
    },
    setResult({ data }) {
      if (!data) {
        return
      }

      this.reset()
      this.assessment = data.assessment
      this.evaluations = data.evaluations
      this.instances =
        data.instances
          ?.sort((a, b) => (a.datetime > b.datetime ? 1 : -1))
          .map((ai, i) => ({ ...ai, i })) ?? null

      // Manage mass creation.
      if (this.massCreation) {
        this.evaluations = null
        this.instances = null
      }

      // Initialise the variable to store the selected competencies.
      const competencies =
        this.assessment.type === 'PHASED' && this.phase
          ? this.assessment.phases[this.phase].competencies
          : this.assessment.competencies

      this.selectedCompetencies =
        competencies?.map(({ checklist, competency, learningOutcomes }) => {
          return {
            checklist: {
              private: this.newArray(checklist?.private?.length, false),
              public: this.newArray(checklist?.public?.length, false),
            },
            competency: competency.code,
            disabled: false,
            learningOutcomes: this.newArray(learningOutcomes?.length, false),
            selected: false,
          }
        }) ?? []

      // Automatically initialise instance selection options.
      if (
        !this.instances ||
        this.instances.length === 0 ||
        (this.assessment && !this.assessment.isIncremental)
      ) {
        this.newInstance = true
      } else if (
        this.assessment?.instances === 1 &&
        this.instances?.length === 1
      ) {
        this.selectedInstance = 0
        this.selectInstance(0)
      }

      // this.newInstance = !this.instances || !this.instances.length
      // this.canCreateInstance =
      //   !this.assessment.instances ||
      //   (this.instances && this.instances.length < this.assessment.instances)
      // if (!this.canCreateInstance && this.instances?.length === 1) {
      //   this.canSelectInstance = false
      //   this.selectedInstance = 0
      //   this.$emit('input', this.instances[0].id)
      // }
    },
    switchNewInstance(value) {
      if (value) {
        this.selectedInstance = null
      }
    },
  },
}
</script>

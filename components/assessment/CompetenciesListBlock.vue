<template>
  <div>
    <template v-if="!!mandatory.length">
      <h5>{{ mandatoryTitle }}</h5>

      <v-list class="pa-0">
        <template v-for="(competency, i) in mandatory">
          <competency-list-item
            :key="i * 2"
            v-model="selectedCompetencies[i]"
            :competency="competency"
            :form="form"
            :hide-checklist="hideChecklist"
            :readonly="readonly"
            :student-view="studentView"
          />

          <v-divider v-if="i < mandatory.length - 1" :key="i * 2 + 1" />
        </template>
      </v-list>
    </template>

    <template v-if="!!optional.length">
      <h5>{{ optionalTitle }}</h5>

      <v-list class="pa-0">
        <template v-for="(competency, i) in optional">
          <competency-list-item
            :key="i * 2"
            v-model="selectedCompetencies[mandatory.length + i]"
            :competency="competency"
            :form="form"
            :hide-checklist="hideChecklist"
            :readonly="readonly"
            :student-view="studentView"
          />

          <v-divider v-if="i < optional.length - 1" :key="i * 2 + 1" />
        </template>
      </v-list>
    </template>
  </div>
</template>

<script>
export default {
  name: 'AssessmentCompetenciesListBlock',
  props: {
    competencies: {
      type: Array,
      required: true,
    },
    form: {
      type: Boolean,
      default: false,
    },
    hideChecklist: {
      type: Boolean,
      default: false,
    },
    readonly: {
      type: Boolean,
      default: false,
    },
    studentView: {
      type: Boolean,
      default: false,
    },
    value: {
      type: Array,
      default: () => [],
    },
  },
  computed: {
    mandatory() {
      return this.competencies.filter((c) => !c.isOptional)
    },
    mandatoryTitle() {
      return this.$tc(
        'assessment.competencies.mandatory',
        this.mandatory.length
      )
    },
    optional() {
      return this.competencies.filter((c) => c.isOptional)
    },
    optionalTitle() {
      return this.$tc('assessment.competencies.optional', this.optional.length)
    },
    selectedCompetencies: {
      get() {
        return this.value
      },
      set(value) {
        this.$emit('input', value)
      },
    },
  },
}
</script>

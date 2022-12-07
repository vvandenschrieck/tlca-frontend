<!-- eslint-disable vue/no-v-html -->
<template>
  <v-expansion-panels accordion flat multiple tile>
    <v-expansion-panel v-for="(phase, i) in phases" :key="i">
      <v-expansion-panel-header class="px-0 name">
        <h4>{{ phase.header }}</h4>
      </v-expansion-panel-header>

      <v-expansion-panel-content>
        <slot :phase="phase" />
      </v-expansion-panel-content>
    </v-expansion-panel>
  </v-expansion-panels>
</template>

<script>
export default {
  name: 'AssessmentPhases',
  props: {
    assessment: {
      type: Object,
      default: null,
    },
  },
  computed: {
    phases() {
      return (
        this.assessment?.phases.map((phase, i) => ({
          ...phase,
          header:
            this.$t('assessment.phase.phase_nb', { nb: i + 1 }) +
            ' – ' +
            phase.name,
        })) ?? []
      )
    },
  },
}
</script>

<template>
  <v-list-item>
    <v-list-item-content>
      <v-list-item-title>
        {{ competencyName(competency.competency) }}
      </v-list-item-title>

      <v-list-item-subtitle>
        <learning-outcomes-list
          class="ml-3 mt-3"
          hide-divider
          hide-takes
          :items="competency.learningOutcomes"
          :title="$t('assessment.learning_outcomes.targeted')"
        />

        <competency-check-list
          class="ml-3 mt-3"
          :items="competency.checklist?.public"
          :name="$t(`assessment.checklist.${studentView ? '_' : 'public'}`)"
        />

        <competency-check-list
          class="ml-3 mt-3"
          :items="competency.checklist?.private"
          :name="$t('assessment.checklist.private')"
        />
      </v-list-item-subtitle>
    </v-list-item-content>

    <v-list-item-action class="align-self-baseline">
      <learning-outcome-chip v-if="competency.useLearningOutcomes" />
      <stars-field v-else :length="3" readonly :value="competency.stars" />
    </v-list-item-action>
  </v-list-item>
</template>

<script>
import competencies from '@/mixins/competencies.js'

export default {
  name: 'CompetencyListItem',
  mixins: [competencies],
  props: {
    competency: {
      type: Object,
      required: true,
    },
    studentView: {
      type: Boolean,
      default: false,
    },
  },
}
</script>

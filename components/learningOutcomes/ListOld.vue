<template>
  <v-list v-if="items.length" class="pa-0" dense>
    <template v-for="(learningOutcome, i) in items">
      <v-list-item :key="2 * i">
        <v-list-item-content>
          <v-list-item-title>{{ learningOutcome.name }}</v-list-item-title>
        </v-list-item-content>

        <v-list-item-action v-if="!hideTakes">
          <v-chip x-small>{{ learningOutcome.takes ?? 1 }}</v-chip>
        </v-list-item-action>
      </v-list-item>

      <v-divider v-if="i < items.length - 1" :key="2 * i + 1" />
    </template>
  </v-list>
</template>

<script>
export default {
  name: 'LearningOutcomesList',
  props: {
    items: {
      type: Array,
      required: true,
    },
    hideTakes: {
      type: Boolean,
      default: false,
    },
  },
}
</script>

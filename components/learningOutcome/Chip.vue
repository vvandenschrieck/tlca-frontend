<template>
  <v-tooltip left open-delay="500">
    <template #activator="{ on, attrs }">
      <v-chip color="primary" small v-bind="attrs" v-on="on">
        {{ $t('competency.learning_outcomes.abbr') }}
      </v-chip>
    </template>
    <span>{{ $t('competency.learning_outcomes._') }}</span>
  </v-tooltip>
</template>

<script>
export default {
  name: 'LearningOutcomeChip',
}
</script>

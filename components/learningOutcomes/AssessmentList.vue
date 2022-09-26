<template>
  <div v-if="items?.length">
    <i>{{ $t('assessment.learning_outcomes.targeted') }}</i>

    <v-list class="pa-0">
      <v-list-item v-for="(item, i) in items" :key="i" class="line pl-3" dense>
        <v-list-item-content class="pa-0">
          <v-list-item-title>
            <v-checkbox
              v-model="learningOutcomes[i].selected"
              class="ml-1"
              dense
              :disabled="disabled || learningOutcomes[i].disabled"
              hide-details
              :readonly="!form"
              @change="$emit('change', value)"
            >
              <span slot="label" class="text-subtitle-2">{{ item.name }}</span>
            </v-checkbox>
          </v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </v-list>
  </div>
</template>

<script>
export default {
  name: 'LearningOutcomesAssessmentList',
  props: {
    disabled: {
      type: Boolean,
      default: false,
    },
    form: {
      type: Boolean,
      default: false,
    },
    items: {
      type: Array,
      default: null,
    },
    value: {
      type: Array,
      default: () => [],
    },
  },
  computed: {
    learningOutcomes: {
      get() {
        if (this.value?.length) {
          return this.value
        }
        return this.items.map((_) => ({ disabled: false, selected: false }))
      },
      set(value) {
        this.$emit('input', value)
      },
    },
  },
}
</script>

<style scoped>
.line {
  min-height: 30px;
}
</style>

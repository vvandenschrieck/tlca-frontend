<template>
  <div v-if="items?.length">
    <i v-if="title">{{ title }}</i>

    <v-list class="pa-0">
      <template v-for="(item, i) in items">
        <v-list-item :key="2 * i" class="line pl-3" dense>
          <v-list-item-content class="pa-0">
            <v-list-item-title>
              <v-checkbox
                v-model="learningOutcomes[i].selected"
                class="checkbox ml-1"
                dense
                :disabled="disabled || learningOutcomes[i].disabled"
                hide-details
                :readonly="!form"
                @change="$emit('change', value)"
              >
                <span slot="label" class="checkbox-label text-body-2">
                  {{ item.name }}
                </span>
              </v-checkbox>
            </v-list-item-title>
          </v-list-item-content>

          <v-list-item-action v-if="!hideTakes" class="align-self-baseline">
            <v-chip x-small>{{ item.takes ?? 1 }}</v-chip>
          </v-list-item-action>
        </v-list-item>

        <v-divider
          v-if="!hideDivider && i < items.length - 1"
          :key="2 * i + 1"
          class="mt-2"
        />
      </template>
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
    hideDivider: {
      type: Boolean,
      default: false,
    },
    hideTakes: {
      type: Boolean,
      default: false,
    },
    items: {
      type: Array,
      default: null,
    },
    title: {
      type: String,
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
.checkbox:deep(.v-input--selection-controls__input) {
  align-self: baseline;
}
.checkbox-label {
  text-align: justify;
  white-space: normal;
}
.line {
  min-height: 30px;
}
</style>

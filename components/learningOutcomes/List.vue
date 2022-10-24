<template>
  <div v-if="items?.length">
    <i v-if="title">{{ title }}</i>

    <v-list class="pa-0">
      <template v-for="(item, i) in items">
        <v-list-item :key="2 * i" class="line pl-3" dense>
          <v-list-item-content class="pa-0">
            <v-list-item-title>
              <v-checkbox
                v-model="selected"
                class="checkbox ml-1"
                :color="past[i] ? 'gray' : 'primary'"
                dense
                :disabled="disabled[i]"
                hide-details
                :readonly="!form"
                :ripple="form"
                :value="i"
                @change="update"
              >
                <span slot="label" class="checkbox-label text-body-2">
                  {{ item.name }}
                </span>
              </v-checkbox>
            </v-list-item-title>
          </v-list-item-content>

          <v-list-item-action v-if="!hideTakes" class="align-self-baseline">
            <v-chip :color="takesColor(i)" x-small>
              {{ takesProgress(i) }}
            </v-chip>
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
    takes: {
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
  data() {
    return {
      disabled: [],
      past: [],
      selected: [],
    }
  },
  watch: {
    items: {
      handler: 'update',
      immediate: true,
    },
    value: {
      handler(value) {
        this.disabled = value.map((item) => item.disabled)
        this.past = value.map((item) => item.past)
        this.selected = value.reduce(
          (acc, item, i) => (item.selected ? [...acc, i] : acc),
          []
        )
      },
      immediate: true,
    },
  },
  methods: {
    takesColor(i) {
      if (!this.takes) {
        return 'default'
      }

      const maxTakes = this.items[i]?.takes ?? 1
      return this.takes[i] === maxTakes ? 'success' : 'default'
    },
    takesProgress(i) {
      const maxTakes = this.items[i]?.takes ?? 1
      return this.takes ? `${this.takes[i]} / ${maxTakes}` : maxTakes
    },
    update() {
      const result = this.items?.map((_, i) => ({
        disabled: this.disabled[i] ?? false,
        selected: this.selected.includes(i),
      }))
      this.$emit('input', result)
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

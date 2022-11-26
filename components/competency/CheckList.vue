<template>
  <div v-if="items?.length">
    <i>{{ name }}</i>

    <v-list class="pa-0">
      <v-list-item v-for="(item, i) in items" :key="i" class="line pl-3" dense>
        <v-list-item-content class="pa-0">
          <v-list-item-title>
            <v-checkbox
              v-model="checked"
              class="checkbox ml-1"
              dense
              hide-details
              :off-icon="offIcon"
              :on-icon="onIcon"
              :readonly="!form || readonly"
              :ripple="form && !readonly"
              :value="i"
              @change="update"
            >
              <span slot="label" class="checkbox-label text-subtitle-2">
                {{ item }}
              </span>
            </v-checkbox>
          </v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </v-list>
  </div>
</template>

<script>
export default {
  name: 'CompetencyCheckList',
  props: {
    form: {
      type: Boolean,
      default: false,
    },
    items: {
      type: Array,
      default: null,
    },
    name: {
      type: String,
      default: '',
    },
    readonly: {
      type: Boolean,
      default: false,
    },
    value: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      checked: [],
    }
  },
  computed: {
    offIcon() {
      return this.form ? 'mdi-checkbox-blank-outline' : 'mdi-square-medium'
    },
    onIcon() {
      return this.form ? 'mdi-checkbox-marked' : 'mdi-square-medium'
    },
  },
  watch: {
    items: {
      handler: 'update',
      immediate: true,
    },
    value: {
      handler(value) {
        this.checked =
          value?.reduce(
            (acc, checked, i) => (checked ? [...acc, i] : acc),
            []
          ) ?? []
      },
      immediate: true,
    },
  },
  methods: {
    update() {
      const result = this.items?.map((_, i) => this.checked.includes(i))
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

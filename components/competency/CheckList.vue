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
              :readonly="!form"
              :ripple="form"
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

<template>
  <div>
    <i>{{ name }}</i>

    <v-list class="pa-0 mt-2">
      <v-list-item v-for="(item, i) in items" :key="i" class="line pl-3" dense>
        <v-list-item-content class="pa-0">
          <v-list-item-title>
            <v-checkbox
              v-model="checked[i]"
              class="ml-1"
              dense
              :readonly="!form"
              hide-details
            >
              <span slot="label" class="text-subtitle-2">{{ item }}</span>
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
      required: true,
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
  computed: {
    checked: {
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

<style scoped>
.line {
  min-height: 30px;
}
</style>

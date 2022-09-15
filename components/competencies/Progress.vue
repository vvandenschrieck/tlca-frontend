<template>
  <div>
    <v-progress-circular
      class="progress"
      color="primary"
      :rotate="-90"
      :size="size"
      :value="value"
      :width="width"
    >
      <template v-if="!dense">
        <div>
          <span class="value">{{ value }}</span
          >&thinsp;%
        </div>
        <div v-if="label" class="label">{{ label }}</div>
      </template>
    </v-progress-circular>

    <template v-if="dense"> {{ value }}% </template>
  </div>
</template>

<script>
export default {
  name: 'CompetenciesProgress',
  props: {
    dense: {
      type: Boolean,
      default: false,
    },
    label: {
      type: String,
      default: null,
    },
    value: {
      type: Number,
      required: true,
    },
  },
  computed: {
    size() {
      return this.dense ? 20 : 90
    },
    width() {
      return this.dense ? 4 : 10
    },
  },
}
</script>

<style scoped>
.progress:deep(.v-progress-circular__info) {
  flex-direction: column;
}
.progress .label {
  font-size: 10px;
  margin-top: -5px !important;
}
.progress .value {
  font-size: 20px;
}
</style>

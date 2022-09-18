<template>
  <div>
    <space-switcher v-if="spaces" :items="spaces" />

    <h2>
      <v-skeleton-loader v-if="loading" type="heading" />
      <span v-else>{{ value }}</span>
    </h2>
  </div>
</template>

<script>
export default {
  name: 'PageTitle',
  props: {
    loading: {
      type: Boolean,
      default: false,
    },
    spaces: {
      type: Object,
      default: null,
    },
    value: {
      type: String,
      required: true,
    },
  },
}
</script>

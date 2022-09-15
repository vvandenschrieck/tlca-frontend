<template>
  <h2>
    <v-skeleton-loader v-if="loading" type="heading" />
    <span v-else>{{ value }}</span>
  </h2>
</template>

<script>
export default {
  name: 'PageTitle',
  props: {
    loading: {
      type: Boolean,
      default: false,
    },
    value: {
      type: String,
      required: true,
    },
  },
}
</script>

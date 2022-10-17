<!-- eslint-disable vue/no-v-html -->
<template>
  <div>
    <div v-if="text" v-html="text" />
    <div v-else>{{ $t(`${entity}.no`) }}</div>
  </div>
</template>

<script>
export default {
  name: 'DescriptionContent',
  props: {
    entity: {
      type: String,
      default: 'global.description',
    },
    text: {
      type: String,
      default: null,
    },
  },
}
</script>

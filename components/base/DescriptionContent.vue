<!-- eslint-disable vue/no-v-html -->
<template>
  <div>
    <div v-if="text" v-html="text" />
    <div v-else>{{ $t('global.description.no') }}</div>
  </div>
</template>

<script>
export default {
  name: 'DescriptionContent',
  props: {
    text: {
      type: String,
      default: null,
    },
  },
}
</script>

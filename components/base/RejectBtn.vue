<template>
  <v-btn :disabled="disabled" :loading="loading" text @click="$emit('click')">
    {{ $t('general.reject') }}
  </v-btn>
</template>

<script>
export default {
  name: 'RejectBtn',
  props: {
    disabled: {
      type: Boolean,
      default: false,
    },
    loading: {
      type: Boolean,
      default: false,
    },
  },
}
</script>

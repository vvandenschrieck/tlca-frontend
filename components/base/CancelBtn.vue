<template>
  <v-btn :disabled="disabled" :loading="loading" text @click="$emit('click')">
    {{ $t('general.cancel') }}
  </v-btn>
</template>

<script>
export default {
  name: 'CancelBtn',
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

<template>
  <v-btn :disabled="disabled" :loading="loading" text @click="$emit('click')">
    {{ $t('general.accept') }}
  </v-btn>
</template>

<script>
export default {
  name: 'AcceptBtn',
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

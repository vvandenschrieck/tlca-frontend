<template>
  <v-btn color="error" :disabled="disabled" text @click="$emit('click')">
    {{ $t('general.reset') }}
  </v-btn>
</template>

<script>
export default {
  name: 'ResetBtn',
  props: {
    disabled: {
      type: Boolean,
      default: false,
    },
  },
}
</script>

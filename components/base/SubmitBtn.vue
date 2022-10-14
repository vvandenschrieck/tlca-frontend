<template>
  <v-btn
    color="primary"
    :disabled="disabled"
    :loading="loading"
    text
    type="submit"
  >
    {{ $t(`general.${action}`) }}
  </v-btn>
</template>

<script>
export default {
  name: 'SubmitBtn',
  props: {
    action: {
      type: String,
      default: 'create',
    },
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

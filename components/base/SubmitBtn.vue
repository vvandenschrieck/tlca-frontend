<template>
  <v-btn color="primary" :loading="loading" text type="submit">
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
    loading: {
      type: Boolean,
      default: false,
    },
  },
}
</script>

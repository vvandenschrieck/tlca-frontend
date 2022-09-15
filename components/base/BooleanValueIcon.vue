<template>
  <div class="d-inline-block">
    <span class="rounded-circle pa-1 d-flex" :class="color">
      <v-icon small color="white">{{ icon }}</v-icon>
    </span>
  </div>
</template>

<script>
export default {
  name: 'BooleanValueIcon',
  props: {
    value: {
      type: Boolean,
      required: true,
    },
  },
  computed: {
    color() {
      return this.value ? 'success' : 'error'
    },
    icon() {
      return this.value ? 'mdi-check-bold' : 'mdi-close-thick'
    },
  },
}
</script>

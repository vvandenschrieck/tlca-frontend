<template>
  <v-input :value="value" :error-messages="$attrs.errorMessages">
    <v-rating
      v-model="stars"
      class="ma-auto"
      v-bind="$attrs"
      v-on="$listeners"
    />
  </v-input>
</template>

<script>
export default {
  name: 'StarsField',
  inheritAttrs: false,
  props: {
    value: {
      type: Number,
      default: 0,
    },
  },
  computed: {
    stars: {
      get() {
        return this.value
      },
      set(value) {
        this.$emit('input', value)
      },
    },
  },
}
</script>

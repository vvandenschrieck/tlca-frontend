<template>
  <v-input :value="value" :error-messages="$attrs.errorMessages">
    <v-rating
      class="ma-auto"
      :value="value"
      v-bind="$attrs"
      v-on="$listeners"
      @input="$emit('input', $event)"
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
      required: true,
    },
  },
}
</script>

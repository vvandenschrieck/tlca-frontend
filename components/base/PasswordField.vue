<template>
  <v-text-field
    :value="value"
    v-bind="$attrs"
    :type="type"
    v-on="$listeners"
    @input="$emit('input', $event)"
  >
    <template v-if="value" #append>
      <v-btn
        icon
        small
        tabindex="-1"
        @mousedown="visible = true"
        @mouseup="visible = false"
        @mouseleave="visible = false"
      >
        <v-icon small>
          {{ icon }}
        </v-icon>
      </v-btn>
    </template>
  </v-text-field>
</template>

<script>
export default {
  inheritAttrs: false,
  props: {
    value: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      visible: false,
    }
  },
  computed: {
    type() {
      return this.visible ? 'input' : 'password'
    },
    icon() {
      return this.visible ? 'mdi-eye-off' : 'mdi-eye'
    },
  },
}
</script>

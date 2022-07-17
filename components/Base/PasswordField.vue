<template>
  <v-text-field
    :value="value"
    v-bind="$attrs"
    :type="passwordInputType"
    v-on="$listeners"
    @input="$emit('input', $event)"
  >
    <template v-if="value" #append>
      <v-btn icon>
        <v-icon
          @mousedown="showPassword = true"
          @mouseup="showPassword = false"
        >{{passwordShowIcon}}</v-icon>
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
      showPassword: false,
    }
  },
  computed: {
    passwordInputType() {
      return this.showPassword ? 'input' : 'password'
    },
    passwordShowIcon() {
      return this.showPassword ? 'mdi-eye-off' : 'mdi-eye'
    },
  },
}
</script>

<style>
</style>
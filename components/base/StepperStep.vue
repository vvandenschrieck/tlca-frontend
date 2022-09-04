<template>
  <ValidationObserver v-slot="{ errors }">
    <v-stepper-step editable :rules="[() => !hasErrors(errors)]" :step="step">
      {{ title }}
    </v-stepper-step>

    <v-stepper-content class="content" :step="step">
      <slot />
    </v-stepper-content>
  </ValidationObserver>
</template>

<script>
import { ValidationObserver } from 'vee-validate'

export default {
  name: 'StepperStep',
  components: { ValidationObserver },
  props: {
    step: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
  },
  methods: {
    hasErrors(errors) {
      return Object.values(errors).some((error) => error?.length)
    },
  },
}
</script>

<style scoped>
.content {
  border-left: 1px solid rgba(0, 0, 0, 0.12);
}
</style>

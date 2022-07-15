/* eslint-disable vue/component-definition-name-casing */

import Vue from 'vue'

import { ValidationProvider } from 'vee-validate'
import { VAutocomplete, VSelect, VTextarea, VTextField } from 'vuetify/lib'

// Globally register most common form inputs.
Vue.component('v-autocomplete-with-validation', withValidation(VAutocomplete))
Vue.component('v-select-with-validation', withValidation(VSelect))
Vue.component('v-text-field-with-validation', withValidation(VTextField))
Vue.component('v-textarea-with-validation', withValidation(VTextarea))

// Function to embed a component within a vee-validate ValidationProvider.
export function withValidation(component) {
  return {
    components: { ValidationProvider },
    props: {
      rules: {
        type: [Object, String],
        default: '',
      },
    },
    render(createElement) {
      const slots = Object.entries(this.$slots)
      const scopedSlots = this.$scopedSlots

      return createElement(ValidationProvider, {
        props: {
          name: this.$attrs.label,
          rules: this.rules,
          ...this.$attrs,
        },
        on: { ...this.$listeners },
        scopedSlots: {
          default: ({ errors }) =>
            createElement(
              component,
              {
                props: {
                  errorMessages: errors,
                  ...this.$attrs,
                },
                on: { ...this.$listeners },
                scopedSlots,
              },
              slots.map(([name, slot]) => {
                return createElement(
                  'template',
                  {
                    slot: name,
                  },
                  [slot]
                )
              })
            ),
        },
      })
    },
  }
}

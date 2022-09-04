/* eslint-disable vue/component-definition-name-casing */

import Vue from 'vue'

import { ValidationProvider } from 'vee-validate'
import { VAutocomplete, VSelect, VTextarea, VTextField } from 'vuetify/lib'
import DateTimePicker from '@/components/base/DateTimePicker.vue'
import PasswordField from '@/components/base/PasswordField.vue'
import StarsField from '@/components/base/StarsField.vue'

// Globally register most common form inputs.
Vue.component('v-autocomplete-with-validation', withValidation(VAutocomplete))
Vue.component('v-select-with-validation', withValidation(VSelect))
Vue.component('v-text-field-with-validation', withValidation(VTextField))
Vue.component('v-textarea-with-validation', withValidation(VTextarea))
Vue.component(
  'date-time-picker-with-validation',
  withValidation(DateTimePicker)
)
Vue.component('password-field-with-validation', withValidation(PasswordField))
Vue.component('stars-field-with-validation', withValidation(StarsField))

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
        attrs: {
          ...this.$attrs,
        },
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
                attrs: {
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

/* eslint-disable vue/component-definition-name-casing */

import Vue from 'vue'

import { ValidationProvider } from 'vee-validate'
import { VAutocomplete, VSelect, VTextarea, VTextField } from 'vuetify/lib'
import BasePasswordFiled from '@/components/Base/PasswordField.vue'

// Globally register most common form inputs.
Vue.component('v-autocomplete-with-validation', withValidation(VAutocomplete))
Vue.component('v-select-with-validation', withValidation(VSelect))
Vue.component('v-text-field-with-validation', withValidation(VTextField))
Vue.component('v-textarea-with-validation', withValidation(VTextarea))
Vue.component('base-password-field-with-validation', withValidation(BasePasswordFiled))

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
          ...this.$attrs
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
                  ...this.$attrs
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

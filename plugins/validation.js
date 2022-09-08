/* eslint-disable camelcase */

import { extend } from 'vee-validate'
import {
  alpha_dash,
  between,
  min_value,
  required,
} from 'vee-validate/dist/rules'

extend('alpha_dash', {
  ...alpha_dash,
  message: 'Value can only contain characters and dashes',
})

extend('min_value', {
  ...min_value,
  message: 'Value should be greater than or equal to {min}.',
})

extend('positive', {
  validate(value) {
    return min_value.validate(value, { min: 1 })
  },
  message: 'Value should be strictly positive.',
})

extend('required', {
  ...required,
  message: 'Value is required',
})

extend('stars_required', {
  validate(value) {
    return between.validate(value, { min: 1, max: 3 })
  },
  message: 'Value is required',
})

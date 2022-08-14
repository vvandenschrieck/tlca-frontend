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
  message: 'This field can only contain characters and dashes',
})

extend('positive', {
  validate(value) {
    return min_value.validate(value, { min: 1 })
  },
  message: 'This field can only contain a positive value.',
})

extend('required', {
  ...required,
  message: 'This field is required',
})

extend('stars_required', {
  validate(value) {
    return between.validate(value, { min: 1, max: 3 })
  },
  message: 'This field is required',
})

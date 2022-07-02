/* eslint-disable camelcase */

import { extend } from 'vee-validate'
import { alpha_dash, required } from 'vee-validate/dist/rules'

extend('required', {
  ...required,
  message: 'This field is required',
})

extend('alpha_dash', {
  ...alpha_dash,
  message: 'This field can only contain characters and dashes',
})

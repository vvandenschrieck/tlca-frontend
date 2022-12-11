export default {
  methods: {
    handleError(err, form) {
      if (err.graphQLErrors?.length) {
        const gqlError = err.graphQLErrors[0]

        if (gqlError.extensions?.formErrors) {
          form.setErrors(gqlError.extensions.formErrors)
        }

        if (gqlError.message) {
          return `error.${gqlError.message}`
        }
      }

      return 'error._'
    },
  },
}

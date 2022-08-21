export default function (context, inject) {
  class NotificationManager {
    constructor() {
      this.handler = () => {}
    }

    setHandler(handler) {
      this.handler = handler
    }

    displaySuccessMessage(text) {
      this.handler({ type: 'success', text })
    }

    displayErrorMessage(err) {
      // Manage all the GraphQL errors
      // except those from the signIn and signUp mutations
      if (err.graphQLErrors?.length) {
        err.graphQLErrors.forEach((err) => {
          if (
            err.path &&
            !(err.path.includes('signIn') || err.path.includes('signUp'))
          ) {
            this.handler({
              type: 'error',
              text: context.app.i18n.t(`error.${err.message}`),
            })
          }
        })
      } else {
        this.handler({ type: 'error', text: err })
      }
    }
  }

  inject('notificationManager', new NotificationManager())
}

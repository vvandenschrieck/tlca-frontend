export default function (context, inject) {
  class ErrorManager {
    constructor() {
      this.handler = () => {}
    }

    setHandler(handler) {
      this.handler = handler
    }

    displayError(err) {
      err.graphQLErrors.forEach((err) => {
        if (!(err.path.includes('signIn') || err.path.includes('signUp'))) {
          this.handler(context.app.i18n.t(`error.${err.message}`))
        }
      })
    }
  }

  inject('errorManager', new ErrorManager())
}

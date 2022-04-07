import { LocalScheme } from '~auth/runtime'

import meGql from '~/gql/me.gql'
import signInGql from '~/gql/signIn.gql'
import signOutGql from '~/gql/signOut.gql'

export default class GraphQLScheme extends LocalScheme {
  async login(credentials, { reset = true } = {}) {
    const {
      apolloProvider: { defaultClient: apolloClient },
      $apolloHelpers,
    } = this.$auth.ctx.app

    if (reset) {
      this.$auth.reset({ resetInterceptor: false })
    }

    const response = await apolloClient
      .mutate({
        mutation: signInGql,
        variables: credentials,
      })
      .then(({ data }) => data && data.signIn)

    this.token.set(response.token)

    await $apolloHelpers.onLogin(response.token)
    await this.fetchUser()
    return response.token
  }

  fetchUser() {
    const {
      apolloProvider: { defaultClient: apolloClient },
    } = this.$auth.ctx.app

    if (!this.check().valid) {
      return
    }

    return apolloClient
      .query({
        query: meGql,
      })
      .then(({ data }) => {
        if (!data.me) {
          const error = new Error(`User Data response not resolved`)
          return Promise.reject(error)
        }

        // Add a function to check whether the logged in user has any roles from a list.
        data.me.hasAnyRoles = (...roles) => {
          return (
            data.me &&
            roles.some((element, _index, _array) => {
              return data.me.roles.includes(element)
            })
          )
        }

        this.$auth.setUser(data.me)

        return data.me
      })
      .catch((error) => {
        this.$auth.callOnError(error, { method: 'fetchUser' })
        return Promise.reject(error)
      })
  }

  async logout() {
    const {
      apolloProvider: { defaultClient: apolloClient },
      $apolloHelpers,
    } = this.$auth.ctx.app

    await apolloClient
      .mutate({
        mutation: signOutGql,
      })
      .catch(() => {})

    $apolloHelpers.onLogout()
    return this.$auth.reset({ resetInterceptor: false })
  }

  initializeRequestInterceptor() {}

  reset() {
    this.$auth.setUser(false)
    this.token.reset()
  }
}

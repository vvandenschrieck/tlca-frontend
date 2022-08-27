import { RefreshScheme } from '~auth/runtime'

import meGql from '~/gql/me.gql'
import refreshTokenGql from '~/gql/refreshToken.gql'
import signInGql from '~/gql/signIn.gql'
import signOutGql from '~/gql/signOut.gql'

export default class GraphQLScheme extends RefreshScheme {
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
          const err = new Error(`User Data response not resolved`)
          return Promise.reject(err)
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
      .catch((err) => {
        this.$auth.callOnError(err, { method: 'fetchUser' })
        return Promise.reject(err)
      })
  }

  initializeRequestInterceptor() {}

  async login(credentials, { reset = true } = {}) {
    const {
      apolloProvider: { defaultClient: apolloClient },
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
    this.refreshToken.set(response.refreshToken)

    await this.fetchUser()
    return response.token
  }

  async logout() {
    const {
      apolloProvider: { defaultClient: apolloClient },
    } = this.$auth.ctx.app

    await apolloClient
      .mutate({
        mutation: signOutGql,
      })
      .catch(() => {})

    return this.$auth.reset({ resetInterceptor: false })
  }

  async refreshTokens() {
    const {
      apolloProvider: { defaultClient: apolloClient },
    } = this.$auth.ctx.app

    const response = await apolloClient
      .mutate({
        mutation: refreshTokenGql,
        variables: { token: this.refreshToken.get() },
      })
      .then(({ data }) => data && data.refreshToken)

    this.token.set(response.token)
    this.refreshToken.set(response.refreshToken)

    return response.token
  }

  reset() {
    this.$auth.setUser(false)
    this.token.reset()
    this.refreshToken.reset()
  }
}

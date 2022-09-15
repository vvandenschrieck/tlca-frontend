import { InMemoryCache, defaultDataIdFromObject } from 'apollo-cache-inmemory'
import { fromPromise } from 'apollo-link'
import { setContext } from 'apollo-link-context'
import { onError } from 'apollo-link-error'

const cache = new InMemoryCache({
  dataIdFromObject: (object) => {
    switch (object.__typename) {
      case 'Competency':
      case 'Course':
      case 'Partner':
      case 'Program':
        return `${object.__typename}:${object.code}`

      case 'User':
        return `User:${object.username}`

      default:
        return defaultDataIdFromObject(object)
    }
  },
})

export default (context) => {
  const authLink = setContext((_, { headers }) => {
    const token = context.$auth.strategy.token.get()
    return {
      headers: {
        ...headers,
        Authorization: token,
      },
    }
  })

  const errorLink = onError((err) => {
    const { forward, graphQLErrors, operation } = err

    if (graphQLErrors) {
      for (const err of graphQLErrors) {
        switch (err.extensions.code) {
          case 'UNAUTHENTICATED':
            return fromPromise(
              context.$auth.refreshTokens().catch(() => {
                context.$auth.reset()
                context.$auth.redirect('login')
              })
            )
              .filter((value) => Boolean(value))
              .flatMap((token) => {
                operation.setContext({
                  headers: {
                    ...operation.getContext().headers,
                    Authorization: `Bearer ${token}`,
                  },
                })

                return forward(operation)
              })
        }
      }
    }

    context.$notificationManager.displayErrorMessage(err)
  })

  return {
    cache,
    httpEndpoint: context.$config.graphqlEndpoint,
    link: authLink.concat(errorLink),
  }
}

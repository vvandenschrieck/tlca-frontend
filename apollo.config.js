import { InMemoryCache, defaultDataIdFromObject } from 'apollo-cache-inmemory'
import { onError } from 'apollo-link-error'

const cache = new InMemoryCache({
  dataIdFromObject: (object) => {
    switch (object.__typename) {
      case 'Course':
        return `Course:${object.code}`
      default:
        return defaultDataIdFromObject(object)
    }
  },
})

export default (context) => {
  const promptErrorMessageLink = onError((err) => {
    if (err.graphQLErrors?.length) {
      context.$errorManager.displayError(err)
    }
  })

  return {
    cache,
    httpEndpoint:
      process.env.NODE_ENV !== 'production'
        ? 'http://localhost:4001'
        : 'https://api.tlca.eu',
    link: promptErrorMessageLink,
  }
}

import { InMemoryCache, defaultDataIdFromObject } from 'apollo-cache-inmemory'
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
  const promptErrorMessageLink = onError((err) => {
    context.$notificationManager.displayErrorMessage(err)
  })

  return {
    cache,
    httpEndpoint: context.$config.graphqlEndpoint,
    link: promptErrorMessageLink,
  }
}

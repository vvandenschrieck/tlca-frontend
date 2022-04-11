import { InMemoryCache, defaultDataIdFromObject } from 'apollo-cache-inmemory'
import { onError } from 'apollo-link-error'
// import { gql } from 'graphql-tag'

const cache = new InMemoryCache({
  dataIdFromObject: (object) => {
    switch (object.__typename) {
      case 'Competency':
      case 'Course':
      case 'Partner':
      case 'Program':
        return `${object.__typename}:${object.code}`
      case 'User':
        return `User:${object.id}`
      default:
        return defaultDataIdFromObject(object)
    }
  },
})

export default (context) => {
  const promptErrorMessageLink = onError((err) => {
    context.$notificationManager.displayErrorMessage(err)
  })

  // const typeDefs = gql`
  // `

  // const resolvers = {
  // }

  return {
    cache,
    // typeDefs,
    // resolvers,
    httpEndpoint:
      process.env.NODE_ENV !== 'production'
        ? 'http://localhost:4001'
        : 'https://api.tlca.eu',
    link: promptErrorMessageLink,
  }
}

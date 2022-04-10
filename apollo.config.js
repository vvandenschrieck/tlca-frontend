import { InMemoryCache, defaultDataIdFromObject } from 'apollo-cache-inmemory'
import { onError } from 'apollo-link-error'
import { gql } from 'graphql-tag'

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
  const isAuthenticated = function () {
    return !!context.$auth?.user?.id
  }

  const promptErrorMessageLink = onError((err) => {
    context.$notificationManager.displayErrorMessage(err)
  })

  const typeDefs = gql`
    extend type Course {
      hasRequestedInvite: Boolean
      isCoordinator: Boolean
      isRegistered: Boolean
      isTeacher: Boolean
    }
  `

  const resolvers = {
    Course: {
      hasRequestedInvite(course) {
        if (!isAuthenticated()) {
          return null
        }

        return (
          !!course.registration && course.registration.invite === 'REQUESTED'
        )
      },
      isCoordinator(course) {
        if (!isAuthenticated()) {
          return null
        }

        return (
          course.coordinator && course.coordinator.id === context.$auth.user.id
        )
      },
      isRegistered(course) {
        if (!isAuthenticated()) {
          return null
        }

        return !!course.registration && !course.registration.invite
      },
      isTeacher(course) {
        if (!isAuthenticated()) {
          return null
        }

        return (
          course.teachers &&
          course.teachers.some((t) => t.id === context.$auth.user.id)
        )
      },
    },
  }

  return {
    cache,
    typeDefs,
    resolvers,
    httpEndpoint:
      process.env.NODE_ENV !== 'production'
        ? 'http://localhost:4001'
        : 'https://api.tlca.eu',
    link: promptErrorMessageLink,
  }
}

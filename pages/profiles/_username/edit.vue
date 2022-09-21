<template>
  <ApolloQuery
    v-slot="{ isLoading, result: { data: user, error } }"
    :query="require('~/gql/users/edit/getUser.gql')"
    :update="(data) => data.user"
    :variables="{ username }"
  >
    <h2>{{ title }}</h2>

    <div v-if="isLoading">{{ $t('global.loading') }}</div>

    <form-user v-else-if="user" edit :user="user" />

    <div v-else-if="error">{{ $t('error.unexpected') }}</div>
  </ApolloQuery>
</template>

<script>
export default {
  name: 'EditUserPage',
  head() {
    return {
      title: this.title,
    }
  },
  computed: {
    title() {
      return this.$t('user.edit')
    },
    username() {
      return this.$route.params.username
    },
  },
  meta: {
    roles: ['user'],
  },
}
</script>

<template>
  <ApolloQuery
    :query="require('~/gql/admin/getUsers.gql')"
    :update="(data) => data.users"
  >
    <template #default="{ result: { error, data }, isLoading }">
      <div v-if="isLoading || data">
        <bread-crumb :items="navItems('admin', 'user')" />

        <p>Admin space : users</p>
        <ul>
          <li v-for="user in data" :key="user.id">{{ user }}</li>
        </ul>
      </div>

      <div v-else-if="error">An error occurred</div>
    </template>
  </ApolloQuery>
</template>

<script>
import breadcrumb from '@/mixins/breadcrumb.js'

export default {
  name: 'AdminUsersPage',
  mixins: [breadcrumb],
  meta: {
    roles: ['admin'],
  },
}
</script>

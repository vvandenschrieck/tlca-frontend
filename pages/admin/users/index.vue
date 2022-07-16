<template>
  <ApolloQuery
    :query="require('~/gql/admin/getUsers.gql')"
    :update="(data) => data.users"
  >
    <template #default="{ result: { error, data }, isLoading }">
      <div v-if="isLoading || data">
        <h2>{{ $tc('user._', 2) }}</h2>

        <v-data-table
          v-if="data"
          :headers="headers"
          :items="data"
          :items-per-page="5"
          class="elevation-1"
        >
          <template #item.firstName="{ value: firstName }">{{ firstName || '—' }}</template>
          <template #item.lastName="{ value: lastName }">{{ lastName || '—' }}</template>
          <template #item.roles="{ value: roles }">
            <v-chip-group active-class="primary--text" column max="0" multiple>
              <v-chip
                v-for="role in roles"
                :key="role"
                v-t="`user.role.${role}`"
                small
              >
              </v-chip>
            </v-chip-group>
          </template>
          <template #item.isValidated="{ value: validated }">
            <div class="d-inline-block">
              <span
                class="rounded-circle pa-1 d-flex"
                :class="{ error: !validated, success: validated }"
              >
                <v-icon small color="white">{{
                  validated ? 'mdi-check-bold' : 'mdi-close-thick'
                }}</v-icon>
              </span>
            </div>
          </template>
        </v-data-table>

        <v-skeleton-loader v-else type="table"></v-skeleton-loader>
      </div>

      <div v-else-if="error">An error occurred</div>
    </template>
  </ApolloQuery>
</template>

<script>
export default {
  name: 'AdminUsersPage',
  computed: {
    headers() {
      return [
        { text: this.$t('user.first_name'), value: 'firstName' },
        { text: this.$t('user.last_name'), value: 'lastName' },
        { text: this.$t('user.username'), value: 'username' },
        { text: this.$tc('user.role._', 2), value: 'roles' },
        {
          text: this.$t('general.validated'),
          value: 'isValidated',
          align: 'center',
        },
      ]
    },
  },
  meta: {
    roles: ['admin'],
  },
}
</script>

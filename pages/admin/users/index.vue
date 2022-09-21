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
          :items-per-page="15"
          class="elevation-1"
        >
          <template #item.firstName="{ value: firstName }">
            {{ firstName ?? '—' }}
          </template>

          <template #item.lastName="{ value: lastName }">
            {{ lastName ?? '—' }}
          </template>

          <template #item.roles="{ value: roles }">
            <v-chip-group active-class="primary--text" column max="0" multiple>
              <v-chip v-for="role in roles" :key="role" value="coursou" small>
                {{ $t(`user.role.${role}`) }}
              </v-chip>
            </v-chip-group>
          </template>

          <template #item.isConfirmed="{ value: isConfirmed }">
            <boolean-value-icon :value="isConfirmed" />
          </template>

          <template #item.actions="{ item }">
            <ApolloMutation
              v-if="!item.isConfirmed"
              v-slot="{ mutate, loading }"
              :mutation="require('~/gql/accounts/resendConfirmationEmail.gql')"
              tag="span"
              :variables="{ username: item.username }"
            >
              <v-btn icon :loading="loading" small @click.stop="mutate">
                <v-icon small>mdi-email-fast</v-icon>
              </v-btn>
            </ApolloMutation>
          </template>
        </v-data-table>

        <v-skeleton-loader v-else type="table"></v-skeleton-loader>
      </div>

      <div v-else-if="error">{{ $t('error.unexpected') }}</div>
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
          text: this.$t('general.confirmed'),
          value: 'isConfirmed',
          align: 'center',
        },
        {
          cellClass: 'text-right',
          class: 'text-right',
          sortable: false,
          text: this.$tc('general.action', 2),
          value: 'actions',
        },
      ]
    },
  },
  meta: {
    roles: ['admin'],
  },
}
</script>

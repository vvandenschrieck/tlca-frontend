<template>
  <ApolloQuery
    v-slot="{ isLoading, result: { error } }"
    :query="require('~/gql/admin/getUsers.gql')"
    :update="(data) => data.users"
    @result="setResult"
  >
    <page-title :loading="!!isLoading" :value="title" />

    <v-data-table
      v-if="!error"
      class="elevation-1"
      :headers="headers"
      :items="users"
      :items-per-page="15"
      :loading="!!isLoading"
    >
      <template #item.roles="{ value: roles }">
        <v-chip-group column max="0" multiple>
          <v-chip v-for="role in roles" :key="role" small>
            {{ $t(`user.role.${role}`) }}
          </v-chip>
        </v-chip-group>
      </template>

      <template #item.isConfirmed="{ value: isConfirmed }">
        <boolean-value-icon :value="isConfirmed" />
      </template>

      <template #item.actions="{ item }">
        <send-confirmation-email-btn
          v-if="!item.isConfirmed"
          dense
          tag="span"
          :username-or-email="item.username"
          @done="onConfirmationEmailSent"
        />
      </template>
    </v-data-table>

    <div v-else>{{ $t('error.unexpected') }}</div>
  </ApolloQuery>
</template>

<script>
import titles from '@/mixins/titles.js'

export default {
  name: 'AdminUsersPage',
  mixins: [titles],
  data() {
    return {
      users: [],
    }
  },
  head() {
    return {
      title: this.getTitle(this.title, null, 'admin'),
    }
  },
  computed: {
    headers() {
      return [
        { text: this.$t('user.first_name'), value: 'firstName' },
        { text: this.$t('user.last_name'), value: 'lastName' },
        { text: this.$t('user.email'), value: 'email' },
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
    title() {
      return this.$tc('user._', 2)
    },
  },
  methods: {
    onConfirmationEmailSent({ data: { sendConfirmationEmail: result } }) {
      if (result) {
        this.$notificationManager.displaySuccessMessage(
          this.$t('success.CONFIRMATION_EMAIL_SEND')
        )
      }
    },
    setResult({ data: users }) {
      this.users =
        users?.map((u) => ({
          ...u,
          firstName: u.firstName ?? '—',
          lastName: u.lastName ?? '—',
        })) ?? []
    },
  },
  meta: {
    roles: ['admin'],
  },
}
</script>

<template>
  <v-data-table
    v-if="course.registrations"
    class="elevation-1"
    group-by="status"
    :group-desc="true"
    :headers="dataHeaders"
    :items="registrations"
    :items-per-page="5"
  >
    <template #group.header="{ group, headers, isOpen, toggle }">
      <td :colspan="headers.length">
        <v-row align="center">
          <v-col class="group-header">
            {{ $t(`course.registrations.${group}`) }}
          </v-col>

          <v-col align="right">
            <v-btn icon @click="toggle">
              <v-icon>{{ `mdi-chevron-${isOpen ? 'up' : 'down'}` }}</v-icon>
            </v-btn>
          </v-col>
        </v-row>
      </td>
    </template>

    <template #item.date="{ item: { date } }">
      {{ formatDateTimeFull(date) }}
    </template>

    <template #item.group="{ item }">
      <ApolloMutation
        v-if="item.status === 'registered'"
        v-slot="{ mutate, loading }"
        :mutation="require('../../gql/updateGroup.gql')"
        :variables="{ id: item.id, group: item.innerGroup }"
        @done="groupUpdated"
      >
        <v-edit-dialog large @save="mutate">
          {{
            item.group ? item.group + 1 : $t('course.registrations.no_group')
          }}

          <v-select
            slot="input"
            v-model="item.innerGroup"
            clearable
            :disabled="loading"
            :items="groups"
            :label="$t('course.registrations.group')"
          />
        </v-edit-dialog>
      </ApolloMutation>

      <span v-else>—</span>
    </template>

    <template #item.actions="{ item: { id, invite } }">
      <ApolloMutation
        v-if="invite === 'REQUESTED'"
        v-slot="{ mutate, loading }"
        :mutation="require('../../gql/acceptInvitationRequest.gql')"
        tag="span"
        :variables="{ id }"
        @done="groupUpdated"
      >
        <v-btn icon :loading="loading" small @click="mutate">
          <v-icon small>mdi-account-plus</v-icon>
        </v-btn>
      </ApolloMutation>
      <v-btn icon small @click="remove(id)">
        <v-icon small>mdi-delete</v-icon>
      </v-btn>
    </template>
  </v-data-table>
</template>

<script>
import datetime from '@/mixins/datetime.js'

export default {
  name: 'RegistrationsList',
  mixins: [datetime],
  props: {
    course: {
      type: Object,
      required: true,
    },
  },
  computed: {
    dataHeaders() {
      const headers = [
        {
          text: this.$t('course.registrations.name_or_email'),
          value: 'nameOrEmail',
        },
        {
          text: this.$t('course.registrations.date'),
          value: 'date',
        },
        {
          groupable: true,
          text: this.$t('course.registrations.status'),
          value: 'status',
        },
      ]

      if (this.course.groups?.length) {
        headers.push({
          text: this.$t('course.registrations.group'),
          value: 'group',
        })
      }

      headers.push({
        cellClass: 'text-right',
        class: 'text-right',
        sortable: false,
        text: this.$tc('general.action', 2),
        value: 'actions',
      })

      return headers
    },
    groups() {
      const n = this.course.groups?.length
      if (n) {
        return [...Array(n).keys()].map((i) => ({
          text: i + 1,
          value: i,
        }))
      }

      return null
    },
    registrations() {
      return this.course.registrations.map((item) => ({
        ...item,
        innerGroup: item.group,
        nameOrEmail: this.nameOrEmail(item),
        status: item.invite ? 'invites' : 'registered',
      }))
    },
  },
  methods: {
    groupUpdated({
      data: {
        updateGroup: { group, id },
      },
    }) {
      const registration = this.course.registrations.find((r) => r.id === id)
      if (registration) {
        registration.group = group
      }
    },
    nameOrEmail(registration) {
      return (
        registration.user?.displayName ||
        registration.user?.email ||
        registration.email
      )
    },
    remove(id) {
      // TODO: remove this ID
    },
  },
}
</script>

<style scoped>
.group-header {
  font-variant: small-caps;
}
</style>

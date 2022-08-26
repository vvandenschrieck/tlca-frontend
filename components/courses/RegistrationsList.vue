<template>
  <div>
    <v-data-table
      v-if="course.registrations"
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

      <template #item.datetime="{ item: { datetime } }">
        {{ formatDateTimeFull(datetime) }}
      </template>

      <template #item.group.teaching="{ item }">
        <ApolloMutation
          v-if="item.status === 'registered'"
          v-slot="{ mutate, loading }"
          :mutation="
            item.innerGroup !== null
              ? require('../../gql/updateGroup.gql')
              : require('../../gql/removeGroup.gql')
          "
          :variables="{ group: item.innerGroup, id: item.id, type: 'TEACHING' }"
          @done="groupUpdated"
        >
          <v-edit-dialog large @save="mutate">
            {{
              item.group?.teaching !== null
                ? item.group.teaching + 1
                : $t('course.registrations.no_group')
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

      <template #item.actions="{ item: { id, invitation } }">
        <ApolloMutation
          v-if="invitation === 'REQUESTED'"
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
  </div>
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
          value: 'datetime',
        },
        {
          groupable: true,
          text: this.$t('course.registrations.status'),
          value: 'status',
        },
      ]

      if (this.course.groups?.teaching?.length) {
        headers.push({
          text: this.$t('course.registrations.group'),
          value: 'group.teaching',
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
      const n = this.course.groups?.teaching?.length
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
        innerGroup: item.group?.teaching,
        nameOrEmail: this.nameOrEmail(item),
        status: item.invitation ? 'invites' : 'registered',
      }))
    },
  },
  methods: {
    groupUpdated({ data }) {
      const result = data.updateGroup || data.removeGroup

      const registration = this.course.registrations.find(
        (r) => r.id === result.id
      )
      if (registration) {
        registration.group.teaching = result.group.teaching
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

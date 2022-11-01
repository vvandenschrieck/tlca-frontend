<template>
  <ApolloQuery
    v-slot="{ isLoading, result: { error } }"
    :query="query.query"
    :variables="query.variables"
    @result="setData"
  >
    <v-data-table
      v-if="!error"
      group-by="status"
      :group-desc="true"
      :headers="dataHeaders"
      :items="registrations"
      :items-per-page="15"
      :loading="!!isLoading"
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
            item.innerGroup.teaching !== null
              ? require('~/gql/updateGroup.gql')
              : require('~/gql/removeGroup.gql')
          "
          :variables="{
            group: item.innerGroup.teaching,
            id: item.id,
            type: 'TEACHING',
          }"
        >
          <v-edit-dialog large @save="mutate">
            {{
              item.group && item.group.teaching !== null
                ? groupName('teaching', item.group.teaching)
                : $t('course.registrations.no_group')
            }}

            <v-select
              slot="input"
              v-model="item.innerGroup.teaching"
              clearable
              :disabled="loading"
              :items="teachingGroups"
              item-text="name"
              item-value="i"
              :label="$t('course.groups.teaching._')"
            />
          </v-edit-dialog>
        </ApolloMutation>

        <span v-else>—</span>
      </template>

      <template #item.group.working="{ item }">
        <ApolloMutation
          v-if="item.status === 'registered'"
          v-slot="{ mutate, loading }"
          :mutation="
            item.innerGroup.working !== null
              ? require('~/gql/updateGroup.gql')
              : require('~/gql/removeGroup.gql')
          "
          :variables="{
            group: item.innerGroup.working,
            id: item.id,
            type: 'WORKING',
          }"
        >
          <v-edit-dialog large @save="mutate">
            {{
              item.group && item.group.working !== null
                ? groupName('working', item.group.working)
                : $t('course.registrations.no_group')
            }}
            <v-select
              slot="input"
              v-model="item.innerGroup.working"
              clearable
              :disabled="loading"
              :items="workingGroups"
              item-text="name"
              item-value="i"
              :label="$t('course.groups.working._')"
            />
          </v-edit-dialog>
        </ApolloMutation>

        <span v-else>—</span>
      </template>

      <template #item.actions="{ item: { id, invitation } }">
        <ApolloMutation
          v-if="invitation === 'REQUESTED'"
          v-slot="{ mutate, loading }"
          :mutation="require('~/gql/registrations/acceptInvitationRequest.gql')"
          tag="span"
          :variables="{ id }"
        >
          <v-btn icon :loading="loading" small @click="mutate">
            <v-icon small>mdi-account-plus</v-icon>
          </v-btn>
        </ApolloMutation>

        <ApolloMutation
          v-slot="{ mutate, loading }"
          :mutation="require('~/gql/registrations/deleteRegistration.gql')"
          tag="span"
          :variables="{ id }"
          @done="(r) => registrationDeleted(id, r)"
        >
          <v-btn icon :loading="loading" small @click="mutate">
            <v-icon small>mdi-delete</v-icon>
          </v-btn>
        </ApolloMutation>
      </template>
    </v-data-table>

    <div v-else>{{ $t('error.unexpected') }}</div>
  </ApolloQuery>
</template>

<script>
import datetime from '@/mixins/datetime.js'
import utils from '@/mixins/utils.js'

export default {
  name: 'RegistrationsList',
  mixins: [datetime, utils],
  props: {
    courseCode: {
      type: String,
      default: null,
    },
    programCode: {
      type: String,
      default: null,
    },
  },
  data() {
    return {
      course: null,
      registrations: [],
    }
  },
  computed: {
    dataHeaders() {
      const headers = [
        {
          text: this.$t('registration.name_or_email'),
          value: 'nameOrEmail',
        },
        { text: this.$t('registration.date'), value: 'datetime' },
        {
          groupable: true,
          text: this.$t('registration.status'),
          value: 'status',
        },
      ]

      if (this.course?.hasTeachingGroups) {
        headers.push({
          text: this.$t('course.groups.teaching._'),
          value: 'group.teaching',
        })
      }

      if (this.course?.hasWorkingGroups) {
        headers.push({
          text: this.$t('course.groups.working._'),
          value: 'group.working',
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
    query() {
      const path = this.courseCode ? 'Course' : 'Program'
      const variables = this.courseCode
        ? { courseCode: this.courseCode }
        : { programCode: this.programCode }

      return {
        query: require(`~/gql/components/get${path}Registrations.gql`),
        variables,
      }
    },
    teachingGroups() {
      return this.course.groups.teaching?.map((g, i) => ({
        ...g,
        name: this.groupName('teaching', i),
        i,
      }))
    },
    workingGroups() {
      return this.course.groups.working?.map((g, i) => ({
        ...g,
        name: this.groupName('working', i),
        i,
      }))
    },
  },
  methods: {
    groupName(type, i) {
      return (
        this.course.groups[type][i].name ??
        this.$t('course.registrations.group_name', { nb: i })
      )
    },
    nameOrEmail(registration) {
      const user = registration.user
      const email = user?.email ?? registration.email
      return user?.displayName === user?.username ? email : user?.displayName
    },
    registrationDeleted(id, { data: { deleteRegistration } }) {
      if (!deleteRegistration) {
        return this.$notificationManager.displayErrorMessage(
          this.$t('error.REGISTRATION_DELETE')
        )
      }

      // Update local cache.
      const { defaultClient: apolloClient } = this.$apolloProvider
      const data = apolloClient.readQuery(this.query)
      const i = data.registrations.findIndex((r) => r.id === id)
      apolloClient.writeQuery({
        ...this.query,
        data: {
          registrations: [
            ...data.registrations.slice(0, i),
            ...data.registrations.slice(i + 1),
          ],
        },
      })

      this.$notificationManager.displaySuccessMessage(
        this.$t('success.REGISTRATION_DELETE')
      )
    },
    setData({ data }) {
      if (!data) {
        return
      }

      this.course = data.course
      this.registrations = data.registrations?.map((item) => ({
        ...item,
        innerGroup: {
          teaching: item.group?.teaching,
          working: item.group?.working,
        },
        nameOrEmail: this.nameOrEmail(item),
        status: item.invitation ? 'invites' : 'registered',
      }))
    },
  },
}
</script>

<style scoped>
.group-header {
  font-variant: small-caps;
}
</style>

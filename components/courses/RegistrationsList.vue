<template>
  <v-data-table
    v-if="items"
    :headers="dataHeaders"
    :items="registrations"
    group-by="status"
    :group-desc="true"
    :items-per-page="5"
    class="elevation-1"
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
    <template #item.actions="{ item: { id, invite } }">
      <v-btn v-if="invite === 'REQUESTED'" icon small @click="accept(id)">
        <v-icon small>mdi-account-plus</v-icon>
      </v-btn>
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
    items: {
      type: Array,
      required: true,
    },
  },
  computed: {
    dataHeaders() {
      return [
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
        {
          cellClass: 'text-right',
          class: 'text-right',
          sortable: false,
          text: this.$tc('general.action', 2),
          value: 'actions',
        },
      ]
    },
    registrations() {
      return this.items.map((item) => ({
        ...item,
        nameOrEmail: this.nameOrEmail(item),
        status: item.invite ? 'invites' : 'registered',
      }))
    },
  },
  methods: {
    accept(id) {
      console.log('Accepting invitation request', id)
    },
    nameOrEmail(registration) {
      return (
        registration.user?.displayName ||
        registration.user?.email ||
        registration.email
      )
    },
    remove(id) {
      console.log('Deleting registration', id)
    },
  },
}
</script>

<style scoped>
.group-header {
  font-variant: small-caps;
}
</style>

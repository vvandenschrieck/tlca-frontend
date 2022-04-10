<template>
  <generic-info-panel
    :title="$t('registration._')"
    icon="mdi-book"
    :items="items"
  >
    <div v-if="$auth.user" class="text-center">
      <!-- Registration button -->
      <v-btn v-if="canRegister" small color="success">
        <v-icon left>mdi-plus</v-icon>
        <span v-t="'course.register'"></span>
      </v-btn>

      <!-- Invite request button -->
      <ApolloMutation
        v-else-if="canRequestInvite"
        :mutation="(gql) => gql(requestInvite.query)"
        :variables="requestInvite.variables"
      >
        <template #default="{ mutate, loading }">
          <v-btn small color="success" :loading="loading" @click="mutate()">
            <v-icon left>mdi-email-plus</v-icon>
            <span v-t="'course.request_invite'"></span>
          </v-btn>
        </template>
      </ApolloMutation>
    </div>
  </generic-info-panel>
</template>

<script>
import { mutation } from 'gql-query-builder'
import datetime from '@/mixins/datetime.js'

export default {
  name: 'RegistrationInfoPanel',
  mixins: [datetime],
  props: {
    course: {
      type: Object,
      required: true,
    },
  },
  computed: {
    canRegister() {
      return (
        this.course.visibility === 'PUBLIC' &&
        this.$auth.user?.hasAnyRoles('student') &&
        !(
          this.course.isCoordinator ||
          this.course.isTeacher ||
          this.course.isRegistered
        )
      )
    },
    canRequestInvite() {
      return (
        this.course.visibility === 'INVITE_ONLY' &&
        this.$auth.user &&
        !(
          this.course.isCoordinator ||
          this.course.isTeacher ||
          this.course.isRegistered ||
          this.course.hasRequestedInvite
        )
      )
    },
    items() {
      const items = []

      // Course visibility
      const visibility = this.course.visibility.toLowerCase()
      items.push({
        icon: 'mdi-eye',
        text: this.$t(`course.visibility.${visibility}`),
        tooltip: this.$t('course.visibility._'),
      })

      // Registration status or date
      const registration = this.course.registration
      let registrationStatus = this.$t('student.not_registered_yet')
      if (registration?.invite) {
        registrationStatus = {
          REQUESTED: this.$t('registration.invite_request_sent'),
          SENT: this.$t('registration.invite_received'),
        }[registration.invite]
      } else if (registration?.date) {
        registrationStatus = this.$t('registration.registered_on', {
          date: this.formatDateFull(registration.date),
        })
      }
      items.push({
        icon: 'mdi-calendar',
        text: registrationStatus,
        tooltip: this.$t('registration.status'),
      })

      return items
    },
    requestInvite() {
      const fields = [
        'code',
        'hasRequestedInvite @client',
        {
          registration: ['date', 'invite'],
        },
      ]

      return mutation(
        {
          operation: 'requestInvite',
          variables: {
            code: { value: this.course.code, type: 'ID', required: true },
          },
          fields,
        },
        null,
        {
          operationName: 'RequestInvite',
        }
      )
    },
  },
}
</script>

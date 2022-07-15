<template>
  <generic-info-panel
    :title="$tc('registration._', 1)"
    icon="mdi-book"
    :items="items"
  >
    <div v-if="$auth.user" class="text-center">
      <!-- Registration button -->
      <!-- TODO: remove the 'invite' field when moving to Apollo client 3
           it has been queried now to be sure that the query on the course
          page gets refreshed correctly when the mutation is done -->
      <ApolloMutation
        :mutation="require('../../gql/register.gql')"
        :variables="{ code: course.code }"
        @done="registered"
      >
        <template #default="{ mutate, loading }">
          <v-btn
            v-if="canRegister"
            small
            color="success"
            :loading="loading"
            @click="mutate()"
          >
            <v-icon left>mdi-plus</v-icon>
            <span>{{ $t('course.register') }}</span>
          </v-btn>
        </template>
      </ApolloMutation>

      <!-- Invite request button -->
      <ApolloMutation
        :mutation="require('../../gql/requestInvite.gql')"
        :variables="{ code: course.code }"
        @done="inviteRequestSent"
      >
        <template #default="{ mutate, loading }">
          <v-btn
            v-if="canRequestInvite"
            small
            color="success"
            :loading="loading"
            @click="mutate()"
          >
            <v-icon left>mdi-email-plus</v-icon>
            <span>{{ $t('course.request_invite') }}</span>
          </v-btn>
        </template>
      </ApolloMutation>
    </div>
  </generic-info-panel>
</template>

<script>
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
  },
  methods: {
    inviteRequestSent() {
      this.$notificationManager.displaySuccessMessage(
        this.$t('success.REQUEST_INVITE_SENT')
      )
    },
    registered() {
      this.$notificationManager.displaySuccessMessage(
        this.$t('success.REGISTERED')
      )
    },
  },
}
</script>

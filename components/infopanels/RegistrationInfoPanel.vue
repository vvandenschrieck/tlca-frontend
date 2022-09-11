<template>
  <ApolloQuery
    v-if="$auth.user"
    v-slot="{ isLoading, result: { error } }"
    :query="require('~/gql/registrations/getRegistration.gql')"
    :variables="{ courseCode }"
    @result="setRegistration"
  >
    <generic-info-panel
      :title="$tc('registration._', 1)"
      icon="mdi-book"
      :items="items"
      :loading="!!isLoading"
    >
      <div v-if="!error" class="text-center">
        <course-register-btn
          v-if="!registration && courseVisibility === 'PUBLIC'"
          :course-code="courseCode"
          @done="registered"
        />

        <course-request-invitation-btn
          v-if="!registration && courseVisibility === 'INVITE_ONLY'"
          :course-code="courseCode"
          @done="invitationRequestSent"
        />

        <course-accept-invitation-btn
          v-if="registration && registration.invitation === 'SENT'"
          :id="registration.id"
          @done="invitationAccepted"
        />
      </div>
    </generic-info-panel>
  </ApolloQuery>
</template>

<script>
import datetime from '@/mixins/datetime.js'

export default {
  name: 'RegistrationInfoPanel',
  mixins: [datetime],
  props: {
    courseCode: {
      type: String,
      required: true,
    },
    courseVisibility: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      registration: null,
    }
  },
  computed: {
    items() {
      const items = []

      // Course visibility.
      const visibility = this.courseVisibility.toLowerCase()
      items.push({
        icon: 'mdi-eye',
        text: this.$t(`course.visibility.${visibility}`),
        tooltip: this.$t('course.visibility._'),
      })

      // Registration status or date
      items.push({
        icon: 'mdi-calendar',
        text: this.registrationStatus,
        tooltip: this.$t('registration.status'),
      })

      return items
    },
    registrationStatus() {
      // Invitation requested or invited.
      if (this.registration?.invitation) {
        return {
          REQUESTED: this.$t('registration.invitation.request.sent'),
          SENT: this.$t('registration.invitation.received._'),
        }[this.registration.invitation]
      }

      // Registered.
      if (this.registration?.datetime) {
        return this.$t('registration.registered_on', {
          date: this.formatDateFull(this.registration.datetime),
        })
      }

      return this.$t('student.not_registered_yet')
    },
  },
  methods: {
    invitationAccepted({ data: { acceptInvitation: registration } }) {
      this.registration = registration

      this.$notificationManager.displaySuccessMessage(
        this.$t('success.ACCEPT_INVITATION')
      )
    },
    invitationRequestSent({ data: { requestInvitation: registration } }) {
      this.registration = registration

      this.$notificationManager.displaySuccessMessage(
        this.$t('success.REQUEST_INVITATION')
      )
    },
    registered({ data: { register: registration } }) {
      this.registration = registration

      this.$notificationManager.displaySuccessMessage(
        this.$t('success.REGISTER')
      )
    },
    setRegistration({ data }) {
      this.registration = data?.registration
    },
  },
}
</script>

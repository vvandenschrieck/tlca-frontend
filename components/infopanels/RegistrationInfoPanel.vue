<template>
  <generic-info-panel
    :title="$tc('registration._', 1)"
    icon="mdi-book"
    :items="items"
  >
    <div v-if="$auth.user" class="text-center">
      <course-register-btn
        v-if="canRegister"
        :course-code="course.code"
        @done="registered"
      />

      <course-request-invitation-btn
        v-if="canRequestInvitation"
        :course-code="course.code"
        @done="invitationRequestSent"
      />
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
    canRequestInvitation() {
      return (
        this.course.visibility === 'INVITE_ONLY' &&
        this.$auth.user &&
        !(
          this.course.isCoordinator ||
          this.course.isTeacher ||
          this.course.isRegistered ||
          this.course.hasRequestedInvitation
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
      items.push({
        icon: 'mdi-calendar',
        text: this.registrationStatus,
        tooltip: this.$t('registration.status'),
      })

      return items
    },
    registrationStatus() {
      const { registration } = this.course

      // Invitation requested or invited.
      if (registration?.invitation) {
        return {
          REQUESTED: this.$t('registration.invitation.request.sent'),
          SENT: this.$t('registration.invitation.sent._'),
        }[registration.invitation]
      }

      // Registered.
      if (registration?.datetime) {
        return this.$t('registration.registered_on', {
          date: this.formatDateFull(registration.datetime),
        })
      }

      return this.$t('student.not_registered_yet')
    },
  },
  methods: {
    invitationRequestSent() {
      this.$notificationManager.displaySuccessMessage(
        this.$t('success.REQUEST_INVITATION')
      )
    },
    registered() {
      this.$notificationManager.displaySuccessMessage(
        this.$t('success.REGISTER')
      )
    },
  },
}
</script>

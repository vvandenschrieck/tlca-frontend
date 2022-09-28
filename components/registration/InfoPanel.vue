<template>
  <ApolloQuery
    v-if="$auth.user"
    v-slot="{ isLoading, result: { error } }"
    :query="require(`~/gql/infopanels/${queryFile}`)"
    :variables="{ [`${entity}Code`]: code }"
    @result="setRegistration"
  >
    <generic-info-panel
      icon="mdi-book"
      :items="items"
      :loading="!!isLoading"
      :title="$tc('registration._', 1)"
    >
      <div v-if="!error" class="text-center">
        <!-- <course-register-btn
          v-if="!registration && courseVisibility === 'PUBLIC'"
          :course-code="courseCode"
          @done="registered"
        /> -->

        <request-invitation-btn
          v-if="
            !registration && showRegistrationBtn && visibility === 'INVITE_ONLY'
          "
          :code="code"
          :entity="entity"
          @done="invitationRequestSent"
        />

        <!-- <course-accept-invitation-btn
          v-if="registration && registration.invitation === 'SENT'"
          :id="registration.id"
          @done="invitationAccepted"
        /> -->
      </div>
    </generic-info-panel>
  </ApolloQuery>
</template>

<script>
import datetime from '@/mixins/datetime.js'
import utils from '@/mixins/utils.js'

export default {
  name: 'RegistrationInfoPanel',
  mixins: [datetime, utils],
  props: {
    code: {
      type: String,
      default: null,
    },
    entity: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      registration: null,
      showRegistrationBtn: false,
      visibility: null,
    }
  },
  computed: {
    items() {
      const items = []

      // Course or program visibility.
      const visibility = this.visibility?.toLowerCase()
      if (visibility) {
        items.push({
          icon: 'mdi-eye',
          text: this.$t(`${this.entity}.visibility.${visibility}`),
          tooltip: this.$t(`${this.entity}.visibility._`),
        })
      }

      // Registration status or date
      items.push({
        icon: 'mdi-calendar',
        text: this.status,
        tooltip: this.$t('registration.status'),
      })

      return items
    },
    queryFile() {
      const entity = this.capitalise(this.entity)
      return `get${entity}RegistrationInfo.gql`
    },
    status() {
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
        this.$t('success.INVITATION_REQUEST')
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

      const course = data?.course
      if (course) {
        this.showRegistrationBtn = !(
          course.isCoordinator ||
          course.isRegistered ||
          course.isTeacher
        )
        this.visibility = course.visibility
      }
    },
  },
}
</script>

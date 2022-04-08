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
      <v-btn v-else-if="canRequestInvite" small color="success">
        <v-icon left>mdi-email-plus</v-icon>
        <span v-t="'course.request_invite'"></span>
      </v-btn>
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
        this.$auth.user &&
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
          this.course.hasRequestedInvitation
        )
      )
    },
    items() {
      const items = []
      const visibility = this.course.visibility.toLowerCase()
      items.push({
        icon: 'mdi-eye',
        text: this.$t(`course.visibility.${visibility}`),
        tooltip: this.$t('course.visibility._'),
      })

      const registrationDate = this.course.registration?.date
      items.push({
        icon: 'mdi-calendar',
        text: registrationDate ? this.formatDateTimeFull(registrationDate) : 'non',
        tooltip: this.$t('registration.date'),
      })
      return items
    },
  },
}
</script>

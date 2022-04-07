<template>
  <generic-info-panel
    :title="$t('course.registration._')"
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
export default {
  name: 'RegistrationInfoPanel',
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
        text: this.$t(`course.registration.${visibility}`),
        tooltip: this.$t('course.visibility'),
      })
      return items
    },
  },
}
</script>

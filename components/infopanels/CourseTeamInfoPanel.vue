<template>
  <generic-info-panel
    :title="$t('course.team')"
    icon="mdi-account-group"
    :items="items"
  />
</template>

<script>
export default {
  name: 'CourseTeamInfoPanel',
  props: {
    course: {
      type: Object,
      required: true,
    },
  },
  computed: {
    items() {
      const items = []

      // Course partners
      const partners = this.course.partners
      if (partners?.length) {
        items.push({
          icon: 'mdi-domain',
          text: partners.map((p) => p.abbreviation || p.name).join(', '),
          tooltip: this.$tc('partner._', partners.length),
        })
      }

      // Course coordinator
      const coordinator = this.course.coordinator
      if (coordinator) {
        items.push({
          icon: 'mdi-account',
          text: coordinator.displayName,
          tooltip: this.$t('course.coordinator'),
        })
      }

      // Course teachers
      const teachers = this.course.teachers
      if (teachers?.length) {
        items.push({
          icon: 'mdi-account-group',
          text: teachers.map((t) => t.displayName).join(', '),
          tooltip: this.$tc('course.teacher', teachers.length),
        })
      }

      return items
    },
  },
}
</script>

export default {
  computed: {
    teacherView() {
      return this.$auth.user.hasAnyRoles('teacher')
    },
  },
  methods: {
    hasRole(role) {
      return this.$auth.user && this.$auth.user.roles.includes(role)
    },
    hasAnyRoles(roles) {
      return (
        this.$auth.user &&
        roles.some((role) => this.$auth.user.roles.includes(role))
      )
    },
  },
}

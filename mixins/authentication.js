export default {
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

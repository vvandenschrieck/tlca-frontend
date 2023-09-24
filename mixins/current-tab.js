export default {
  computed: {
    currentTab: {
      get() {
        return this.$route.hash.slice(1)
      },
      set(tab) {
        this.$router.replace({ hash: tab })
      },
    },
  },
}

export default {
  methods: {
    getTitle(title, subtitle, space) {
      subtitle = subtitle ? ' : ' + this.$tc(subtitle, 2) : ''
      space = space
        ? ' [' + this.$t(`global.spaces.${space}`).toLowerCase() + ']'
        : ''

      return `${title}${subtitle}${space}`
    },
  },
}

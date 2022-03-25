export default {
  methods: {
    homespaceNavItems(section, detailPage) {
      const items = [
        {
          text: this.$tc('global.spaces.home'),
          exact: true,
          to: { name: 'index' },
        },
        {
          text: this.$tc(`${section}._`, 2),
          exact: true,
          to: { name: `${section}s` },
        },
      ]

      if (detailPage) {
        items.push({ text: detailPage })
      }

      return items
    },
  },
}

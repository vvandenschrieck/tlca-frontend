export default {
  methods: {
    navItems(space, section, detailPage) {
      const sectionLink =
        space === 'home' ? `${section}s` : `${space}-${section}s`

      const items = [
        {
          text: this.$tc(`global.spaces.${space}`),
          exact: true,
          to: { name: 'index' },
        },
        {
          text: this.$tc(`${section}._`, 2),
          exact: true,
          to: { name: sectionLink },
        },
      ]

      if (detailPage) {
        items.push({ text: detailPage })
      }

      return items
    },
  },
}

function pluralize(section) {
  if (section === 'competency') {
    return 'competencies'
  }
  return section + 's'
}

export default {
  methods: {
    navItems(space, section, detailPage) {
      const sectionLink =
        space === 'home' ? pluralize(section) : `${space}-${pluralize(section)}`

      const items = [
        {
          text: this.$tc(`global.spaces.${space}`),
          exact: true,
          to: { name: space === 'home' ? 'index' : space },
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

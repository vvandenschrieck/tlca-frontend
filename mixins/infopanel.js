export default {
  methods: {
    generateInfoItems(section, source, fields) {
      const items = []
      for (const [field, icon] of Object.entries(fields)) {
        const value = source[field]
        if (value) {
          items.push({
            icon,
            text: Array.isArray(value) ? value.join(', ') : value,
            tooltip: this.$t(`${section}.${field}`),
          })
        }
      }
      return items
    },
  },
}

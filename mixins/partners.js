export default {
  methods: {
    filteredPartners(partners, filter) {
      const text = filter.text?.trim().toLowerCase()

      if (!text || !text.length) {
        return partners
      }

      return partners.filter((c) => {
        return (
          !text ||
          !text.length ||
          c.code.toLowerCase().includes(text) ||
          c.name.toLowerCase().includes(text)
        )
      })
    },
  },
}

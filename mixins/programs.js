export default {
  methods: {
    filteredPrograms(programs, filter) {
      const status = filter.options?.status || []
      const text = filter.text?.trim().toLowerCase()

      if ((!status || !status.length) && (!text || !text.length)) {
        return programs
      }

      return programs.filter((p) => {
        return (
          (!text ||
            !text.length ||
            p.code.toLowerCase().includes(text) ||
            p.name.toLowerCase().includes(text)) &&
          (!status ||
            !status.length ||
            (!p.isPublished && status.includes('UNPUBLISHED')) ||
            (p.isPublished && !p.isArchived && status.includes('PUBLISHED')) ||
            (p.isArchived && status.includes('ARCHIVED')))
        )
      })
    },
  },
}

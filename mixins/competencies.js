export default {
  methods: {
    competencyName(competency) {
      return competency.code + ' – ' + competency.name
    },
    filteredCompetencies(competencies, filter) {
      const creators = filter.options?.creators || []
      const tags = filter.options?.tags || []
      const visibilities = filter.options?.visibilities || []
      const text = filter.text?.trim().toLowerCase()

      if (
        (!creators || !creators.length) &&
        (!tags || !tags.length) &&
        (!visibilities || !visibilities.length) &&
        (!text || !text.length)
      ) {
        return competencies
      }

      return competencies.filter((c) => {
        return (
          (!text ||
            !text.length ||
            c.code.toLowerCase().includes(text) ||
            c.name.toLowerCase().includes(text)) &&
          (!creators ||
            !creators.length ||
            (c.isOwner && creators.includes('OWN')) ||
            // (c.isPublished && !c.isArchived && creators.includes('PARTNERS')) ||
            (c.isOwner && creators.includes('EXTERNAL'))) &&
          (!tags || !tags.length || c.tags?.some((t) => tags.includes(t))) &&
          (!visibilities ||
            !visibilities.length ||
            (c.isPublic && visibilities.includes('PUBLIC')) ||
            (!c.isPublic && visibilities.includes('PRIVATE')))
        )
      })
    },
  },
}

export default {
  methods: {
    competencyName(competency) {
      return competency.code + ' – ' + competency.name
    },
    filteredCompetencies(competencies, filter) {
      const options = filter.options ?? {}

      // Get the values of the different filter options.
      const creators = options.creators ?? []
      const includeArchived = options.includeArchived ?? false
      const includePublic = options.includePublic ?? false
      const tags = options.tags ?? []
      const text = filter.text?.trim().toLowerCase() ?? ''

      if (
        !creators.length &&
        includeArchived &&
        includePublic &&
        !tags.length &&
        !text.length
      ) {
        return competencies
      }

      // Filter the list of competencies.
      return competencies.filter((c) => {
        return (
          (!text.length ||
            c.code.toLowerCase().includes(text) ||
            c.name.toLowerCase().includes(text)) &&
          (includeArchived || !c.isArchived) &&
          (includePublic || !c.isPublic) &&
          (!creators ||
            !creators.length ||
            (c.isOwner && creators.includes('OWN')) ||
            // (c.isPublished && !c.isArchived && creators.includes('PARTNERS')) ||
            (c.isOwner && creators.includes('EXTERNAL'))) &&
          (!tags || !tags.length || c.tags?.some((t) => tags.includes(t)))
        )
      })
    },
  },
}

export default {
  methods: {
    filteredCourses(courses, filter) {
      const roles = filter.options?.roles || []
      const status = filter.options?.status || []
      const text = filter.text?.trim().toLowerCase()

      if (
        (!status || !status.length) &&
        (!roles || !roles.length) &&
        (!text || !text.length)
      ) {
        return courses
      }

      return courses.filter((c) => {
        return (
          (!text ||
            !text.length ||
            c.code.toLowerCase().includes(text) ||
            c.name.toLowerCase().includes(text)) &&
          (!roles ||
            !roles.length ||
            (c.isCoordinator && roles.includes('COORDINATOR')) ||
            (c.isTeacher && roles.includes('TEACHER'))) &&
          (!status ||
            !status.length ||
            (!c.isPublished && status.includes('UNPUBLISHED')) ||
            (c.isPublished && !c.isArchived && status.includes('PUBLISHED')) ||
            (c.isArchived && status.includes('ARCHIVED')))
        )
      })
    },
  },
}

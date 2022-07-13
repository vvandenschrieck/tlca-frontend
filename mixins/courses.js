export default {
  methods: {
    filteredCourses(courses, filter) {
      const { role, status } = filter

      if ((!status || !status.length) && (!role || !role.length)) {
        return courses
      }

      return courses.filter((c) => {
        return (
          (!role || !role.length ||
            (c.isCoordinator && role.includes('COORDINATOR')) ||
            (c.isTeacher && role.includes('TEACHER'))) &&
          (!status || !status.length ||
            (!c.isPublished && status.includes('UNPUBLISHED')) ||
            (c.isPublished && !c.isArchived && status.includes('PUBLISHED')) ||
            (c.isArchived && status.includes('ARCHIVED')))
        )
      })
    },
  },
}

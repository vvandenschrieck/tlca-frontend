import { DateTime } from 'luxon'

export default {
  methods: {
    filteredCourses(courses, filter) {
      const options = filter.options ?? {}

      // Get the values of the different filter options.
      const includeArchived = options.includeArchived ?? false
      const roles = options?.roles || []
      const text = filter.text?.trim().toLowerCase() ?? ''

      if (!courses || (includeArchived && !roles.length && !text.length)) {
        return courses
      }

      // Filter the list of courses.
      return courses.filter((c) => {
        return (
          (includeArchived || !c.isArchived) &&
          (!text.length ||
            c.code.toLowerCase().includes(text) ||
            c.name.toLowerCase().includes(text)) &&
          (!roles.length ||
            (c.isCoordinator && roles.includes('COORDINATOR')) ||
            (c.isTeacher && roles.includes('TEACHER')))
        )
      })
    },
    schedule(course) {
      const schedule = {}

      if (course.schedule?.length > 0) {
        course.schedule.forEach(({ datetime, name }) => {
          schedule[name] = DateTime.fromISO(datetime)
        })
      }

      return schedule
    },
  },
}

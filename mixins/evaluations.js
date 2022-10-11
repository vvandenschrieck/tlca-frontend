export default {
  methods: {
    filteredEvaluations(evaluations, filter) {
      if (!evaluations) {
        return []
      }

      const options = filter.options ?? {}

      // Get the values of the different filter options.
      const assessment = options.assessment ?? null
      const learner = options.learner ?? null
      const text = filter.text?.trim().toLowerCase() ?? ''

      if (!assessment && !learner && !text.length) {
        return evaluations
      }

      // Filter the list of evaluations.
      return evaluations.filter((e) => {
        return (
          !text.length &&
          (!assessment || e.assessment.id === assessment) &&
          (!learner || e.learner.username === learner)
        )
      })
    },
  },
}

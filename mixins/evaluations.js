export default {
  methods: {
    filteredEvaluations(evaluations, filter) {
      const assessment = filter.options?.assessment || null
      const learner = filter.options?.learner || null
      const text = filter.text?.trim().toLowerCase()

      if (!assessment && !learner && (!text || !text.length)) {
        return evaluations
      }

      return evaluations.filter((e) => {
        return (
          (!text || !text.length) &&
          (!assessment || e.assessment.id === assessment) &&
          (!learner || e.learner.username === learner)
        )
      })
    },
  },
}

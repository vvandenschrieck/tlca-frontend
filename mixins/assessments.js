export default {
  methods: {
    assessmentName(assessment) {
      return (assessment.code ? `${assessment.code} – ` : '') + assessment.name
    },
    shortName(assessment) {
      return assessment.code ?? assessment.name.slice(0, 9)
    },
  },
}

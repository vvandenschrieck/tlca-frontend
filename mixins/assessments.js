export default {
  methods: {
    shortName(assessment) {
      return assessment.code ?? assessment.name.slice(0, 9)
    },
  },
}

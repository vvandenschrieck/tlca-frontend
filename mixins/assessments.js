export default {
  methods: {
    schedule(assessment) {
      const schedule = []
      if (assessment?.start) {
        schedule.push({ name: 'start', datetime: assessment.start })
      }
      if (assessment?.end) {
        schedule.push({ name: 'end', datetime: assessment.end })
      }
      return schedule.length ? schedule : null
    },
  },
}

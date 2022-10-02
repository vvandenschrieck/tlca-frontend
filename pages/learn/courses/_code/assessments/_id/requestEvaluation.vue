<template>
  <p>Coucou</p>
</template>

<script>
import titles from '@/mixins/titles.js'

export default {
  name: 'LearnCourseAssessmentRequestEvaluationPage',
  mixins: [titles],
  data() {
    return {
      title: '',
    }
  },
  head() {
    return {
      title: this.getTitle(this.title, null, 'learn'),
    }
  },
  computed: {
    assessmentId() {
      return this.$route.params.id
    },
    courseCode() {
      return this.$route.params.code
    },
  },
  methods: {
    setTitle({ data }) {
      this.title = data?.assessment?.name ?? ''
    },
  },
  meta: {
    roles: ['student'],
  },
}
</script>

<template>
  <div>
    {{ $route.params }}
  </div>
</template>

<script>
export default {
  name: 'LearnCourseAssessmentPage',
  data() {
    return {
      currentTab: 0,
    }
  },
  meta: {
    roles: ['student'],
  },
}
</script>

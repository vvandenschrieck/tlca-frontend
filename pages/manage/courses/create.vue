<template>
  <p>Course : create</p>
</template>

<script>
import breadcrumb from '@/mixins/breadcrumb.js'

export default {
  name: 'ManageCreateCoursePage',
  mixins: [breadcrumb],
  meta: {
    roles: ['teacher'],
  },
}
</script>

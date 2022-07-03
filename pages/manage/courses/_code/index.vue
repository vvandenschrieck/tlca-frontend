<template>
    <p>Course detail page</p>
</template>

<script>
import breadcrumb from '@/mixins/breadcrumb.js'

export default {
  name: 'ManageCoursePage',
  mixins: [breadcrumb],
  data() {
    return {
      currentTab: 'description',
    }
  },
  meta: {
    roles: ['teacher'],
  },
}
</script>

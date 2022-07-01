<template>
  <div>
    <bread-crumb
      :items="navItems('manage', 'competency', $t('competency.create'))"
    />

    <p>Create competency</p>
  </div>
</template>

<script>
import breadcrumb from '@/mixins/breadcrumb.js'

export default {
  name: 'ManageCreateCompetencyPage',
  mixins: [breadcrumb],
  meta: {
    roles: ['teacher'],
  },
}
</script>

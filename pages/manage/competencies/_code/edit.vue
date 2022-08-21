<template>
  <div>
    <p>Edit competency</p>

    <p>{{ $route.params.code }}</p>
  </div>
</template>

<script>
export default {
  name: 'ManageEditCompetencyPage',
  meta: {
    roles: ['teacher'],
  },
}
</script>

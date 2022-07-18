<template>
  <p>Manage : Programs</p>
</template>

<script>
import ProgramCard from '~/components/cards/ProgramCard.vue'

export default {
  name: 'ManageProgramsPage',
  data() {
    return {
      propName: 'program',
      component: ProgramCard,
    }
  },
  meta: {
    roles: ['teacher'],
  },
}
</script>

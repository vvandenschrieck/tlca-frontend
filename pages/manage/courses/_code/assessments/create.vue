<template>
  <div>
    <h2>{{ $t('assessment.create') }}</h2>
  </div>  
</template>

<script>

export default {
  name: 'ManageCreateAssessmentPage',
  components: {  },
  data() {
    return {
    }
  },
  meta: {
    roles: ['teacher'],
  },
}
</script>

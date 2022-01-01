<template>
  <generic-card :banner="program.banner" :to="{ name: 'programs-code', params: { code: program.code } }">
    <v-card-title>{{ program.code }}</v-card-title>
    <v-card-subtitle>
      <div class="name">{{ program.name }}</div>
    </v-card-subtitle>
  </generic-card>
</template>

<script>
export default {
  name: 'ProgramCard',
  props: {
    program: {
      type: Object,
      required: true
    }
  }
}
</script>

<style scoped>
.name {
  display: -webkit-box;
  min-height: 20px;
  max-height: 45px;
  overflow: hidden;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}
</style>

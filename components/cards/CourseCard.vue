<template>
  <generic-card :banner="course.banner" :to="{ name: 'courses-code', params: { code: course.code } }" :label="$t(`course.type.${course.type}`)">
    <v-card-title>{{ course.code }}</v-card-title>
    <v-card-subtitle><div class="name">{{ course.name }}</div></v-card-subtitle>
  </generic-card>
</template>

<script>
import GenericCard from '~/components/cards/GenericCard.vue';

export default {
  name: 'CourseCard',
  components: { GenericCard },
  props: {
    course: {
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

<template>
  <generic-card
    :banner="course.banner"
    :to="{ name: `${linkPrefix}courses-code`, params: { code: course.code } }"
    :label="$t(`course.type.${course.type.toLowerCase()}`)"
  >
    <v-card-title>{{ course.code }}</v-card-title>
    <v-card-subtitle>
      <div class="name">{{ course.name }}</div>
    </v-card-subtitle>
  </generic-card>
</template>

<script>
export default {
  name: 'CourseCard',
  props: {
    course: {
      type: Object,
      required: true,
    },
    linkPrefix: {
      type: String,
      default: '',
    },
  },
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

<template>
  <v-hover v-slot="{ hover }">
    <v-card to="inspire" :elevation="hover ? 12 : 2">
      <v-img :src="course.banner">
        <div id="type">
          <span v-if="course.type === 'ucourse'" class="label-default">{{ $t('course.type.ucourse') }}</span>
          <span v-else-if="course.type === 'training'" class="label-default">{{ $t('course.type.training') }}</span>
        </div>
      </v-img>
      <v-card-title>{{ course.code }}</v-card-title>
      <v-card-subtitle><div class="name">{{ course.name }}</div></v-card-subtitle>
    </v-card>
  </v-hover>
</template>

<script>
export default {
  name: 'CourseCard',
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

#type {
  bottom: 0px;
  margin: 0px 10px 10px 0;
  position: absolute;
  right: 0px;
}
span.label-default {
  background-color: #777;
  border-radius: 0.25em;
  color: #fff;
  font-size: 75%;
  padding: 0.2em 0.6em 0.3em;
}
</style>

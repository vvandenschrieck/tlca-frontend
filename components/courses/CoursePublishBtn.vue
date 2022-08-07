<template>
  <ApolloMutation
    v-if="canPublish"
    v-slot="{ mutate, loading }"
    :mutation="require('../../gql/manage/publishCourse.gql')"
    :variables="{ code: course.code }"
    @done="success"
  >
    <v-btn small color="primary" :loading="loading" @click="mutate">
      <v-icon left>mdi-cloud-upload</v-icon>
      <span>{{ $t('course.publish') }}</span>
    </v-btn>
  </ApolloMutation>
</template>

<script>
export default {
  name: 'CoursePublishBtn',
  props: {
    course: {
      type: Object,
      required: true,
    },
  },
  computed: {
    canPublish() {
      return this.course.status === 'UNPUBLISHED'
    },
  },
  methods: {
    success({ data: { publishCourse: course } }) {
      this.$emit('success', course)
    },
  },
}
</script>

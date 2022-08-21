<template>
  <generic-card
    :banner="course.banner"
    :banner-edit-options="bannerEditOptions"
    :to="link"
    :label="type"
  >
    <v-chip
      v-if="status"
      id="status"
      v-t="`course.status.${status}`"
      small
    ></v-chip>

    <v-card-title v-text="course.code"></v-card-title>
    <v-card-subtitle>
      <div class="name" v-text="course.name"></div>
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
  data() {
    return {
      link: {
        name: `${this.linkPrefix}courses-code`,
        params: { code: this.course.code },
      },
    }
  },
  computed: {
    bannerEditOptions() {
      if (
        this.$auth?.user?.roles?.includes('teacher') &&
        this.$route.path.startsWith('/manage')
      ) {
        return { code: this.course.code, type: 'COURSE' }
      }

      return null
    },
    status() {
      if (this.course.isPublished === false) {
        return 'unpublished'
      }

      if (this.course.isArchived === true) {
        return 'archived'
      }

      return undefined
    },
    type() {
      const type = this.course.type.toLowerCase()
      return this.$t(`course.type.${type}`)
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
#status {
  top: 0px;
  margin: 10px 10px 0px 0;
  position: absolute;
  right: 0px;
}
</style>

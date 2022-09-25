<template>
  <generic-card
    :banner="course.banner"
    :banner-edit-options="bannerEditOptions"
    :label="type"
    :to="link"
  >
    <v-chip v-if="status" class="status" small>{{ status }}</v-chip>

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
    hidePublished: {
      type: Boolean,
      default: false,
    },
    space: {
      type: String,
      default: '',
    },
  },
  computed: {
    bannerEditOptions() {
      if (this.canEditBanner) {
        return { code: this.course.code, type: 'COURSE' }
      }
      return null
    },
    canEditBanner() {
      return (
        this.$route.path.startsWith('/manage') &&
        this.$auth.user?.hasAnyRoles('teacher') &&
        this.course.isCoordinator
      )
    },
    link() {
      const prefix = this.space ? `${this.space}-` : ''
      return {
        name: `${prefix}courses-code`,
        params: { code: this.course.code },
      }
    },
    status() {
      const status = this.course.status?.toLowerCase()
      if (status && (!this.hidePublished || status !== 'published')) {
        return this.$t(`course.status.${status}`)
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
  max-height: 45px;
  min-height: 20px;
  overflow: hidden;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
}

.status {
  margin: 10px 10px 0px 0;
  position: absolute;
  right: 0px;
  top: 0px;
}
</style>

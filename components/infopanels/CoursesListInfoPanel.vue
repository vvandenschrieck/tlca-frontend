<template>
  <generic-info-panel
    :title="$t('general.information._')"
    icon="mdi-information"
    :items="items"
  >
    <div class="text-center">
      <v-btn small color="success" :to="{ name: 'manage-courses-create' }">
        <v-icon left>mdi-plus</v-icon>
        <span v-t="'general.create'"></span>
      </v-btn>
    </div>
  </generic-info-panel>
</template>

<script>
export default {
  name: 'CoursesListInfoPanel',
  props: {
    courses: {
      type: Array,
      required: true,
    },
  },
  computed: {
    items() {
      const items = []

      // Number of courses with detailed distribution
      const archived = this.courses.filter((c) => c.isArchived).length
      const published =
        this.courses.filter((c) => c.isPublished).length - archived
      const unpublished = this.courses.length - published - archived

      items.push({
        icon: 'mdi-clipboard-text',
        text: this.$tc('course.nb', this.courses.length, {
          nb: this.courses.length,
        }),
        tooltip: this.$t('course.nb_of._'),
        details: [
          this.$tc('course.nb_of.unpublished', unpublished, {
            nb: unpublished,
          }),
          this.$tc('course.nb_of.published', published, { nb: published }),
          this.$tc('course.nb_of.archived', archived, { nb: archived }),
        ],
      })

      return items
    },
  },
}
</script>

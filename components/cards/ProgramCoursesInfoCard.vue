<template>
  <generic-info-card icon="mdi-clipboard-text" :title="$tc('course._', 2)">
    <v-simple-table dense>
      <tbody>
        <template v-for="{ course } in program.courses">
          <tr :key="course.code">
            <td class="pa-0 text-center"></td>
            <td>
              <span class="name">{{ courseName(course) }}</span>
            </td>
            <td class="text-center">
              <v-chip v-if="program.status === 'UNPUBLISHED'" small>
                {{ courseStatus(course) }}
              </v-chip>
            </td>
          </tr>
        </template>
      </tbody>
    </v-simple-table>
  </generic-info-card>
</template>

<script>
export default {
  name: 'ProgramCoursesInfoCard',
  props: {
    program: {
      type: Object,
      required: true,
    },
  },
  methods: {
    courseName(course) {
      return course.code + ' – ' + course.name
    },
    courseStatus(course) {
      return this.$t(`course.status.${course.status.toLowerCase()}`)
    },
  },
}
</script>

<style scoped>
.name {
  display: -webkit-box;
  overflow: hidden;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
}
</style>

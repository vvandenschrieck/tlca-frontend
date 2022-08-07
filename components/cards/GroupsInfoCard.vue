<template>
  <generic-info-card
    icon="mdi-account-group"
    :link="{
      icon: 'mdi-view-list',
      text: $t('general.list'),
      to: {
        name: 'manage-courses-code-groups',
        params: { code: course.code },
      },
    }"
    :title="$t('course.team')"
  >
    <h3 class="mt-0">{{ $tc('course.teacher', course.teachers.length) }}</h3>

    <v-chip
      v-for="teacher in course.teachers"
      :key="teacher.username"
      class="ma-2"
      small
    >
      {{ teacherName(teacher) }}
    </v-chip>

    <h3>{{ $t('course.groups._') }}</h3>

    <v-simple-table dense>
      <tbody>
        <tr v-for="(stat, i) in stats" :key="i">
          <td class="pa-0 text-center"></td>
          <td class="pl-2">{{ stat.text }}</td>
          <td class="text-center">{{ stat.value }}</td>
        </tr>
      </tbody>
    </v-simple-table>
  </generic-info-card>
</template>

<script>
export default {
  name: 'GroupsInfoCard',
  props: {
    course: {
      type: Object,
      required: true,
    },
  },
  computed: {
    stats() {
      return ['teaching', 'working'].map((c) => ({
        text: this.$t(`course.groups.${c}._`),
        value: this.course[`${c}Groups`]?.length || 0,
      }))
    },
  },
  methods: {
    teacherName(teacher) {
      return teacher.displayName || teacher.username
    },
  },
}
</script>

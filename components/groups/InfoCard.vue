<template>
  <ApolloQuery
    v-slot="{ isLoading, result: { error } }"
    :query="require('~/gql/cards/getGroupsInfo.gql')"
    :update="(data) => data.course"
    :variables="{ courseCode }"
    @result="setResult"
  >
    <generic-info-card
      icon="mdi-account-group"
      :link="link"
      :loading="!!isLoading"
      :title="$t('course.team')"
    >
      <div v-if="!error">
        <div v-if="hasTeachers">
          <h3 class="mt-0">
            {{ $tc('course.teacher', course.teachers.length) }}
          </h3>

          <v-chip
            v-for="teacher in course.teachers"
            :key="teacher.username"
            class="ma-2"
            small
          >
            {{ teacher.displayName }}
          </v-chip>
        </div>

        <h3>{{ $t('course.groups._') }}</h3>

        <stats-list entity="groups" :items="stats" />
      </div>

      <span v-else>{{ $t('error.unexpected') }}</span>
    </generic-info-card>
  </ApolloQuery>
</template>

<script>
export default {
  name: 'GroupsInfoCard',
  props: {
    courseCode: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      course: null,
    }
  },
  computed: {
    hasGroups() {
      return this.course?.groups
    },
    hasTeachers() {
      return this.course?.teachers && this.course?.teachers.length > 0
    },
    link() {
      return {
        icon: 'mdi-view-list',
        text: this.$t('general.list'),
        to: {
          name: 'manage-courses-code-groups',
          params: { code: this.courseCode },
        },
      }
    },
    stats() {
      if (!this.course || !this.hasGroups) {
        return null
      }

      return ['teaching', 'working'].map((c) => ({
        text: this.$t(`course.groups.${c}._`),
        value: this.course.groups[c]?.length ?? 0,
      }))
    },
  },
  methods: {
    setResult({ data: course }) {
      this.course = course
    },
  },
}
</script>

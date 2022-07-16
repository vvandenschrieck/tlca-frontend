<template>
  <ApolloQuery
    :query="require('~/gql/admin/getCourses.gql')"
    :update="(data) => data.courses"
  >
    <template #default="{ result: { error, data: courses }, isLoading }">
      <div v-if="isLoading || courses">
        <h2>{{ $tc('course._', 2) }}</h2>

        <v-data-table
          v-if="courses"
          :headers="headers"
          :items="courses"
          :items-per-page="5"
          class="elevation-1"
        >
          <template #item.type="{ value: type }">
            {{ $t(`course.type.${type.toLowerCase()}`) }}
          </template>
          <template #item.visibility="{ value: visibility }">
            {{ $t(`course.visibility.${visibility.toLowerCase()}`) }}
          </template>
          <template #item.status="{ value: status }">
            {{ $t(`course.status.${status.toLowerCase()}`) }}
          </template>
        </v-data-table>

        <v-skeleton-loader v-else type="table"></v-skeleton-loader>
      </div>

      <div v-else-if="error">An error occurred</div>
    </template>
  </ApolloQuery>
</template>

<script>
export default {
  name: 'AdminCoursesPage',
  head() {
    return {
      title: this.$tc('course._', 2) + ' | ' + this.$t('global.spaces.admin'),
    }
  },
  computed: {
    headers() {
      return [
        { text: this.$t('course.code'), value: 'code' },
        { text: this.$t('course.name'), value: 'name' },
        { text: this.$t('course.type._'), value: 'type' },
        { text: this.$t('course.visibility._'), value: 'visibility' },
        { text: this.$t('course.status._'), value: 'status' },
      ]
    },
  },
  meta: {
    roles: ['admin'],
  },
}
</script>
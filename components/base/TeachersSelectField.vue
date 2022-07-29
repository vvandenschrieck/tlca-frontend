<template>
  <ApolloQuery
    :query="require('~/gql/manage/getTeachers.gql')"
    :update="(data) => data.colleagues"
  >
    <template #default="{ result: { error, data: colleagues }, isLoading }">
      <v-autocomplete
        v-if="!error"
        chips
        clearable
        deletable-chips
        dense
        :disabled="isLoading !== 0"
        :items="colleagues"
        :item-text="(u) => u.username || u.displayName"
        item-value="username"
        :label="$tc('course.teacher', 2)"
        :loading="isLoading !== 0"
        multiple
        small-chips
        :value="value"
        @input="$emit('input', $event)"
      >
        <template #item="{ item: { displayName, username } }">
          {{ displayName }}
          <span v-if="username !== displayName">&nbsp;({{ username }})</span>
        </template>
      </v-autocomplete>

      <div v-else>{{ $t('error.unexpected') }}</div>
    </template>
  </ApolloQuery>
</template>

<script>
export default {
  name: 'TeacherSelectField',
  props: {
    value: {
      type: Array,
      default: () => [],
    },
  },
}
</script>

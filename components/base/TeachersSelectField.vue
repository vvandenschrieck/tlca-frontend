<template>
  <ApolloQuery
    v-slot="{ isLoading, result: { data: colleagues, error } }"
    :query="require('~/gql/manage/getTeachers.gql')"
    :update="(data) => data.colleagues"
  >
    <v-autocomplete
      v-if="!error"
      v-model="teachers"
      chips
      clearable
      deletable-chips
      dense
      :disabled="!!isLoading"
      :item-text="(u) => u.username || u.displayName"
      item-value="username"
      :items="colleagues"
      :label="$tc('course.teacher', 2)"
      :loading="!!isLoading"
      multiple
      small-chips
    >
      <template #item="{ item: { displayName, username } }">
        {{ displayName }}
        <span v-if="username !== displayName">&nbsp;({{ username }})</span>
      </template>
    </v-autocomplete>

    <div v-else>{{ $t('error.unexpected') }}</div>
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
  computed: {
    teachers: {
      get() {
        return this.value
      },
      set(value) {
        this.$emit('input', value)
      },
    },
  },
}
</script>

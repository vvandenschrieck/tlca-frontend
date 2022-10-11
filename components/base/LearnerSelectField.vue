<template>
  <ApolloQuery
    v-slot="{ result: { error, data }, isLoading }"
    :query="require('~/gql/components/getLearners.gql')"
    :variables="{ courseCode }"
  >
    <v-autocomplete
      v-if="!error"
      clearable
      dense
      :disabled="!!isLoading || disabled"
      :filter="filter"
      :items="learners(data)"
      item-value="user.username"
      :label="$t('evaluation.learner')"
      :loading="!!isLoading"
      :value="value"
      @change="$emit('change')"
      @input="$emit('input', $event)"
    >
      <template #selection="{ item }">
        <span v-if="item.user">{{ user_name(item.user) }}</span>
      </template>

      <template #item="{ item }">
        <span v-if="item.user">{{ user_name(item.user) }}</span>
      </template>
    </v-autocomplete>

    <div v-else>{{ $t('error.unexpected') }}</div>
  </ApolloQuery>
</template>

<script>
export default {
  name: 'LearnerSelectField',
  props: {
    courseCode: {
      type: String,
      required: true,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    value: {
      type: String,
      default: null,
    },
  },
  methods: {
    filter(item, query) {
      query = query.trim().toLowerCase()
      return (
        item.header ||
        (item.user && item.user.displayName.toLowerCase().includes(query))
      )
    },
    learners(data) {
      if (data) {
        const learners = []
        const { course, registrations } = data

        // If no teaching groups or no learners at all.
        if (!course.hasTeachingGroups && registrations.length) {
          learners.push({ header: this.$t('learner.all') })
          learners.push(...registrations)
          return learners
        }

        // Otherwise, organise the learners by teaching groups.
        course.groups.teaching.forEach((g, i) => {
          const withGroup = registrations.filter((r) => r.group?.teaching === i)
          if (withGroup.length) {
            learners.push({
              header:
                g.name ||
                this.$t('course.registrations.group_name', { nb: i + 1 }),
            })
            learners.push(...withGroup)
          }
        })

        // And put a last category with all the learners without teaching group.
        const withoutGroup = registrations.filter((r) => !r.group?.teaching)
        if (withoutGroup.length) {
          learners.push({
            header: this.$t(
              course.hasTeachingGroups
                ? 'course.registrations.without_group'
                : 'learner.all'
            ),
          })
          learners.push(...withoutGroup)
        }
        return learners
      }

      return []
    },
    user_name(user) {
      return user.displayName || user.username
    },
  },
}
</script>

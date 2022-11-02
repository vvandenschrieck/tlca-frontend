<template>
  <ApolloQuery
    v-slot="{ isLoading, result: { error } }"
    :query="require('~/gql/components/getLearners.gql')"
    :variables="{ courseCode }"
    @result="setResult"
  >
    <v-autocomplete
      v-if="!error"
      clearable
      dense
      :disabled="!!isLoading || disabled"
      :filter="filter"
      :items="learners"
      item-value="user.username"
      :label="$t('evaluation.learner')"
      :loading="!!isLoading"
      :multiple="multiple"
      :value="value"
      @change="$emit('change')"
      @input="$emit('input', $event)"
    >
      <template #selection="{ index, item: { user } }">
        {{
          user.displayName +
          (Array.isArray(value) && index !== value.length - 1 ? ', ' : '')
        }}
      </template>

      <template #item="{ item: { user } }">
        <span v-if="user">{{ user.displayName }}</span>
      </template>
    </v-autocomplete>

    <div v-else>{{ $t('error.unexpected') }}</div>
  </ApolloQuery>
</template>

<script>
export default {
  name: 'LearnerSelect',
  props: {
    courseCode: {
      type: String,
      required: true,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    multiple: {
      type: Boolean,
      default: false,
    },
    value: {
      type: [Array, String],
      default: null,
    },
  },
  data() {
    return {
      learners: null,
    }
  },
  methods: {
    filter(item, query) {
      query = query.trim().toLowerCase()
      return (
        item.header ||
        (item.user && item.user.displayName.toLowerCase().includes(query))
      )
    },
    setResult({ data }) {
      if (!data) {
        return
      }

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

      this.learners = learners
    },
  },
}
</script>

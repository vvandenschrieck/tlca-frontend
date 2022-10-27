<template>
  <ApolloQuery
    v-slot="{ isLoading, result: { error } }"
    :query="require('~/gql/components/getWorkingGroups.gql')"
    :variables="{ courseCode }"
    @result="setResult"
  >
    <v-card v-if="!error" class="mt-3" flat :loading="!!isLoading">
      <v-list class="dense pa-0">
        <template v-for="(group, i) in groups">
          <v-list-item :key="i * 2" class="dense">
            <v-list-item-content>
              <v-list-item-title>{{ group.name }}</v-list-item-title>
            </v-list-item-content>

            <v-list-item-action>
              <v-list-item-action-text>
                <v-chip class="ml-3" small>
                  {{ group.members }} / {{ group.size ?? '–' }}
                </v-chip>
              </v-list-item-action-text>
            </v-list-item-action>
          </v-list-item>

          <v-divider v-if="i < groups.length - 1" :key="i * 2 + 1" />
        </template>
      </v-list>
    </v-card>

    <span v-else>{{ $t('course.groups.working.no') }}</span>
  </ApolloQuery>
</template>

<script>
export default {
  name: 'GroupsWorkingList',
  props: {
    courseCode: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      course: null,
      registrations: null,
    }
  },
  computed: {
    groups() {
      if (!this.course || !this.registrations) {
        return []
      }

      const groups = this.course.groups.working.map((g, i) => ({
        ...g,
        name: this.groupName(i, g.name),
        members: 0,
      }))

      this.registrations.forEach((r) => {
        const groupNb = r.group?.working ?? -1
        if (groupNb >= 0) {
          groups[groupNb].members++
        }
      })

      return groups
    },
  },
  methods: {
    groupName(i, name) {
      const genericName = this.$t('course.registrations.group_name', {
        nb: i + 1,
      })
      const suffix = name ? ' – ' + name : ''
      return `${genericName}${suffix}`
    },
    setResult({ data }) {
      if (!data) {
        return
      }

      this.course = data.course
      this.registrations = data.registrations
    },
  },
}
</script>

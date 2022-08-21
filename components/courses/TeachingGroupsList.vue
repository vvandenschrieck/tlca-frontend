<template>
  <div>
    <v-card v-if="course.groups?.teaching?.length" class="mt-3" flat>
      <v-list class="dense pa-0">
        <template v-for="(group, i) in groups">
          <v-list-item :key="i * 2" class="dense">
            <v-list-item-content>
              <v-list-item-title>{{ group.name }}</v-list-item-title>
            </v-list-item-content>

            <v-list-item-action>
              <v-list-item-action-text>
                {{ group.supervisor }}

                <v-chip class="ml-3" small>{{ group.size }}</v-chip>
              </v-list-item-action-text>
            </v-list-item-action>
          </v-list-item>

          <v-divider
            v-if="i < course.groups.teaching.length - 1"
            :key="i * 2 + 1"
          />
        </template>
      </v-list>
    </v-card>

    <span v-else>{{ $t('course.groups.teaching.no') }}</span>
  </div>
</template>

<script>
export default {
  name: 'TeachingGroupsList',
  props: {
    course: {
      type: Object,
      required: true,
    },
  },
  computed: {
    groups() {
      return this.course.groups.teaching.map((group, i) => {
        let name = this.$t('course.registrations.group_name', { nb: i + 1 })
        if (group.name) {
          name += ' – ' + group.name
        }
        const supervisor = group.supervisor

        return {
          name,
          size: this.course.registrations.filter(
            (r) => r.groups?.teaching === i
          ).length,
          supervisor: supervisor.displayName || supervisor.username,
        }
      })
    },
  },
}
</script>

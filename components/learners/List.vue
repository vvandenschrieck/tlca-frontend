<template>
  <v-data-table
    v-if="items"
    disable-pagination
    :headers="dataHeaders"
    hide-default-footer
    :items="learners"
    @click:row="goToLearner"
  >
    <template #item.progress.basic="{ item: { progress } }">
      <competencies-progress dense :value="progress.basic" />
    </template>

    <template #item.progress.advanced="{ item: { progress } }">
      <competencies-progress dense :value="progress.advanced" />
    </template>
  </v-data-table>

  <v-skeleton-loader v-else type="table" />
</template>

<script>
export default {
  name: 'LearnersList',
  props: {
    courseCode: {
      type: String,
      required: true,
    },
    hideAdvanced: {
      type: Boolean,
      default: false,
    },
    hideTeachingGroup: {
      type: Boolean,
      default: false,
    },
    hideWorkingGroup: {
      type: Boolean,
      default: false,
    },
    items: {
      type: Array,
      default: null,
    },
  },
  computed: {
    dataHeaders() {
      const headers = [
        {
          text: this.$t('user.name'),
          value: 'user.displayName',
        },
      ]

      if (!this.hideTeachingGroup) {
        headers.push({
          text: this.$t('course.groups.teaching._'),
          value: 'group.teaching',
        })
      }

      if (!this.hideWorkingGroup) {
        headers.push({
          text: this.$t('course.groups.working._'),
          value: 'group.working',
        })
      }

      headers.push({
        text: this.$t('competency.category.basic'),
        value: 'progress.basic',
      })

      if (!this.hideAdvanced) {
        headers.push({
          text: this.$t('competency.category.advanced'),
          value: 'progress.advanced',
        })
      }

      headers.push({
        cellClass: 'text-right',
        class: 'text-right',
        sortable: false,
        text: this.$tc('general.action', 2),
        value: 'actions',
      })

      return headers
    },
    learners() {
      return this.items.map((r) => ({
        ...r,
        group: {
          ...r.group,
          teaching: r.group?.teaching ? r.group.teaching + 1 : '—',
          working: r.group?.working ? r.group.working + 1 : '—',
        },
        user: r.user,
      }))
    },
  },
  methods: {
    goToLearner({ user: { username } }) {
      this.$router.push({
        name: 'teach-courses-code-learners-username',
        params: { code: this.courseCode, username },
      })
    },
  },
}
</script>

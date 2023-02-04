<template>
  <v-data-table
    disable-pagination
    :headers="headers"
    hide-default-footer
    :items="learners"
    @dblclick:row="goToLearner"
  >
    <template #item.progress.basic="{ item: { progress } }">
      <competencies-progress dense :value="progress.basic" />
    </template>

    <template #item.progress.advanced="{ item: { progress } }">
      <competencies-progress dense :value="progress.advanced" />
    </template>

    <template #item.actions="{ item: { user } }">
      <detail-link-btn :to="learnerLink(user)" />
    </template>
  </v-data-table>
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
    headers() {
      const items = [
        {
          text: this.$t('user.name'),
          value: 'user.displayName',
        },
      ]

      if (!this.hideTeachingGroup) {
        items.push({
          text: this.$t('course.groups.teaching._'),
          value: 'group.teaching',
        })
      }

      if (!this.hideWorkingGroup) {
        items.push({
          text: this.$t('course.groups.working._'),
          value: 'group.working',
        })
      }

      items.push({
        text: this.$t('competency.category.basic'),
        value: 'progress.basic',
      })

      if (!this.hideAdvanced) {
        items.push({
          text: this.$t('competency.category.advanced'),
          value: 'progress.advanced',
        })
      }

      items.push({
        cellClass: 'text-right',
        sortable: false,
        value: 'actions',
      })

      return items
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
    goToLearner(_, { item: { user } }) {
      this.$router.push(this.learnerLink(user))
    },
    learnerLink(learner) {
      return {
        name: 'teach-courses-code-learners-username',
        params: {
          code: this.courseCode,
          username: learner.username,
        },
      }
    },
  },
}
</script>

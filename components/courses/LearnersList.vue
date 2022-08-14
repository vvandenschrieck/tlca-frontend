<template>
  <v-data-table
    v-if="items"
    disable-pagination
    :headers="dataHeaders"
    hide-default-footer
    :items="learners"
  >
    <!-- Progress (basic) -->
    <template
      #item.progress.basic="{
        item: {
          progress: { basic },
        },
      }"
    >
      <v-progress-circular
        color="primary"
        :rotate="-90"
        :size="20"
        :value="basic"
      />
      {{ basic }}%
    </template>

    <!-- Progress (advanced) -->
    <template
      #item.progress.advanced="{
        item: {
          progress: { advanced },
        },
      }"
    >
      <v-progress-circular
        color="primary"
        :rotate="-90"
        :size="20"
        :value="advanced"
      />
      {{ advanced }}%
    </template>
  </v-data-table>

  <v-skeleton-loader v-else type="table" />
</template>

<script>
export default {
  name: 'LearnersList',
  props: {
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
          text: this.$t('user.first_name'),
          value: 'user.firstName',
        },
        {
          text: this.$t('user.last_name'),
          value: 'user.lastName',
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
        user: {
          ...r.user,
          firstName: r.user.firstName || '—',
          lastName: r.user.lastName || '—',
        },
      }))
    },
  },
}
</script>

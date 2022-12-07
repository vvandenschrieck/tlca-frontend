<template>
  <ApolloQuery
    v-slot="{ isLoading, result: { error } }"
    :query="require('~/gql/cards/getLearnersInfo.gql')"
    :variables="{ courseCode }"
    @result="setResult"
  >
    <generic-info-card
      icon="mdi-account-school"
      :link="link"
      :loading="!!isLoading"
      :title="$tc('learner._', 2)"
    >
      <stats-list v-if="!error" entity="learner" :items="stats" />
      <span v-else>{{ $t('error.unexpected') }}</span>
    </generic-info-card>
  </ApolloQuery>
</template>

<script>
export default {
  name: 'LearnersInfoCard',
  props: {
    courseCode: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      learners: null,
      teachingGroups: null,
    }
  },
  computed: {
    hasLearners() {
      return this.learners?.length > 0
    },
    link() {
      if (!this.hasLearners) {
        return null
      }

      return {
        icon: 'mdi-view-list',
        text: this.$t('general.list'),
        to: {
          name: 'teach-courses-code-learners',
          params: { code: this.courseCode },
        },
      }
    },
    stats() {
      if (!this.hasLearners) {
        return null
      }

      const items = []

      // Compute the number managed learners.
      items.push({
        text: this.$tc('learner.mine', 2),
        value: this.learners.length,
      })

      // Compute the number of supervised  teaching groups.
      if (this.teachingGroups?.length) {
        const myTeachingGroups = this.teachingGroups.filter(
          (g) => g.isSupervisor
        ).length

        items.push({
          text: this.$t('course.groups.teaching.mine'),
          value: `${myTeachingGroups} / ${this.teachingGroups.length}`,
        })
      }

      return items
    },
  },
  methods: {
    setResult({ data }) {
      if (!data) {
        return
      }

      this.learners = data.registrations
      this.teachingGroups = data.course?.groups?.teaching
    },
  },
}
</script>

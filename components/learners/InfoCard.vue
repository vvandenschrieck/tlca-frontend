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

      // Compute the learners and teaching groups stats.
      const stats = [
        {
          text: this.$tc('learner._', 2),
          value: this.learners.length,
        },
      ]

      if (this.teachingGroups?.length) {
        stats.push({
          text: this.$t('course.groups._'),
          value: this.teachingGroups.length,
        })
      }

      return stats
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

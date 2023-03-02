<template>
  <ApolloQuery
    v-slot="{ isLoading, result: { error } }"
    :query="require('~/gql/cards/getAssessmentsInfo.gql')"
    :variables="{ courseCode, hideTakesStatus, learnerUsername, teacherView }"
    @result="setResult"
  >
    <generic-info-card
      icon="mdi-clipboard-text"
      :link="link"
      :loading="!!isLoading"
      :title="$tc('assessment._', 2)"
    >
      <template #default>
        <template v-if="!error">
          <stats-list entity="assessment" :items="stats" />
          <assessments-takes-status
            v-if="!hideTakesStatus"
            :assessments="assessments"
            class="mx-2 mt-1"
          />
        </template>
        <span v-else>{{ $t('error.unexpected') }}</span>
      </template>

      <template v-if="showCreateButton" #actions>
        <v-btn color="success" outlined small :to="createLink">
          <v-icon left>mdi-plus</v-icon>
          <span>{{ $t('general.create') }}</span>
        </v-btn>
      </template>
    </generic-info-card>
  </ApolloQuery>
</template>

<script>
export default {
  name: 'AssessmentsInfoCard',
  props: {
    courseCode: {
      type: String,
      required: true,
    },
    hideClosed: {
      type: Boolean,
      default: false,
    },
    hideCreateButton: {
      type: Boolean,
      default: false,
    },
    hideTakesStatus: {
      type: Boolean,
      default: false,
    },
    learnerUsername: {
      type: String,
      default: null,
    },
    space: {
      type: String,
      required: true,
    },
    teacherView: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      assessments: null,
      course: null,
    }
  },
  computed: {
    createLink() {
      return {
        name: 'manage-courses-code-assessments-create',
        params: { code: this.courseCode },
      }
    },
    hasAssessments() {
      return this.assessments?.length > 0
    },
    link() {
      const learner =
        this.teacherView && this.learnerUsername ? '-learners-username' : ''

      return {
        icon: 'mdi-view-list',
        text: this.$t('general.list'),
        to: {
          name: `${this.space}-courses-code${learner}-assessments`,
          params: { code: this.courseCode, username: this.learnerUsername },
        },
      }
    },
    showCreateButton() {
      return (
        !this.hideCreateButton &&
        this.course?.isCoordinator &&
        !this.learnerUsername
      )
    },
    stats() {
      if (!this.hasAssessments) {
        return null
      }

      const isTeacher = this.isCoordinator || this.isTeacher
      const items = [
        {
          text: this.$t('general.available'),
          filter: (a) => !(a.isClosed || a.isHidden),
        },
        {
          text: this.$t('assessment.closed'),
          filter: (a) => a.isClosed,
        },
      ]

      if (!this.hideClosed && isTeacher) {
        items.push({
          text: this.$t('assessment.hidden'),
          filter: (a) => a.isHidden,
        })
      }

      // Compute the registrations stats.
      const stats = items.map((i) => ({
        ...i,
        value: this.assessments?.filter(i.filter)?.length ?? 0,
      }))

      // Check if there is no available assessments.
      if (isTeacher && this.teacherView && stats[0].value === 0) {
        stats[0].alert = this.$t('assessment.no_available')
      }

      return stats
    },
  },
  methods: {
    setResult({ data }) {
      if (!data) {
        return
      }

      this.assessments = data.assessments
      this.course = data.course
    },
  },
}
</script>

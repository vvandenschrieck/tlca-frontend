<template>
  <ApolloQuery
    v-slot="{ isLoading, result: { error } }"
    :query="require('~/gql/cards/getProgressInfo.gql')"
    :variables="{ courseCode, learnerUsername }"
    @result="setResult"
  >
    <generic-info-card
      icon="mdi-progress-check"
      :link="link"
      :loading="!!isLoading"
      :title="$t('registration.progress')"
    >
      <v-row v-if="!error">
        <v-col
          v-if="progress"
          class="d-flex justify-space-around mt-3"
          cols="12"
          md="8"
        >
          <competencies-progress
            :label="$t('competency.category.basic')"
            :value="progress.basic"
          />
          <competencies-progress
            :label="$t('competency.category.advanced')"
            :value="progress.advanced"
          />
        </v-col>

        <v-col cols="12" md="4" class="text-center"></v-col>
      </v-row>

      <span v-else>{{ $t('error.unexpected') }}</span>
    </generic-info-card>
  </ApolloQuery>
</template>

<script>
export default {
  name: 'ProgressInfoCard',
  props: {
    courseCode: {
      type: String,
      required: true,
    },
    teacherView: {
      type: Boolean,
      default: false,
    },
    learnerUsername: {
      type: String,
      default: null,
    },
  },
  data() {
    return {
      progress: null,
    }
  },
  computed: {
    link() {
      const to = this.teacherView
        ? {
            name: 'teach-courses-code-learners-username-competencies',
            params: { code: this.courseCode, username: this.learnerUsername },
          }
        : {
            name: 'learn-courses-code-competencies',
            params: { code: this.courseCode },
          }

      return {
        icon: 'mdi-view-list',
        text: this.$tc('competency._', 2),
        to,
      }
    },
  },
  methods: {
    setResult({ data }) {
      if (!data) {
        return
      }

      this.progress = data.registration?.progress
    },
  },
}
</script>

<template>
  <ApolloQuery
    v-slot="{ isLoading, result: { error } }"
    :query="require('~/gql/infopanels/getLearnerInfo.gql')"
    :update="(data) => data.registration"
    :variables="{ courseCode, learner }"
    @result="setResult"
  >
    <generic-info-panel
      icon="mdi-account-school"
      :items="items"
      :loading="!!isLoading"
      :title="$tc('learner._', 1)"
    >
      <v-card-text v-if="error">{{ $t('error.unexpected') }}</v-card-text>
    </generic-info-panel>
  </ApolloQuery>
</template>

<script>
import datetime from '@/mixins/datetime.js'

export default {
  name: 'LearnerInfoPanel',
  mixins: [datetime],
  props: {
    courseCode: {
      type: String,
      required: true,
    },
    learner: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      items: null,
    }
  },
  methods: {
    setResult({ data: registration }) {
      if (!registration) {
        return
      }

      const items = []

      // User.
      const learner = registration.user
      items.push({
        icon: 'mdi-account-school',
        text: learner.displayName,
        tooltip: this.$t('evaluation.learner'),
      })

      // Registration date.
      const registrationDate = registration.datetime
      items.push({
        icon: 'mdi-calendar',
        text: this.formatDateFull(registrationDate),
        tooltip: this.$t('registration.date'),
      })

      this.items = items
    },
  },
}
</script>

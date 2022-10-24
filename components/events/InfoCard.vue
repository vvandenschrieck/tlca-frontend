<template>
  <ApolloQuery
    v-slot="{ isLoading, result: { error } }"
    :query="require('~/gql/cards/getEventsInfo.gql')"
    :update="(data) => data.events"
    :variables="{ courseCode }"
    @result="setResult"
  >
    <generic-info-card
      icon="mdi-calendar"
      :link="link"
      :loading="!!isLoading"
      :title="$tc('event._', 2)"
    >
      <stats-list v-if="!error" entity="event" :items="stats" />
      <span v-else>{{ $t('error.unexpected') }}</span>
    </generic-info-card>
  </ApolloQuery>
</template>

<script>
import { DateTime } from 'luxon'

export default {
  name: 'EventsInfoCard',
  props: {
    courseCode: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      events: null,
    }
  },
  computed: {
    hasEvents() {
      return this.events?.length > 0
    },
    link() {
      return {
        icon: 'mdi-view-list',
        text: this.$tc('calendar.event', 2),
        to: {
          name: 'teach-courses-code-calendar',
          params: { code: this.courseCode },
        },
      }
    },
    stats() {
      if (!this.hasEvents) {
        return null
      }

      const now = DateTime.now()
      const items = [
        {
          text: this.$t('event.past'),
          filter: (e) => DateTime.fromISO(e.end) < now,
        },
        {
          text: this.$t('event.ongoing'),
          filter: (e) =>
            DateTime.fromISO(e.start) >= now && DateTime.fromISO(e.end) <= now,
        },
        {
          text: this.$t('event.upcoming'),
          filter: (e) => DateTime.fromISO(e.start) > now,
        },
      ]

      // Compute the events stats.
      const stats = items.map((i) => ({
        ...i,
        value: this.events.filter(i.filter).length,
      }))

      return stats
    },
  },
  methods: {
    setResult({ data: events }) {
      this.events = events
    },
  },
}
</script>

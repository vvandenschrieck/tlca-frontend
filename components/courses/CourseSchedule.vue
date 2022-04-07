<template>
  <v-timeline>
    <v-timeline-item
      v-for="{ name, date } in schedule"
      :key="name"
      small
      right
      :color="isInPast(date) ? 'grey' : undefined"
    >
      <span slot="opposite" v-t="`course.schedule.${name}`"></span>
      {{ formatDateTimeFull(date) }}
    </v-timeline-item>
  </v-timeline>
</template>

<script>
import { DateTime } from 'luxon'
import datetime from '@/mixins/datetime.js'

export default {
  name: 'CourseSchedule',
  mixins: [datetime],
  props: {
    items: {
      type: Array,
      required: true,
    },
  },
  computed: {
    schedule() {
      return this.items
        .map(({ name, date }) => ({ name, date: DateTime.fromISO(date) }))
        .sort((a, b) => a.date - b.date)
    },
  },
}
</script>

<template>
  <v-timeline :class="{ 'dense-timeline': dense }">
    <v-timeline-item
      v-for="event in schedule"
      :key="event.name"
      :class="{ 'dense-timeline-item': dense }"
      :color="color(event)"
      right
      small
    >
      <span slot="opposite">{{ eventName(event) }}</span>

      <v-tooltip bottom :disabled="!dense">
        <template #activator="{ attrs, on }">
          <span v-bind="attrs" v-on="on">{{ eventDateTime(event) }}</span>
        </template>

        <span>{{ eventDateTime(event, true) }}</span>
      </v-tooltip>
    </v-timeline-item>
  </v-timeline>
</template>

<script>
import { DateTime } from 'luxon'
import datetime from '@/mixins/datetime.js'

export default {
  name: 'ScheduleTimeline',
  mixins: [datetime],
  props: {
    dense: {
      type: Boolean,
      default: false,
    },
    items: {
      type: Array,
      required: true,
    },
  },
  computed: {
    schedule() {
      return this.items
        .map(({ name, datetime }) => ({
          name,
          datetime: DateTime.fromISO(datetime),
        }))
        .sort((a, b) => a.datetime - b.datetime)
    },
  },
  methods: {
    color(event) {
      return this.isInPast(event.datetime) ? 'grey' : undefined
    },
    eventDateTime(event, forceFull = false) {
      if (this.dense && !forceFull) {
        return this.formatDateCompact(event.datetime)
      }
      return this.formatDateTimeFull(event.datetime)
    },
    eventName(event) {
      return this.$t(`course.schedule.${event.name}`)
    },
  },
}
</script>

<style scoped>
.dense-timeline {
  padding-top: 12px;
}
.theme--light.dense-timeline:before {
  left: calc(60% - 3px) !important;
}
.dense-timeline-item {
  font-size: 0.775rem;
  margin: 0px 10px;
  padding-bottom: 15px;
}
.dense-timeline-item:deep(.v-timeline-item__body) {
  max-width: calc(40% - 16px) !important;
}
.dense-timeline-item:deep(.v-timeline-item__divider) {
  min-width: 32px;
}
.dense-timeline-item:deep(.v-timeline-item__opposite) {
  max-width: calc(60% - 16px) !important;
  padding-right: 2px;
}
</style>

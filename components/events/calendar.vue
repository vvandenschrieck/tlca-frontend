<!-- eslint-disable vue/no-v-html -->
<template>
  <ApolloQuery
    v-slot="{ isLoading, result: { error } }"
    :query="require('~/gql/components/getEvents.gql')"
    :update="(data) => data.events"
    :variables="{ courseCode }"
    @result="setEvents"
  >
    <v-progress-linear v-if="!!isLoading" indeterminate />

    <div v-if="!error">
      <v-sheet height="64">
        <v-toolbar flat>
          <v-btn
            outlined
            class="mr-4"
            color="grey darken-2"
            small
            @click="setToday"
          >
            {{ $t('general.today') }}
          </v-btn>

          <v-btn color="grey darken-2" fab small text @click="prev">
            <v-icon small>mdi-chevron-left</v-icon>
          </v-btn>

          <v-btn color="grey darken-2" fab small text @click="next">
            <v-icon small>mdi-chevron-right</v-icon>
          </v-btn>

          <v-toolbar-title v-if="$refs.calendar">
            {{ $refs.calendar.title }}
          </v-toolbar-title>

          <v-spacer />
        </v-toolbar>
      </v-sheet>

      <v-sheet height="450">
        <v-calendar
          ref="calendar"
          v-model="focus"
          color="primary"
          :events="allEvents"
          :locale="$i18n.locale"
          type="week"
          @mousedown:event="startDrag"
          @mousedown:time="startTime"
          @mousemove:time="mouseMove"
          @mouseup:time="endDrag"
        >
          <template #event="{ event, eventSummary, timed }">
            <div class="v-event-draggable" v-html="eventSummary()" />
            <div
              v-if="timed"
              class="v-event-drag-bottom"
              @mousedown.stop="extendBottom(event)"
            />
          </template>
        </v-calendar>
      </v-sheet>
    </div>

    <div v-else>{{ $t('error.unexpected') }}</div>
  </ApolloQuery>
</template>

<script>
import datetime from '@/mixins/datetime.js'

import createEvent from '~/gql/teach/createEvent.gql'

export default {
  name: 'EventsCalendar',
  mixins: [datetime],
  props: {
    courseCode: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      createdEvents: [],
      dragStart: null,
      dragTime: null,
      events: [],
      extendOriginal: null,
      focus: '',
      newEvent: null,
      newStart: null,
      selectedEvent: null,
    }
  },
  computed: {
    allEvents() {
      return this.events
        .map((e) => ({
          color: this.eventColor(e.type),
          end: this.toFormat(e.end),
          id: e.id,
          name: e.title,
          start: this.toFormat(e.start),
          type: e.type,
        }))
        .concat(this.createdEvents)
    },
  },
  methods: {
    async endDrag() {
      this.dragTime = null
      this.newStart = null

      // Update an existing event.
      if (
        (this.selectedEvent &&
          this.createdEvents.includes(this.selectedEvent)) ||
        (this.newEvent && this.extendOriginal)
      ) {
        this.extendOriginal = null
        this.selectedEvent = null
      }
      // Create a new event.
      else if (this.newEvent) {
        const event = this.newEvent
        const data = {
          courseCode: this.courseCode,
          end: event.end,
          start: event.start,
          title: event.name,
          type: 'LECTURE',
        }

        try {
          const response = await this.$apollo
            .mutate({
              mutation: createEvent,
              variables: data,
            })
            .then(({ data }) => data && data.createEvent)

          if (response) {
            event.color = 'primary'
          }
        } catch (err) {
          event.toDelete = true
          this.createdEvents = this.createdEvents.filter((e) => !e.toDelete)
        }

        this.newEvent = null
      }
    },
    eventColor(type = 'default') {
      return {
        ASSESSMENT: 'orange',
        default: 'primary',
        LAB: 'brown',
        LECTURE: 'green',
      }[type]
    },
    extendBottom(event) {
      if (this.createdEvents.includes(event)) {
        this.newEvent = event
        this.newStart = event.start
        this.extendOriginal = event.end
      }
    },
    mouseMove(tms) {
      const mouse = this.toTime(tms)

      // Move the selected event.
      if (this.selectedEvent?.timed && this.dragTime) {
        const event = this.selectedEvent
        const duration = event.end - event.start

        event.start = this.roundTime(mouse - this.dragTime)
        event.end = event.start + duration
      }
      // Extend a new event being created.
      else if (this.newEvent && this.newStart) {
        const event = this.newEvent
        const mouseRounded = this.roundTime(mouse, false)

        event.start = Math.min(mouseRounded, this.newStart)
        event.end = Math.max(mouseRounded, this.newStart)
      }
    },
    next() {
      this.$refs.calendar.next()
    },
    prev() {
      this.$refs.calendar.prev()
    },
    roundTime(time, down = true) {
      const roundTo = 15
      const roundDownTime = roundTo * 60 * 1000

      return down
        ? time - (time % roundDownTime)
        : time + (roundDownTime - (time % roundDownTime))
    },
    setEvents({ data: events }) {
      this.events = events ?? []
    },
    setToday() {
      this.focus = ''
    },
    startDrag({ event, timed }) {
      if (event && timed) {
        this.selectedEvent = event
        this.dragTime = null
        this.extendOriginal = null
      }
    },
    startTime(tms) {
      const mouse = this.toTime(tms)

      // Drag an existing event.
      if (this.selectedEvent && !this.dragTime) {
        this.dragTime = mouse - this.selectedEvent.start
      }
      // Create a new event.
      else {
        this.newStart = this.roundTime(mouse)
        this.newEvent = {
          color: 'grey lighten-1',
          end: this.newStart,
          name: `Event #${this.createdEvents.length + 1}`,
          start: this.newStart,
          timed: true,
        }

        this.createdEvents.push(this.newEvent)
      }
    },
    toTime(tms) {
      return new Date(
        tms.year,
        tms.month - 1,
        tms.day,
        tms.hour,
        tms.minute
      ).getTime()
    },
  },
}
</script>

<style scoped lang="scss">
.v-event-draggable {
  padding-left: 6px;
}

.v-event-timed {
  user-select: none;
  -webkit-user-select: none;
}

.v-event-drag-bottom {
  bottom: 4px;
  cursor: ns-resize;
  height: 4px;
  left: 0;
  position: absolute;
  right: 0;

  &::after {
    border-bottom: 1px solid white;
    border-top: 1px solid white;
    content: '';
    display: none;
    height: 4px;
    left: 50%;
    margin-left: -8px;
    opacity: 0.8;
    position: absolute;
    width: 16px;
  }

  &:hover::after {
    display: block;
  }
}
</style>

<template>
  <div>
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
        :events="events"
        :locale="$i18n.locale"
        type="week"
      />
    </v-sheet>
  </div>
</template>

<script>
import datetime from '@/mixins/datetime.js'

export default {
  name: 'EventsCalendar',
  mixins: [datetime],
  props: {
    items: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      focus: '',
    }
  },
  computed: {
    events() {
      return this.items.map((e) => ({
        end: this.toFormat(e.end),
        name: e.title,
        start: this.toFormat(e.start),
      }))
    },
  },
  methods: {
    next() {
      this.$refs.calendar.next()
    },
    prev() {
      this.$refs.calendar.prev()
    },
    setToday() {
      this.focus = ''
    },
  },
}
</script>

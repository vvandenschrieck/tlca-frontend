<template>
  <v-menu
    v-model="showMenu"
    :close-on-content-click="false"
    :max-width="290"
    :min-width="290"
    :nudge-right="40"
    offset-y
  >
    <template #activator="{ on, attrs }">
      <v-text-field
        :error-messages="$attrs.errorMessages"
        prepend-icon="mdi-calendar-clock"
        readonly
        :value="formatDateTimeFull(value)"
        v-bind="{ ...$attrs, ...attrs }"
        v-on="on"
      />
    </template>

    <v-card>
      <v-card-text class="px-0 py-0">
        <v-tabs v-model="activeTab" fixed-tabs>
          <v-tab key="calendar">
            <v-icon>mdi-calendar</v-icon>
          </v-tab>
          <v-tab key="timer" :disabled="!dateSelected">
            <v-icon>mdi-clock-time-four-outline</v-icon>
          </v-tab>

          <v-tab-item key="calendar">
            <v-date-picker
              v-model="date"
              class="rounded-0"
              full-width
              @input="showTimePicker"
            />
          </v-tab-item>

          <v-tab-item key="timer">
            <v-time-picker
              ref="timer"
              v-model="time"
              class="rounded-0"
              full-width
            />
          </v-tab-item>
        </v-tabs>
      </v-card-text>

      <v-card-actions>
        <v-spacer />
        <v-btn text @click.native="clear">Clear</v-btn>
        <v-btn text @click="submit">OK</v-btn>
      </v-card-actions>
    </v-card>
  </v-menu>
</template>

<script>
import { DateTime } from 'luxon'

import datetime from '@/mixins/datetime.js'

export default {
  name: 'DateTimePicker',
  mixins: [datetime],
  inheritAttrs: false,
  props: {
    value: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      activeTab: 0,
      datetime: null,
      showMenu: false,
    }
  },
  computed: {
    date: {
      get() {
        return this.datetime?.toISODate()
      },
      set(value) {
        const date = DateTime.fromFormat(value, 'yyyy-LL-dd')

        if (!this.datetime) {
          this.datetime = date
          return
        }

        this.datetime = this.datetime.set({
          day: date.day,
          month: date.month,
          year: date.year,
        })
      },
    },
    time: {
      get() {
        return (
          this.datetime?.toISOTime({
            includeOffset: false,
            suppressSeconds: true,
          }) ?? '00:00'
        )
      },
      set(value) {
        const time = DateTime.fromFormat(value, 'hh:mm')
        this.datetime = this.datetime.set({
          hour: time.hour,
          minute: time.minute,
        })
      },
    },
    dateSelected() {
      return this.date
    },
  },
  watch: {
    value: {
      handler(value) {
        const datetime = DateTime.fromISO(value)
        if (!datetime.invalid) {
          this.datetime = datetime
        }
      },
      immediate: true,
    },
  },
  methods: {
    clear() {
      this.datetime = null
      this.$emit('input', '')
    },
    resetPicker() {
      this.activeTab = 0
      this.showMenu = false
      if (this.$refs.timer) {
        this.$refs.timer.selectingHour = true
      }
    },
    showTimePicker() {
      this.activeTab = 1
    },
    submit() {
      this.resetPicker()
      this.$emit('input', this.datetime?.toISO() ?? '')
    },
  },
}
</script>

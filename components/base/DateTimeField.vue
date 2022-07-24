<template>
  <v-menu
    v-model="showMenu"
    :close-on-content-click="false"
    :nudge-right="40"
    :max-width="290"
    :min-width="290"
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
            ></v-date-picker>
          </v-tab-item>

          <v-tab-item key="timer">
            <v-time-picker
              ref="timer"
              v-model="time"
              class="rounded-0"
              full-width
            ></v-time-picker>
          </v-tab-item>
        </v-tabs>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn text @click.native="clear">Clear</v-btn>
        <v-btn text @click="submit">OK</v-btn>
      </v-card-actions>
    </v-card>
  </v-menu>
</template>

<script>
import datetime from '@/mixins/datetime.js'

export default {
  name: 'DateTimeField',
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
      date: '',
      showMenu: false,
      time: '00:00',
    }
  },
  computed: {
    dateSelected() {
      return this.date
    },
    selectedDatetime() {
      if (this.date && this.time) {
        return `${this.date} ${this.time}`
      }

      return ''
    },
  },
  methods: {
    clear() {
      this.date = ''
      this.time = '00:00'
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
      this.$emit('input', this.selectedDatetime)
    },
  },
}
</script>

<template>
  <generic-info-panel icon="mdi-clock" :title="$t('general.deadline')">
    <div class="text-center mt-3">
      <div class="text-h3 mb-2" :class="{ 'red--text': remaining <= 11 }">
        <span v-if="showTimer">{{ formatDuration(remaining) }}</span>
        <v-btn
          :disabled="remaining <= 31"
          icon
          small
          @click="switchTimerVisibility"
        >
          <v-icon small>{{ visibilityIcon }}</v-icon>
        </v-btn>
      </div>
      <div>
        <b>À finir pour</b><br />
        {{ formatDateTimeFull(deadline) }}
      </div>
    </div>
  </generic-info-panel>
</template>

<script>
import datetime from '@/mixins/datetime.js'

export default {
  name: 'TimerInfoPanel',
  mixins: [datetime],
  props: {
    deadline: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      hideTimer: false,
      isTimeUp: false,
      remaining: null,
    }
  },
  computed: {
    showTimer() {
      return !this.hideTimer || this.remaining <= 31
    },
    visibilityIcon() {
      return this.showTimer ? 'mdi-eye-off' : 'mdi-eye'
    },
  },
  watch: {
    remaining(value) {
      if (value !== null) {
        if (value <= 31) {
          this.hideTimer = false
        }
        if (value <= 0 && !this.isTimeUp) {
          this.isTimeUp = true
          this.$emit('timeup')
        }
      }
    },
  },
  mounted() {
    setInterval(() => {
      this.remaining = this.remainingTime(this.deadline)
    }, 1000)
  },
  methods: {
    switchTimerVisibility() {
      this.hideTimer = !this.hideTimer
    },
  },
}
</script>

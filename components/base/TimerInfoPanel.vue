<template>
  <generic-info-panel icon="mdi-clock" :title="$t('general.deadline')">
    <div class="text-center mt-3">
      <span class="text-h3" :class="{ 'red--text': remaining <= 10 }">
        {{ formatDuration(remaining) }} </span
      ><br />
      <b>À finir pour</b><br />
      {{ formatDateTimeFull(deadline) }}
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
      remaining: null,
      isTimeUp: false,
    }
  },
  watch: {
    remaining(value) {
      if (value !== null && value <= 0 && !this.isTimeUp) {
        this.isTimeUp = true
        this.$emit('timeup')
      }
    },
  },
  mounted() {
    setInterval(() => {
      this.remaining = this.remainingTime(this.deadline)
    }, 1000)
  },
}
</script>

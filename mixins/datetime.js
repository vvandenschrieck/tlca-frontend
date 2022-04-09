import { DateTime } from 'luxon'

export default {
  methods: {
    isInPast(datetime) {
      return datetime <= DateTime.now()
    },
    formatDateTime(datetime, format) {
      if (datetime instanceof String || typeof datetime === 'string') {
        datetime = DateTime.fromISO(datetime)
      }
      return datetime.setLocale(this.$i18n.locale).toLocaleString(format)
    },
    formatDateFull(datetime) {
      return this.formatDateTime(datetime, DateTime.DATE_MED_WITH_WEEKDAY)
    },
    formatDateTimeFull(datetime) {
      return this.formatDateTime(datetime, DateTime.DATETIME_MED_WITH_WEEKDAY)
    },
  },
}

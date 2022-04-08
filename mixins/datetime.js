import { DateTime } from 'luxon'

export default {
  methods: {
    isInPast(datetime) {
      return datetime <= DateTime.now()
    },
    formatDateTimeFull(datetime) {
      if (datetime instanceof String || typeof(datetime) === 'string') {
        datetime = DateTime.fromISO(datetime)
      }
      return datetime
        .setLocale(this.$i18n.locale)
        .toLocaleString(DateTime.DATETIME_MED_WITH_WEEKDAY)
    },
  },
}

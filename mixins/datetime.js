import { DateTime } from 'luxon'

export default {
  methods: {
    formatDateCompact(datetime) {
      return this.formatDateTime(datetime, DateTime.DATE_SHORT)
    },
    formatDateFull(datetime) {
      return this.formatDateTime(datetime, DateTime.DATE_MED_WITH_WEEKDAY)
    },
    formatDateTime(datetime, format) {
      // Try to convert the 'datetime' to a DateTime object.
      if (datetime instanceof String || typeof datetime === 'string') {
        datetime = DateTime.fromISO(datetime)
      } else if (datetime instanceof Date) {
        datetime = DateTime.fromJSDate(datetime)
      }

      // Format the date with respect to the current locale and specified format.
      if (!datetime.invalid) {
        return datetime.setLocale(this.$i18n.locale).toLocaleString(format)
      }

      return ''
    },
    formatDateTimeCompact(datetime) {
      return this.formatDateTime(datetime, DateTime.DATETIME_SHORT)
    },
    formatDateTimeFull(datetime) {
      return this.formatDateTime(datetime, DateTime.DATETIME_MED_WITH_WEEKDAY)
    },
    isInFuture(datetime) {
      return datetime && datetime > DateTime.now()
    },
    isInPast(datetime) {
      return datetime && datetime < DateTime.now()
    },
    toFormat(datetime, format = 'yyyy-MM-dd HH:mm') {
      // Try to convert the 'datetime' to a DateTime object.
      if (datetime instanceof String || typeof datetime === 'string') {
        datetime = DateTime.fromISO(datetime)
      } else if (datetime instanceof Date) {
        datetime = DateTime.fromJSDate(datetime)
      }

      // Format the date to the specified or default format.
      if (!datetime.invalid) {
        return datetime.toFormat(format)
      }

      return ''
    },
  },
}

import { DateTime, Duration } from 'luxon'

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
    formatDuration(seconds) {
      if (seconds === null || seconds === undefined) {
        return '--:--'
      }
      return Duration.fromMillis(seconds * 1000).toFormat('mm:ss')
    },
    isInFuture(datetime) {
      return datetime && datetime > DateTime.now()
    },
    isInPast(datetime) {
      return datetime && datetime < DateTime.now()
    },
    remainingTime(deadline) {
      if (!deadline) {
        return 0
      }

      const remaining = DateTime.fromISO(deadline)
        .diff(DateTime.now())
        .as('seconds')
      return remaining >= 0 ? remaining : 0
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

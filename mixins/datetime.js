import { DateTime } from 'luxon';

export default {
  methods: {
    isInPast(datetime) {
      return datetime <= DateTime.now();
    },
    formatDateTimeFull(datetime) {
      return datetime.setLocale(this.$i18n.locale).toLocaleString(DateTime.DATETIME_MED_WITH_WEEKDAY);
    }
  }
}

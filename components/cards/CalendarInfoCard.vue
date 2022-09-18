<template>
  <generic-info-card
    icon="mdi-calendar"
    :link="{
      icon: 'mdi-view-list',
      text: $tc('calendar.event', 2),
      to: {
        name: 'teach-courses-code-calendar',
        params: { code: courseCode },
      },
    }"
    :title="$t('calendar._')"
  >
    <v-alert dense outlined type="info">Upcoming feature</v-alert>
  </generic-info-card>
</template>

<script>
export default {
  name: 'CalendarInfoCard',
  props: {
    courseCode: {
      type: String,
      required: true,
    },
  },
}
</script>

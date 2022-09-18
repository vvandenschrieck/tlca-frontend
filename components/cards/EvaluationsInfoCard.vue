<template>
  <generic-info-card
    icon="mdi-clipboard-edit"
    :link="{
      icon: 'mdi-view-list',
      text: $t('general.list'),
      to: {
        name: 'teach-courses-code-evaluations',
        params: { code: courseCode },
      },
    }"
    :title="$tc('evaluation._', 2)"
  >
    <v-alert dense outlined type="info">Upcoming feature</v-alert>
  </generic-info-card>
</template>

<script>
export default {
  name: 'EvaluationsInfoCard',
  props: {
    courseCode: {
      type: String,
      required: true,
    },
  },
}
</script>

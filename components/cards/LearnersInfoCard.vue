<template>
  <generic-info-card
    icon="mdi-account-school"
    :link="{
      icon: 'mdi-view-list',
      text: $t('general.list'),
      to: {
        name: 'teach-courses-code-learners',
        params: { code: courseCode },
      },
    }"
    :title="$tc('learner._', 2)"
  >
    <v-alert dense outlined type="info">Upcoming feature</v-alert>
  </generic-info-card>
</template>

<script>
export default {
  name: 'LearnersInfoCard',
  props: {
    courseCode: {
      type: String,
      required: true,
    },
  },
}
</script>

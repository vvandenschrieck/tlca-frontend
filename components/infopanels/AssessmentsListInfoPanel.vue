<template>
  <generic-info-panel
    :title="$t('general.information._')"
    icon="mdi-information"
    :items="items"
  >
    <div class="text-center">
      <v-btn small color="success" :to="{ name: 'manage-courses-code-assessment-create' }">
        <v-icon left>mdi-plus</v-icon>
        <span v-t="'general.create'"></span>
      </v-btn>
    </div>
  </generic-info-panel>
</template>

<script>
export default {
  name: 'AssessmentsListInfoPanel',
  props: {
    assessments: {
      type: Array,
      required: true,
    },
  },
  computed: {
    items() {
      const items = []

      // Number of assessments
      items.push({
        icon: 'mdi-clipboard-text',
        text: this.$tc('assessment.nb', this.assessments.length, {
          nb: this.assessments.length,
        }),
        tooltip: this.$t('assessment.nb_of'),
      })

      return items
    },
  },
}
</script>

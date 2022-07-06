<template>
  <generic-info-panel
    :title="$t('global.information')"
    icon="mdi-information"
    :items="items"
  >
    <div class="text-center">
      <v-btn small color="success" :to="{ name: 'manage-competencies-create' }">
        <v-icon left>mdi-plus</v-icon>
        <span v-t="'general.create'"></span>
      </v-btn>
    </div>
  </generic-info-panel>
</template>

<script>
export default {
  name: 'CompetenciesListInfoPanel',
  props: {
    competencies: {
      type: Array,
      required: true,
    },
  },
  computed: {
    items() {
      const items = []

      // Number of competencies
      items.push({
        icon: 'mdi-clipboard-text',
        text: this.$tc('competency.nb', this.competencies.length, {
          nb: this.competencies.length,
        }),
        tooltip: this.$t('competency.nb_of'),
      })

      return items
    },
  },
}
</script>

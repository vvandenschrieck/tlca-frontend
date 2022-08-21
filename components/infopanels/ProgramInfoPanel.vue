<template>
  <generic-info-panel
    :title="$t('general.information._')"
    icon="mdi-information"
    :items="items"
  />
</template>

<script>
export default {
  name: 'ProgramInfoPanel',
  props: {
    program: {
      type: Object,
      required: true,
    },
  },
  computed: {
    items() {
      const items = []

      // Program partners
      const partners = this.program.partners
      if (partners?.length) {
        items.push({
          icon: 'mdi-domain',
          text: partners.map((p) => p.abbreviation || p.name).join(', '),
          tooltip: this.$tc('partner._', partners.length),
        })
      }

      // Program field
      const field = this.program.field
      if (field) {
        items.push({
          icon: 'mdi-school',
          text: field,
          tooltip: this.$t('program.field'),
        })
      }

      // Program tags
      const tags = this.program.tags
      if (tags?.length) {
        items.push({
          icon: 'mdi-tag-multiple',
          text: tags.join(', '),
          tooltip: this.$tc('program.tags', tags.length),
        })
      }

      // Program language
      const language = this.program.language
      if (language) {
        items.push({
          icon: 'mdi-translate',
          text: language,
          tooltip: this.$t('program.language'),
        })
      }

      // Program coordinator
      const coordinator = this.program.coordinator
      if (coordinator) {
        items.push({
          icon: 'mdi-account',
          text: coordinator.displayName,
          tooltip: this.$t('program.coordinator'),
        })
      }

      return items
    },
  },
}
</script>

<template>
  <generic-info-panel
    :title="$t('general.information._')"
    icon="mdi-information"
    :items="items"
  />
</template>

<script>
export default {
  name: 'CompetencyInfoPanel',
  props: {
    competency: {
      type: Object,
      required: true,
    },
  },
  computed: {
    items() {
      const items = []

      // Competency type
      const type = this.competency.type
      if (type) {
        items.push({
          icon: 'mdi-format-list-bulleted',
          text: this.$t(`competency.type.${type.toLowerCase()}`),
          tooltip: this.$t('competency.type._'),
        })
      }

      // Competency visibility
      const isPublic = this.competency.public
      items.push({
        icon: 'mdi-eye',
        text: this.$t(
          `competency.visibility.${isPublic ? 'public' : 'private'}`
        ),
        tooltip: this.$t('competency.visibility._'),
      })

      // Competency partners
      const partners = this.competency.partners
      if (partners?.length) {
        items.push({
          icon: 'mdi-domain',
          text: partners.map((p) => p.abbreviation || p.name).join(', '),
          tooltip: this.$tc('competency.partners', partners.length),
        })
      }

      // Competency creator
      const coordinator = this.competency.user
      if (coordinator) {
        items.push({
          icon: 'mdi-account',
          text: coordinator.displayName,
          tooltip: this.$t('competency.coordinator'),
        })
      }

      return items
    },
  },
}
</script>

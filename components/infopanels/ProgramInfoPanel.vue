<template>
  <generic-info-panel
    :title="$t('global.information')"
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
      return items
    },
  },
}
</script>

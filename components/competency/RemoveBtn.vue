<template>
  <v-tooltip bottom open-delay="500">
    <template #activator="{ on, attrs }">
      <v-btn
        :disabled="disabled"
        icon
        v-bind="attrs"
        v-on="on"
        @click="$emit('click')"
      >
        <v-icon small>mdi-delete</v-icon>
      </v-btn>
    </template>
    <span>{{ $t('competency.remove') }}</span>
  </v-tooltip>
</template>

<script>
export default {
  name: 'CompetencyRemoveBtn',
  props: {
    disabled: {
      type: Boolean,
      default: false,
    },
  },
}
</script>

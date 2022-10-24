<template>
  <v-tooltip :disabled="!dense" bottom open-delay="500">
    <template #activator="{ on, attrs }">
      <v-btn
        :icon="dense"
        small
        v-bind="{ ...$attrs, ...attrs }"
        v-on="{ ...$listeners, ...on }"
      >
        <v-icon :left="!dense" :small="dense">{{ icon }}</v-icon>
        <span v-if="!dense">{{ label }}</span>
      </v-btn>
    </template>

    <span>{{ label }}</span>
  </v-tooltip>
</template>

<script>
export default {
  name: 'GenericBtn',
  props: {
    dense: {
      type: Boolean,
      default: false,
    },
    icon: {
      type: String,
      required: true,
    },
    label: {
      type: String,
      required: true,
    },
  },
}
</script>

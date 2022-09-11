<template>
  <v-card :loading="loading">
    <v-card-title class="py-2">
      <v-icon left size="20">{{ icon }}</v-icon>
      <span>{{ title }}</span>
    </v-card-title>

    <v-card-text class="pt-3">
      <slot />

      <div v-if="link" class="mt-3 text-right">
        <v-btn color="primary" outlined small :to="link.to">
          <v-icon left>{{ link.icon }}</v-icon>
          <span>{{ link.text }}</span>
        </v-btn>
      </div>
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  name: 'GenericCardPanel',
  props: {
    title: {
      type: String,
      required: true,
    },
    icon: {
      type: String,
      required: true,
    },
    link: {
      type: Object,
      default: undefined,
    },
    loading: {
      type: Boolean,
      default: false,
    },
  },
}
</script>

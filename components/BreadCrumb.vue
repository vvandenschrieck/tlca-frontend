<template>
  <v-card flat color="grey lighten-3" class="my-2">
    <v-breadcrumbs divider="/" :items="items" class="py-2"></v-breadcrumbs>
  </v-card>
</template>

<script>
export default {
  name: 'BreadCrumb',
  props: {
    items: {
      type: Array,
      default: undefined,
    },
  },
}
</script>

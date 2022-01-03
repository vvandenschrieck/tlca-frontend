<template>
  <div>
    <v-card flat color="grey lighten-3" class="my-2">
      <v-breadcrumbs divider="/" :items="navItems" class="py-2"></v-breadcrumbs>
    </v-card>
    <h2>{{ title }}</h2>
    <card-list :name="name" :component="component" :items="items" :items-per-page="8" />
  </div>
</template>

<script>
export default {
  name: 'ListPage',
  props: {
    component: {
      type: Object,
      required: true
    },
    items: {
      type: Array,
      default: undefined
    },
    name: {
      type: String,
      required: true
    },
    navItems: {
      type: Array,
      required: true
    },
    title: {
      type: String,
      required: true
    }
  }
}
</script>

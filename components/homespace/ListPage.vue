<template>
  <div>
    <h2 v-text="title"></h2>

    <card-list
      :component="component"
      :items="items"
      :items-per-page="8"
      :prop-name="propName"
    />
  </div>
</template>

<script>
export default {
  name: 'ListPage',
  props: {
    component: {
      type: Object,
      required: true,
    },
    items: {
      type: Array,
      default: undefined,
    },
    propName: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
  },
}
</script>

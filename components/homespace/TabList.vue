<template>
  <card-list
    :component="component"
    :items="items"
    :pagination="{ perPage: 4 }"
    :prop-name="propName"
  >
    <div slot="append" class="action py-8">
      <v-btn small :to="{ name }">
        {{ $t(`homepage.see_all_${name}`) }}
      </v-btn>
    </div>
  </card-list>
</template>

<script>
export default {
  name: 'TabList',
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
  },
  computed: {
    name() {
      return `${this.propName}s`
    },
  },
}
</script>

<style scoped>
.action {
  text-align: center;
}
</style>

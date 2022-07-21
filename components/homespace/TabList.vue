<template>
  <card-list
    :component="component"
    :items="items"
    :pagination="{ perPage: 4 }"
    :prop-name="propName"
  >
    <template #append>
      <div align="center" class="py-8">
        <v-btn :to="{ name }">
          {{ $t(`homepage.see_all_${name}`) }}
        </v-btn>
      </div>
    </template>
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
      return this.propName + 's'
    },
  },
}
</script>

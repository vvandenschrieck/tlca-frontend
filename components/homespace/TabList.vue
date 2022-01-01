<template>
  <card-list :name="name" :component="component" :items="items" :pagination="{ perPage: 4 }">
    <template #append>
      <div align="center" class="py-8">
        <v-btn :to="{ name: name }">{{ $t(`homepage.see_all_${name}`) }}</v-btn>
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
      required: true
    },
    name: {
      type: String,
      required: true
    },
    items: {
      type: Array,
      default: undefined
    },
  }
}
</script>

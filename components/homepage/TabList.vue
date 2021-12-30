<template>
  <div v-if="items">
    <div v-if="items.length">
      <v-row justify="start" align="stretch">
        <v-col v-for="item in items" :key="item.code" cols="12" md="3" sm="4">
          <component :is="component.name" v-bind="{ [component.propName]: item }" class="card" />
        </v-col>
      </v-row>
      <div align="center" class="py-8">
        <v-btn :to="{ name: name }">{{ $t(`homepage.see_all_${name}`) }}</v-btn>
      </div>
    </div>
    <div v-else align="center">{{ $t(`${name.slice(0, -1)}.no`) }}</div>
  </div>
  <!-- Boilerplate when items is not loaded yet -->
  <div v-else>
    <v-row justify="start" align="stretch">
      <v-col v-for="i in 4" :key="i" cols="12" md="3" sm="4">
        <v-skeleton-loader type="image"></v-skeleton-loader>
      </v-col>
    </v-row>
  </div>
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

<style scoped>
.card {
  height: 100%;
}
</style>

<template>
  <div v-if="items">
    <div v-if="items.length">
      <v-row justify="start" align="stretch">
        <v-col
          v-for="item in pageItems"
          :key="item.code"
          cols="12"
          :md="12 / cardsPerPage"
          sm="4"
        >
          <component
            :is="component"
            v-bind="{ [propName]: item }"
            class="card"
          />
        </v-col>
      </v-row>
      <div v-if="showPagination" class="text-center mt-5">
        <v-pagination v-model="currentPage" :length="length"></v-pagination>
      </div>
      <slot name="append"></slot>
    </div>
    <div v-else align="center">{{ $t(`${propName}.no`) }}</div>
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
  name: 'CardList',
  props: {
    component: {
      type: Object,
      required: true,
    },
    propName: {
      type: String,
      required: true,
    },
    items: {
      type: Array,
      default: undefined,
    },
    itemsPerPage: {
      type: Number,
      default: 4,
    },
    cardsPerPage: {
      type: Number,
      default: 4,
    },
  },
  data() {
    return {
      currentPage: 1,
    }
  },
  computed: {
    pageItems() {
      const start = (this.currentPage - 1) * this.itemsPerPage
      return this.items.slice(start, start + this.itemsPerPage)
    },
    length() {
      return Math.ceil(this.items.length / this.itemsPerPage)
    },
    showPagination() {
      return this.items.length > this.itemsPerPage
    },
  },
}
</script>

<style scoped>
.card {
  height: 100%;
}
</style>

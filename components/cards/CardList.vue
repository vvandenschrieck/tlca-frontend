<template>
  <div v-if="items">
    <div v-if="items.length">
      <v-row align="stretch" justify="start">
        <v-col
          v-for="item in pageItems"
          :key="item.code"
          cols="12"
          :md="12 / cardsPerPage"
          sm="4"
        >
          <component :is="component" v-bind="props(item)" class="card" />
        </v-col>
      </v-row>

      <div v-if="showPagination" class="mt-5 text-center">
        <v-pagination v-model="currentPage" :length="length" />
      </div>

      <slot name="append" />
    </div>
    <div v-else align="center">{{ $t(`${propName}.no`) }}</div>
  </div>

  <!-- Boilerplate when items is not loaded yet -->
  <v-row v-else align="stretch" justify="start">
    <v-col v-for="i in 4" :key="i" cols="12" md="3" sm="4">
      <v-skeleton-loader type="image" />
    </v-col>
  </v-row>
</template>

<script>
export default {
  name: 'CardList',
  props: {
    cardProps: {
      type: Object,
      default: () => {},
    },
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
    length() {
      return Math.ceil(this.items.length / this.itemsPerPage)
    },
    pageItems() {
      const start = (this.currentPage - 1) * this.itemsPerPage
      return this.items.slice(start, start + this.itemsPerPage)
    },
    showPagination() {
      return this.items.length > this.itemsPerPage
    },
  },
  methods: {
    props(item) {
      return { [this.propName]: item, ...this.cardProps }
    },
  },
}
</script>

<style scoped>
.card {
  height: 100%;
}
</style>

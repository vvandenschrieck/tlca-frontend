<template>
  <div>
    <div v-if="hasCategories" align="right">
      <v-switch
        v-model="showByCategories"
        class="d-inline-block mt-0 pt-0"
        dense
        hide-details
      >
        <span slot="label" class="text-subtitle-2">
          {{ $t('competency.show_by.category') }}
        </span>
      </v-switch>
    </div>

    <div v-for="category in competencies" :key="category.name">
      <h3>{{ category.name }}</h3>

      <slot :category="category" />
    </div>
  </div>
</template>

<script>
export default {
  name: 'CompetenciesList',
  props: {
    items: {
      type: Array,
      default: null,
    },
  },
  data() {
    return {
      showByCategories: false,
    }
  },
  computed: {
    categories() {
      if (!this.items || !this.items.length) {
        return { categories: [], withoutCategory: false }
      }

      const categories = ['BASIC']
      if (this.items.some((c) => c.category === 'ADVANCED')) {
        categories.push('ADVANCED')
      }
      let withoutCategory = false

      if (this.showByCategories) {
        const subcategories = new Set()

        for (const competency of this.items) {
          if (competency.subcategory) {
            subcategories.add(competency.subcategory)
          } else {
            withoutCategory = true
          }
        }

        categories.splice(0, categories.length)
        categories.push(...subcategories.values())
      }

      return { categories, withoutCategory }
    },
    competencies() {
      const { categories, withoutCategory } = this.categories

      const competencies = []
      for (const category of categories) {
        competencies.push({
          name: this.categoryName(category),
          values: this.items?.filter((c) => c[this.structure] === category),
        })
      }

      if (withoutCategory) {
        competencies.push({
          name: this.$t('competency.category.no'),
          values: this.items?.filter((c) => !c[this.structure]),
        })
      }

      return competencies
    },
    hasCategories() {
      return this.items?.some((c) => c.subcategory)
    },
    structure() {
      return this.showByCategories ? 'subcategory' : 'category'
    },
  },
  methods: {
    categoryName(category) {
      if (!this.showByCategories) {
        return this.$t(`competency.category.${category.toLowerCase()}`)
      }

      return category
    },
  },
}
</script>

<template>
  <div>
    <div v-for="category in competencies" :key="category.name">
      <h3>{{ category.name }}</h3>

      <v-list class="pa-0">
        <template v-for="(c, i) in category.values">
          <v-list-item :key="c.competency.code">
            <v-list-item-content>
              <v-list-item-title>
                {{ competencyName(c.competency) }}
              </v-list-item-title>
            </v-list-item-content>

            <v-list-item-action>
              <stars-field readonly />
            </v-list-item-action>
          </v-list-item>

          <v-divider v-if="i < category.values.length - 1" :key="i" />
        </template>
      </v-list>
    </div>

    <div v-if="hasCategories" class="float-right">
      <v-switch v-model="showByCategory" dense>
        <span slot="label" class="text-subtitle-2">
          {{ $t('competency.show_by.category') }}
        </span>
      </v-switch>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CourseCompetencyProgressList',
  props: {
    items: {
      type: Array,
      default: null,
    },
  },
  data() {
    return {
      showByCategory: false,
    }
  },
  computed: {
    categories() {
      const categories = ['BASIC']
      if (this.items.some((c) => c.category === 'ADVANCED')) {
        categories.push('ADVANCED')
      }
      let withoutCategory = false

      if (this.showByCategory) {
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
      const competencies = []

      if (this.items?.length) {
        const { categories, withoutCategory } = this.categories

        for (const category of categories) {
          competencies.push({
            name: this.categoryName(category),
            values: this.items.filter((c) => c[this.structure] === category),
          })
        }

        if (withoutCategory) {
          competencies.push({
            name: this.$t('competency.category.no'),
            values: this.items.filter((c) => !c[this.structure]),
          })
        }
      }

      return competencies
    },
    hasCategories() {
      return this.items?.some((c) => c.subcategory)
    },
    structure() {
      return this.showByCategory ? 'subcategory' : 'category'
    },
  },
  methods: {
    categoryName(category) {
      if (!this.showByCategory) {
        return this.$t(`competency.category.${category.toLowerCase()}`)
      }

      return category
    },
    competencyName(competency) {
      return competency.code + ' – ' + competency.name
    },
  },
}
</script>

<!-- eslint-disable vue/no-v-html -->
<template>
  <div>
    <div v-if="hasCategories" align="right">
      <v-select
        v-model="structure"
        class="d-inline-block text-caption"
        dense
        height="20"
        hide-details
        item-text="by"
        item-value="value"
        :items="view"
        outlined
      >
        <template #selection="{ item }">
          <v-list-item dense class="pa-0 showby">
            <v-list-item-content class="pa-0">
              <v-list-item-title>
                {{ item.by }}
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </template>
      </v-select>
    </div>

    <div v-for="category in competencies" :key="category.name">
      <h3>{{ category.name }}</h3>

      <v-expansion-panels accordion flat multiple tile>
        <v-expansion-panel
          v-for="c in category.values"
          :key="c.competency.code"
        >
          <v-expansion-panel-header class="px-0 name">
            {{ competencyName(c.competency) }}
          </v-expansion-panel-header>

          <v-expansion-panel-content>
            <v-card flat>
              <v-card-text class="font-italic ma-0 pa-0 text--primary">
                <div
                  v-if="c.competency.description"
                  v-html="c.competency.description"
                />

                <template v-if="c.useLearningOutcomes">
                  <h4>{{ $t('competency.learning_outcomes._') }}</h4>

                  <learning-outcomes-list
                    hide-takes
                    :items="c.competency.learningOutcomes"
                  />
                </template>

                <template
                  v-if="!c.competency.description && !c.useLearningOutcomes"
                >
                  {{ $t('global.description.no') }}
                </template>
              </v-card-text>
            </v-card>
          </v-expansion-panel-content>
        </v-expansion-panel>
      </v-expansion-panels>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CompetencyList',
  props: {
    items: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      structure: 'category',
    }
  },
  computed: {
    categories() {
      const categories = ['BASIC']
      if (this.items.some((c) => c.category === 'ADVANCED')) {
        categories.push('ADVANCED')
      }
      let withoutCategory = false

      if (this.structure === 'subcategory') {
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
          values: this.items.filter((c) => c[this.structure] === category),
        })
      }

      if (withoutCategory) {
        competencies.push({
          name: this.$t('competency.category.no'),
          values: this.items.filter((c) => !c[this.structure]),
        })
      }

      return competencies
    },
    hasCategories() {
      return this.items.some((c) => c.subcategory)
    },
    view() {
      return [
        {
          by: this.$t('competency.show_by.level'),
          value: 'category',
        },
        {
          by: this.$t('competency.show_by.category'),
          value: 'subcategory',
        },
      ]
    },
  },
  methods: {
    categoryName(category) {
      if (this.structure === 'category') {
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

<style scoped>
.name {
  font-size: 0.875rem;
}
.showby {
  min-height: 20px;
}
</style>

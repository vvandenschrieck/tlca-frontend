<!-- eslint-disable vue/no-v-html -->
<template>
  <ApolloQuery
    v-slot="{ isLoading, result: { error } }"
    :query="require('~/gql/components/getCourseCompetencies.gql')"
    :update="(data) => data.course.competencies"
    :variables="{ courseCode }"
    @result="setCompetencies"
  >
    <v-progress-linear v-if="!!isLoading" indeterminate />

    <div v-if="!error">
      <div v-if="hasCategories" align="right">
        <v-switch
          v-model="showByCategories"
          class="d-inline-block"
          dense
          hide-details
        >
          <span slot="label" class="text-subtitle-2">
            {{ $t('competency.show_by.category') }}
          </span>
        </v-switch>
      </div>

      <div v-for="category in items" :key="category.name">
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

    <v-card-text v-else>{{ $t('error.unexpected') }}</v-card-text>
  </ApolloQuery>
</template>

<script>
export default {
  name: 'CourseCompetenciesList',
  props: {
    courseCode: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      competencies: [],
      showByCategories: false,
    }
  },
  computed: {
    categories() {
      if (!this.competencies) {
        return { categories: [], withoutCategory: false }
      }

      const categories = ['BASIC']
      if (this.competencies.some((c) => c.category === 'ADVANCED')) {
        categories.push('ADVANCED')
      }
      let withoutCategory = false

      if (this.showByCategories) {
        const subcategories = new Set()

        for (const competency of this.competencies) {
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
    items() {
      const { categories, withoutCategory } = this.categories

      const competencies = []
      for (const category of categories) {
        competencies.push({
          name: this.categoryName(category),
          values: this.competencies?.filter(
            (c) => c[this.structure] === category
          ),
        })
      }

      if (withoutCategory) {
        competencies.push({
          name: this.$t('competency.category.no'),
          values: this.competencies?.filter((c) => !c[this.structure]),
        })
      }

      return competencies
    },
    hasCategories() {
      return this.competencies?.some((c) => c.subcategory)
    },
    structure() {
      return this.showByCategories ? 'subcategory' : 'category'
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
      if (!this.showByCategories) {
        return this.$t(`competency.category.${category.toLowerCase()}`)
      }

      return category
    },
    competencyName(competency) {
      return competency.code + ' – ' + competency.name
    },
    setCompetencies({ data: competencies }) {
      this.competencies = competencies
    },
  },
}
</script>

<style scoped>
.name {
  font-size: 0.875rem;
}
</style>

<template>
  <ApolloQuery
    :query="require('~/gql/manage/getCompetencies.gql')"
    :update="(data) => data.competencies"
  >
    <template #default="{ result: { error, data: competencies }, isLoading }">
      <div v-if="!isLoading && competencies">
        <div v-if="value.length > 0">
          <v-row>
            <v-col
              v-for="(header, i) in headers"
              :key="i"
              cols="12"
              :md="header.size"
            >
              <b>{{ header.title }}</b>
            </v-col>
          </v-row>

          <v-row v-for="(competency, index) in value" :key="index">
            <v-col cols="12" md="7">
              <v-autocomplete-with-validation
                :value="competency.competency"
                :vid="`competency-${index}`"
                :items="competencies"
                item-value="code"
                :item-text="({ code, name }) => code + ' – ' + name"
                required
                rules="required"
                dense
                @input="update(index, 'competency', $event)"
              >
                <template #item="{ item: { code, name } }">
                  <b>{{ code }}</b>
                  &nbsp;–&nbsp;{{ name }}
                </template>
              </v-autocomplete-with-validation>
            </v-col>
            <v-col cols="12" md="2">
              <v-select-with-validation
                :value="competency.category"
                :vid="`competency-category-${index}`"
                :items="categories"
                required
                rules="required"
                dense
                @input="update(index, 'category', $event)"
              ></v-select-with-validation>
            </v-col>
            <v-col cols="12" md="2">
              <v-text-field
                :value="competency.subcategory"
                :vid="`competency-subcategory-${index}`"
                dense
                @input="update(index, 'subcategory', $event)"
              >
              </v-text-field>
            </v-col>
            <v-col cols="12" md="1" class="text-center">
              <v-btn icon :disabled="disabled" @click="removeCompetency(index)">
                <v-icon small>mdi-delete</v-icon>
              </v-btn>
            </v-col>
          </v-row>
        </div>
        <div v-else>
          {{ $t('competency.no') }}
        </div>

        <div class="text-right mt-5">
          <v-btn small :disabled="disabled" @click="addCompetency()">
            <v-icon left>mdi-plus</v-icon>
            {{ $t('course.competencies.add') }}
          </v-btn>
        </div>
      </div>

      <div v-else-if="isLoading">
        <v-skeleton-loader
          type="table-heading, table-row-divider"
        ></v-skeleton-loader>
      </div>

      <div v-else-if="error">An error occurred</div>
    </template>
  </ApolloQuery>
</template>

<script>
export default {
  name: 'SelectCourseCompetencies',
  props: {
    disabled: {
      type: Boolean,
      default: false,
    },
    value: {
      type: Array,
      default: () => [{}],
    },
  },
  computed: {
    categories() {
      return [
        { text: this.$t('competency.category.basic'), value: 'BASIC' },
        { text: this.$t('competency.category.advanced'), value: 'ADVANCED' },
      ]
    },
    headers() {
      return [
        { title: this.$tc('competency._', 1), size: 7 },
        { title: this.$t('course.competencies.category'), size: 2 },
        { title: this.$t('course.competencies.subcategory'), size: 2 },
        { title: this.$tc('general.action', 1), size: 1 },
      ]
    },
  },
  methods: {
    addCompetency() {
      if (!this.disabled) {
        this.$emit('input', [...this.value, {}])
      }
    },
    removeCompetency(index) {
      if (!this.disabled) {
        this.$emit('input', [
          ...this.value.slice(0, index),
          ...this.value.slice(index + 1),
        ])
      }
    },
    update(index, field, value) {
      this.$emit('input', [
        ...this.value.slice(0, index),
        {
          ...this.value[index],
          [field]: value,
        },
        ...this.value.slice(index + 1),
      ])
    },
  },
}
</script>

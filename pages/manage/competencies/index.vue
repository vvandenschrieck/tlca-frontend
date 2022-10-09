<template>
  <ApolloQuery
    v-slot="{ result: { error, data: competencies }, isLoading }"
    :query="require('~/gql/manage/getCompetencies.gql')"
    :update="(data) => data.competencies"
  >
    <div v-if="isLoading || competencies">
      <h2>{{ title }}</h2>

      <generic-filter-bar
        v-slot="{ filter: innerFilter, on }"
        v-model="filter"
        :create-link="{ name: 'manage-competencies-create' }"
      >
        <competencies-filter :value="innerFilter" v-on="on" />
      </generic-filter-bar>

      <div v-if="competencies" class="mt-5">
        <v-card v-if="filteredCompetencies(competencies, filter).length">
          <v-list class="pa-0">
            <template
              v-for="(competency, i) in filteredCompetencies(
                competencies,
                filter
              )"
            >
              <v-list-item
                :key="competency.code"
                :to="{
                  name: 'manage-competencies-code',
                  params: { code: competency.code },
                }"
              >
                <v-list-item-content>
                  <v-list-item-title>
                    <b>{{ competency.code }}</b> – {{ competency.name }}
                  </v-list-item-title>
                </v-list-item-content>
              </v-list-item>
              <v-divider
                v-if="i < competencies.length - 1"
                :key="i"
              ></v-divider>
            </template>
          </v-list>
        </v-card>

        <div v-else>{{ $t('competency.no') }}</div>
      </div>

      <v-skeleton-loader v-else class="mt-5" type="table"></v-skeleton-loader>
    </div>

    <div v-else-if="error">{{ $t('error.unexpected') }}</div>
  </ApolloQuery>
</template>

<script>
import competencies from '@/mixins/competencies.js'

export default {
  name: 'ManageCompetenciesPage',
  mixins: [competencies],
  data() {
    return {
      filter: {},
    }
  },
  head() {
    return {
      title: this.title,
    }
  },
  computed: {
    title() {
      return this.$tc('competency._', 2)
    },
  },
  meta: {
    roles: ['teacher'],
  },
}
</script>

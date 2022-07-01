<template>
  <ApolloQuery
    :query="require('~/gql/manage/getCompetencies.gql')"
    :update="(data) => data.competencies"
  >
    <template #default="{ result: { error, data: competencies }, isLoading }">
      <div v-if="isLoading || competencies">
        <bread-crumb :items="navItems('manage', 'competency')" />

        <h2>{{ $tc('competency._', 2) }}</h2>

        <v-row>
          <v-col cols="12" md="9">
            <v-data-table
              v-if="competencies && competencies.length"
              :headers="headers"
              :items="competencies"
              :items-per-page="5"
              class="elevation-1"
            >
            </v-data-table>

            <div
              v-else-if="competencies && !competencies.length"
              v-t="'competency.no'"
            ></div>

            <v-skeleton-loader v-else type="table"></v-skeleton-loader>
          </v-col>
          <v-col
            cols="12"
            md="3"
            :order="$vuetify.breakpoint.smAndDown ? 'first' : undefined"
          >
            <competencies-list-info-panel
              v-if="competencies"
              :competencies="competencies"
            />
          </v-col>
        </v-row>
      </div>

      <div v-else-if="error">An error occurred</div>
    </template>
  </ApolloQuery>
</template>

<script>
import breadcrumb from '@/mixins/breadcrumb.js'

export default {
  name: 'ManageCompetenciesPage',
  mixins: [breadcrumb],
  computed: {
    headers() {
      return [
        { text: this.$t('competency.code'), value: 'code' },
        { text: this.$t('competency.name'), value: 'name' },
      ]
    },
  },
  meta: {
    roles: ['teacher'],
  },
}
</script>
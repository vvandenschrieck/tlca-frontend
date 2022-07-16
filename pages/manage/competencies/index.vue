<template>
  <ApolloQuery
    :query="require('~/gql/manage/getCompetencies.gql')"
    :update="(data) => data.competencies"
  >
    <template #default="{ result: { error, data: competencies }, isLoading }">
      <div v-if="isLoading || competencies">
        <h2>{{ $tc('competency._', 2) }}</h2>

        <v-row>
          <v-col cols="12" md="9">
            <v-card v-if="competencies && competencies.length">
              <v-list class="pa-0">
                <template v-for="(competency, i) in competencies">
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
                  <v-divider v-if="i < competencies.length - 1" :key="i"></v-divider>
                </template>
              </v-list>
            </v-card>

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
export default {
  name: 'ManageCompetenciesPage',
  meta: {
    roles: ['teacher'],
  },
}
</script>
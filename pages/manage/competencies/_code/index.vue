<template>
  <ApolloQuery
    :query="require('~/gql/manage/getCompetency.gql')"
    :update="(data) => data.competency"
    :variables="{ code: $route.params.code }"
  >
    <template #default="{ result: { error, data: competency }, isLoading }">
      <div v-if="isLoading" v-t="'global.loading'"></div>

      <div v-else-if="competency">
        <h2 v-text="competency.name"></h2>

        <v-row>
          <v-col cols="12" md="9">
            <v-tabs v-model="currentTab" show-arrows>
              <v-tab v-t="'competency.description'"></v-tab>
            </v-tabs>
            <v-card-text class="text--primary">
              <v-tabs-items v-model="currentTab">
                <v-tab-item>
                  <div
                    v-if="competency.description"
                    v-t="'competency.description'"
                  ></div>
                  <div v-else v-t="'global.description.no'"></div>
                </v-tab-item>
              </v-tabs-items>
            </v-card-text>
          </v-col>
          <v-col
            cols="12"
            md="3"
            :order="$vuetify.breakpoint.smAndDown ? 'first' : undefined"
          >
            <competency-info-panel v-if="competency" :competency="competency" />
          </v-col>
        </v-row>
      </div>

      <div v-else-if="error">An error occurred</div>
    </template>
  </ApolloQuery>
</template>

<script>
export default {
  name: 'ManageCompetencyPage',
  data() {
    return {
      currentTab: 'description',
    }
  },
  meta: {
    roles: ['teacher'],
  },
}
</script>

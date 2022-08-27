<!-- eslint-disable vue/no-v-html -->
<template>
  <ApolloQuery
    :query="require('~/gql/manage/getCompetency.gql')"
    :update="(data) => data.competency"
    :variables="{ code: $route.params.code }"
    @result="setTitle"
  >
    <template #default="{ result: { error, data: competency }, isLoading }">
      <div v-if="isLoading">{{ $t('global.loading') }}</div>

      <div v-else-if="competency">
        <h2>{{ title }}</h2>

        <v-row>
          <v-col cols="12" md="9">
            <v-card>
              <v-tabs v-model="currentTab" show-arrows>
                <v-tab>{{ $t('competency.description') }}</v-tab>
                <v-tab v-if="competency.learningOutcomes?.length">
                  {{ $t('competency.learning_outcomes._') }}
                </v-tab>
              </v-tabs>

              <v-card-text class="text--primary">
                <v-tabs-items v-model="currentTab">
                  <v-tab-item>
                    <div
                      v-if="competency.description"
                      v-html="competency.description"
                    />
                    <div v-else>{{ $t('global.description.no') }}</div>
                  </v-tab-item>

                  <v-tab-item v-if="competency.learningOutcomes?.length">
                    <v-list class="pa-0" dense>
                      <template
                        v-for="(
                          learningOutcome, i
                        ) in competency.learningOutcomes"
                      >
                        <v-list-item :key="2 * i">
                          <v-list-item-content>
                            <v-list-item-title>
                              {{ learningOutcome }}
                            </v-list-item-title>
                          </v-list-item-content>
                        </v-list-item>

                        <v-divider
                          v-if="i < competency.learningOutcomes.length - 1"
                          :key="2 * i + 1"
                        />
                      </template>
                    </v-list>
                  </v-tab-item>
                </v-tabs-items>
              </v-card-text>
            </v-card>
          </v-col>

          <v-col
            cols="12"
            md="3"
            :order="$vuetify.breakpoint.smAndDown ? 'first' : undefined"
          >
            <competency-info-panel :competency="competency" />

            <v-btn
              class="mt-5"
              color="success"
              small
              :to="{
                name: 'manage-competencies-code-edit',
                params: { code: competency.code },
              }"
            >
              <v-icon left>mdi-pencil</v-icon>
              <span>{{ $t('general.edit') }}</span>
            </v-btn>
          </v-col>
        </v-row>
      </div>

      <div v-else-if="error">{{ $t('error.unexpected') }}</div>
    </template>
  </ApolloQuery>
</template>

<script>
export default {
  name: 'ManageCompetencyPage',
  data() {
    return {
      currentTab: 0,
      title: '',
    }
  },
  head() {
    return {
      title: this.title,
    }
  },
  methods: {
    setTitle({ data: competency }) {
      this.title = competency?.name || ''
    },
  },
  meta: {
    roles: ['teacher'],
  },
}
</script>

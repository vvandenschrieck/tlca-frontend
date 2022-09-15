<!-- eslint-disable vue/no-v-html -->
<template>
  <ApolloQuery
    v-slot="{ result: { error, data: competency }, isLoading }"
    :query="require('~/gql/manage/getCompetency.gql')"
    :update="(data) => data.competency"
    :variables="{ code: courseCode }"
    @result="setTitle"
  >
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
                  <learning-outcomes-list
                    :items="competency.learningOutcomes"
                  />
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
        </v-col>
      </v-row>

      <actions-menu
        :edit-link="{
          name: 'manage-competencies-code-edit',
          params: { code: courseCode },
        }"
      />
    </div>

    <div v-else-if="error">{{ $t('error.unexpected') }}</div>
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
  computed: {
    courseCode() {
      return this.$route.params.code
    },
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

<template>
  <ApolloQuery
    v-slot="{ result: { error, data: program }, isLoading }"
    :query="require('~/gql/manage/getProgram.gql')"
    :update="(data) => data.program"
    :variables="{ code: programCode }"
    @result="setTitle"
  >
    <div v-if="isLoading">{{ $t('global.loading') }}</div>

    <div v-else-if="program && program.isCoordinator">
      <h2>{{ title }}</h2>

      <v-row>
        <v-col cols="12" md="9">
          <v-card>
            <v-tabs v-model="currentTab" show-arrows>
              <v-tab>{{ $tc('course.registrations._', 2) }}</v-tab>
            </v-tabs>

            <v-card-text class="text--primary">
              <v-tabs-items v-model="currentTab">
                <v-tab-item>
                  <registrations-list :code="programCode" entity="program" />
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
          <program-status-info-panel :program="program" />
        </v-col>
      </v-row>
    </div>

    <div v-else-if="error">{{ $t('error.unexpected') }}</div>
  </ApolloQuery>
</template>

<script>
export default {
  name: 'ManageProgramRegistrationsPage',
  data() {
    return {
      currentTab: 'registrations',
      title: '',
    }
  },
  head() {
    return {
      title: this.title + ' : ' + this.$tc('registration._', 2),
    }
  },
  computed: {
    programCode() {
      return this.$route.params.code
    },
  },
  methods: {
    setTitle({ data: program }) {
      this.title = program?.name ?? ''
    },
  },
  meta: {
    roles: ['teacher'],
  },
}
</script>

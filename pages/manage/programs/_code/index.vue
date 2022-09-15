<template>
  <ApolloQuery
    v-slot="{ result: { error, data: program }, isLoading }"
    :query="require('~/gql/manage/getProgram.gql')"
    :update="(data) => data.program"
    :variables="{ code: programCode }"
    @result="setTitle"
  >
    <div v-if="!!isLoading">{{ $t('global.loading') }}</div>

    <div v-else-if="program && program.isCoordinator">
      <h2>{{ title }}</h2>

      <v-row>
        <v-col cols="12" md="9">
          <v-row>
            <v-col cols="12" md="6">
              <v-btn
                :to="{
                  name: 'manage-programs-code-registrations',
                  params: { code: programCode },
                }"
              >
                Registrations
              </v-btn>
            </v-col>

            <v-col cols="12" md="6">
              <program-courses-info-card :program="program" />
            </v-col>
          </v-row>
        </v-col>

        <v-col
          cols="12"
          md="3"
          :order="$vuetify.breakpoint.smAndDown ? 'first' : undefined"
        >
          <program-status-info-panel :program="program" />
        </v-col>
      </v-row>

      <actions-menu
        :edit-link="{
          name: 'manage-programs-code-edit',
          params: { code: programCode },
        }"
      />
    </div>

    <div v-else-if="error">{{ $t('error.unexpected') }}</div>
  </ApolloQuery>
</template>

<script>
export default {
  name: 'ManageProgramPage',
  data() {
    return {
      title: '',
    }
  },
  head() {
    return {
      title: this.title,
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

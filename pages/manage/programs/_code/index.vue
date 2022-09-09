<template>
  <ApolloQuery
    v-slot="{ result: { error, data: program }, isLoading }"
    :query="require('~/gql/manage/getProgram.gql')"
    :update="(data) => data.program"
    :variables="{ code: $route.params.code }"
    @result="setTitle"
  >
    <div v-if="!!isLoading">{{ $t('global.loading') }}</div>

    <div v-else-if="program && program.isCoordinator">
      <h2>{{ title }}</h2>

      <v-row>
        <v-col cols="12" md="9">
          <v-row>
            <v-col cols="12" md="6">REGISTRATIONS</v-col>

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

          <v-btn
            class="mt-5"
            color="success"
            small
            :to="{
              name: 'manage-programs-code-edit',
              params: { code: program.code },
            }"
          >
            <v-icon left>mdi-pencil</v-icon>
            <span>{{ $t('general.edit') }}</span>
          </v-btn>
        </v-col>
      </v-row>
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
  methods: {
    setTitle({ data: program }) {
      this.title = program?.name || ''
    },
  },
  meta: {
    roles: ['teacher'],
  },
}
</script>

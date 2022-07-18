<template>
  <ApolloQuery
    :query="require('~/gql/manage/getPrograms.gql')"
    :update="(data) => data.programs"
  >
    <template #default="{ result: { error, data: programs }, isLoading }">
      <div v-if="isLoading || programs">
        <h2>{{ $tc('program._', 2) }}</h2>

        <v-row>
          <v-col cols="12" md="9">
            <card-list
              :component="component"
              link-prefix="manage-"
              :items="programs"
              :items-per-page="6"
              :cards-per-page="3"
              :prop-name="propName"
            />
          </v-col>
          <v-col
            cols="12"
            md="3"
            :order="$vuetify.breakpoint.smAndDown ? 'first' : undefined"
          >
            <p>Programs info panel</p>
          </v-col>
        </v-row>
      </div>

      <div v-else-if="error">An error occurred</div>
    </template>
  </ApolloQuery>
</template>

<script>
import ProgramCard from '~/components/cards/ProgramCard.vue'

export default {
  name: 'ManageProgramsPage',
  data() {
    return {
      propName: 'program',
      component: ProgramCard,
    }
  },
  meta: {
    roles: ['teacher'],
  },
}
</script>

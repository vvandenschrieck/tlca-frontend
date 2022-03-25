<template>
  <ApolloQuery :query="require('../gql/getHomePageData.gql')">
    <template #default="{ result: { error, data }, isLoading }">
      <div v-if="isLoading || data">
        <v-card flat color="grey lighten-2" class="mt-2">
          <v-card-title>{{ $t('homepage.welcome') }}</v-card-title>
          <v-card-text>
            <div v-html="$t('homepage.presentation')"></div>
          </v-card-text>
        </v-card>
        <v-tabs v-model="selectedPanel" centered show-arrows class="pt-5">
          <v-tab v-for="panel in panels" :key="panel.propName">
            {{ $tc(`${panel.propName}._`, 2) }}
          </v-tab>
        </v-tabs>

        <v-tabs-items v-model="selectedPanel" class="overflow-visible">
          <v-tab-item
            v-for="panel in panels"
            :key="panel.propName"
            class="pt-5"
          >
            <tab-list
              :component="panel.component"
              :items="data ? data[panel.propName + 's'] : undefined"
              :prop-name="panel.propName"
            />
          </v-tab-item>
        </v-tabs-items>
      </div>

      <div v-else-if="error">An error occurred</div>
    </template>
  </ApolloQuery>
</template>

<script>
import CourseCard from '~/components/cards/CourseCard.vue'
import ProgramCard from '~/components/cards/ProgramCard.vue'
import PartnerCard from '~/components/cards/PartnerCard.vue'

export default {
  name: 'IndexPage',
  data() {
    return {
      selectedPanel: 0,
      panels: [
        {
          component: CourseCard,
          propName: 'course',
        },
        {
          component: ProgramCard,
          propName: 'program',
        },
        {
          component: PartnerCard,
          propName: 'partner',
        },
      ],
    }
  },
  head() {
    return {
      title: this.$t('global.spaces.home'),
    }
  },
}
</script>

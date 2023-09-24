<!-- eslint-disable vue/no-v-html -->
<template>
  <ApolloQuery
    v-slot="{ result: { error } }"
    :query="require('~/gql/getHomePageData.gql')"
    @result="setItems"
  >
    <div v-if="!error">
      <v-card class="mt-2" color="grey lighten-3" flat>
        <v-card-title>{{ $t('homepage.welcome') }}</v-card-title>
        <v-card-text>
          <div v-html="$t('homepage.presentation')"></div>
        </v-card-text>
      </v-card>

      <v-tabs v-model="currentTab" centered class="pt-5" show-arrows>
        <v-tab v-for="{ name } in panels" :key="name" :href="`#${name}s`">
          {{ $tc(`${name}._`, 2) }}
        </v-tab>
      </v-tabs>

      <v-tabs-items v-model="currentTab" class="overflow-visible">
        <v-tab-item
          v-for="{ component, data, name } in panels"
          :key="name"
          class="pt-5"
          :value="`${name}s`"
        >
          <tab-list :component="component" :items="data" :prop-name="name" />
        </v-tab-item>
      </v-tabs-items>
    </div>

    <div v-else-if="error">{{ $t('error.unexpected') }}</div>
  </ApolloQuery>
</template>

<script>
import currentTab from '@/mixins/current-tab.js'

import CourseCard from '~/components/cards/CourseCard.vue'
import ProgramCard from '~/components/cards/ProgramCard.vue'
import PartnerCard from '~/components/cards/PartnerCard.vue'

export default {
  name: 'IndexPage',
  mixins: [currentTab],
  data() {
    return {
      panels: [
        {
          component: CourseCard,
          data: null,
          name: 'course',
        },
        {
          component: ProgramCard,
          data: null,
          name: 'program',
        },
        {
          component: PartnerCard,
          data: null,
          name: 'partner',
        },
      ],
    }
  },
  head() {
    return {
      title: this.$t('global.spaces.home'),
    }
  },
  methods: {
    setItems({ data }) {
      if (!data) {
        return
      }

      for (const item of this.panels) {
        item.data = data[`${item.name}s`]
      }
    },
  },
  meta: {
    roles: ['guest'],
  },
}
</script>

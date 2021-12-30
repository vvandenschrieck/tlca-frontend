<template>
  <div>
    <v-card flat color="grey lighten-2" class="mt-2">
      <v-card-title>{{ $t('homepage.welcome') }}</v-card-title>
      <v-card-text><div v-html="$t('homepage.presentation')"></div></v-card-text>
    </v-card>
    <v-tabs v-model="selectedPanel" centered class="pt-5">
      <v-tab v-for="panel in panels" :key="panel.name">{{ $tc(`${panel.name.slice(0, -1)}._`, 2) }}</v-tab>
    </v-tabs>
    <v-tabs-items v-model="selectedPanel">
      <v-tab-item v-for="panel in panels" :key="panel.name" class="pt-5">
        <tab-list :name="panel.name" :component="panel.component" :items="getPanelItems(panel.name)" />
      </v-tab-item>
    </v-tabs-items>
  </div>
</template>

<script>
import { gql } from 'graphql-tag';
import TabList from '~/components/homepage/TabList.vue';
import CourseCard from '~/components/cards/CourseCard.vue';
import ProgramCard from '~/components/cards/ProgramCard.vue';
import PartnerCard from '~/components/cards/PartnerCard.vue';

export default {
  name: 'IndexPage',
  components: { TabList },
  apollo: {
    courses: gql`query {
      courses(limit: 4) {
        banner
        code
        name
        type
      }
    }`,
    programs: gql`query {
      programs(limit: 4) {
        code
        name
      }
    }`,
    partners: gql`query {
      partners(limit: 4) {
        abbreviation
        banner
        code
        name
      }
    }`
  },
  data() {
    return {
      selectedPanel: 0,
      panels: [{
        name: 'courses',
        component: {
          name: CourseCard,
          propName: 'course'
        }
      }, {
        name: 'programs',
        component: {
          name: ProgramCard,
          propName: 'program'
        }
      }, {
        name: 'partners',
        component: {
          name: PartnerCard,
          propName: 'partner'
        }
      }]
    }
  },
  methods: {
    getPanelItems(name) {
      return this[name];
    }
  }
}
</script>

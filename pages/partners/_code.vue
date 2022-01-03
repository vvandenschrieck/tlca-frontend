<template>
  <div v-if="partner">
    <v-card flat color="grey lighten-3" class="my-2">
      <v-breadcrumbs divider="/" :items="navItems" class="py-2"></v-breadcrumbs>
    </v-card>
    <h2>{{ partner.name }}</h2>
    <v-row>
      <v-col cols="12" md="9">
        <div v-html="partner.description"></div>
        <h3>{{ $tc('course._', 2) }}</h3>
        <card-list :name="name" :component="component" :items="partner.courses || []" :items-per-page="8" :cards-per-page="3" />
      </v-col>
      <v-col cols="12" md="3" :order="$vuetify.breakpoint.smAndDown ? 'first' : undefined">
        <info-panel :title="$t('global.information')" icon="mdi-information" :items="infoItems" />
      </v-col>
    </v-row>
  </div>
</template>

<script>
import { gql } from 'graphql-tag';
import CourseCard from '~/components/cards/CourseCard.vue';

export default {
  name: 'PartnerPage',
  data() {
    return {
      name: 'courses',
      component: {
        name: CourseCard,
        propName: 'course'
      }
    };
  },
  computed: {
    infoItems() {
      const items = [];
      if (this.partner.website) {
        items.push({
          icon: 'mdi-web',
          text: this.partner.website,
          tooltip: this.$t('partner.website')
        });
      }
      if (this.partner.abbreviation) {
        items.push({
          icon: 'mdi-domain',
          text: this.partner.abbreviation,
          tooltip: this.$t('partner.abbreviation')
        });
      }
      return items;
    },
    navItems() {
      return [{
        text: this.$tc('global.spaces.home'),
        exact: true,
        to: { name: 'index' }
      }, {
        text: this.$tc('partner._', 2),
        exact: true,
        to: { name: 'partners' }
      }, {
        text: this.partner.abbreviation ?? this.partner.name
      }];
    }
  },
  apollo: {
    partner: {
      query: gql`query Partner($code: String!) {
        partner(code: $code) {
          abbreviation
          code
          courses {
            banner
            code
            name
            type
          }
          description
          name
          website
        }
      }`,
      variables() {
        return {
          code: this.$route.params.code
        };
      }
    }
  }
}
</script>

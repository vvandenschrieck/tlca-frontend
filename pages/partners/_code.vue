<template>
  <ApolloQuery
    :query="require('../../gql/getPartner.gql')"
    :variables="{ code: $route.params.code }"
  >
    <template #default="{ result: { loading, error, data } }">
      <div v-if="loading">Loading...</div>

      <div v-else-if="error">An error occurred</div>

      <div v-else-if="data">
        <v-card flat color="grey lighten-3" class="my-2">
          <v-breadcrumbs
            divider="/"
            :items="navItems(data.partner)"
            class="py-2"
          ></v-breadcrumbs>
        </v-card>

        <h2>{{ data.partner.name }}</h2>

        <v-row>
          <v-col cols="12" md="9">
            <div>
              <div v-html="data.partner.description"></div>
            </div>
            <h3>{{ $tc('course._', 2) }}</h3>
            <card-list
              :name="name"
              :component="component"
              :items="data.partner.courses || []"
              :items-per-page="8"
              :cards-per-page="3"
            />
          </v-col>
          <v-col
            cols="12"
            md="3"
            :order="$vuetify.breakpoint.smAndDown ? 'first' : undefined"
          >
            <info-panel
              :title="$t('global.information')"
              icon="mdi-information"
              :items="infoItems(data.partner)"
            />
            <v-card flat class="mt-6 px-2">
              <v-img
                v-if="data.partner.logo"
                :src="data.partner.logo"
                contain
              />
            </v-card>
          </v-col>
        </v-row>
      </div>
    </template>
  </ApolloQuery>
</template>

<script>
import CourseCard from '~/components/cards/CourseCard.vue'

export default {
  name: 'PartnerPage',
  data() {
    return {
      name: 'courses',
      component: {
        name: CourseCard,
        propName: 'course',
      },
    }
  },
  methods: {
    infoItems(partner) {
      const items = []
      if (partner.website) {
        items.push({
          icon: 'mdi-web',
          text: partner.website,
          tooltip: this.$t('partner.website'),
        })
      }
      if (partner.abbreviation) {
        items.push({
          icon: 'mdi-domain',
          text: partner.abbreviation,
          tooltip: this.$t('partner.abbreviation'),
        })
      }
      return items
    },
    navItems(partner) {
      return [
        {
          text: this.$tc('global.spaces.home'),
          exact: true,
          to: { name: 'index' },
        },
        {
          text: this.$tc('partner._', 2),
          exact: true,
          to: { name: 'partners' },
        },
        {
          text: partner.abbreviation ?? partner.name,
        },
      ]
    },
  },
}
</script>

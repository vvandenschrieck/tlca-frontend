<template>
  <ApolloQuery
    :query="require('../../gql/getPartner.gql')"
    :update="updatePartner"
    :variables="{ code: $route.params.code }"
  >
    <template #default="{ result: { error, data: partner }, isLoading }">
      <div v-if="isLoading" v-t="'global.loading'"></div>

      <div v-else-if="partner">
        <bread-crumb :items="homespaceNavItems('partner', partner.abbreviation || partner.name)" />

        <h2>{{ partner.name }}</h2>

        <v-row>
          <v-col cols="12" md="9">
            <div>
              <div v-html="partner.description"></div>
            </div>

            <h3>{{ $tc('course._', 2) }}</h3>

            <card-list
              :cards-per-page="3"
              :component="component"
              :items="partner.courses || []"
              :items-per-page="8"
              :prop-name="propName"
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
              :items="partner.infoItems"
            />
            <v-card flat class="mt-6 px-2">
              <v-img
                v-if="partner.logo"
                :src="partner.logo"
                contain
              />
            </v-card>
          </v-col>
        </v-row>
      </div>

      <div v-else-if="error">An error occurred</div>
    </template>
  </ApolloQuery>
</template>

<script>
import CourseCard from '~/components/cards/CourseCard.vue'
import breadcrumb from '@/mixins/breadcrumb.js'
import infopanel from '@/mixins/infopanel.js'

export default {
  name: 'PartnerPage',
  mixins: [breadcrumb, infopanel],
  data() {
    return {
      component: CourseCard,
      infoItemFields: {
        website: 'mdi-web',
        abbreviation: 'mdi-domain',
        tags: 'mdi-tag-multiple',
      },
      propName: 'course'
    }
  },
  methods: {
    updatePartner(data) {
      const partner = data.partner
      partner.infoItems = this.infoItems('partner', partner, this.infoItemFields)
      return partner
    },
  },
}
</script>

<template>
  <ApolloQuery
    :query="require('../../gql/getPartner.gql')"
    :update="(data) => data.partner"
    :variables="{ code: $route.params.code }"
    @result="setTitle"
  >
    <template #default="{ result: { error, data: partner }, isLoading }">
      <div v-if="isLoading" v-t="'global.loading'"></div>

      <div v-else-if="partner">
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
              class="mt-3"
            />
          </v-col>
          <v-col
            cols="12"
            md="3"
            :order="$vuetify.breakpoint.smAndDown ? 'first' : undefined"
          >
            <partner-info-panel :partner="partner" />

            <v-card flat class="mt-5 px-4">
              <v-img v-if="partner.logo" :src="partner.logo" contain />
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

export default {
  name: 'PartnerPage',
  data() {
    return {
      component: CourseCard,
      propName: 'course',
      title: '',
    }
  },
  head() {
    return {
      title: this.title,
    }
  },
  methods: {
    setTitle({ data: partner }) {
      this.title = partner.abbreviation || partner.name
    },
  },
  meta: {
    roles: ['guest'],
  },
}
</script>

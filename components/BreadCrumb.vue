<template>
  <v-card flat color="grey lighten-3" class="my-2">
    <v-breadcrumbs divider="/" :items="newItems" class="py-2"></v-breadcrumbs>
  </v-card>
</template>

<script>
import getPartners from '../gql/getPartner.gql'
export default {
  name: 'BreadCrumb',
  props: {
    primaryTitle: {
      type: String,
      default: null,
    },
    secondaryTitle: {
      type: String,
      default: null,
    },
  },
  data() {
    return {
      items: [],
      breadCrumbTitles: {
        async 'partners-code'() {
          const partner = await this.$apollo
            .query({ query: getPartners, variables: { code: this.$route.params.code } })
            .then(({ data }) => data.partner)
          return () => partner.abbreviation || partner.name
        },
        partners() {
          return () => this.$tc('partner._', 2)
        },
        courses() {
          return () => this.$tc('course._', 2)
        },
        programs() {
          return () => this.$tc('program._', 2)
        },
      }
    }
  },
  computed: {
    newItems() {
      return this.items.map(i => ({ ...i, text: i.text.apply?.(this) }))
    }
  },
  async mounted() {
    const parts = this.$route.fullPath.slice(1).split('/')
    const isHomeSpace = !['admin', 'learn', 'manage', 'teach'].includes(
      parts[0]
    )

    let items = parts.reduce(
      (acc, part, i) => [
        ...acc,
        {
          text: () => part,
          exact: true,
          to: `${acc.at(-1)?.to ?? ''}/${part}`,
        },
      ],
      []
    ).map(async (i) => ({
      ...i,
      comp: this.$router.resolve(i.to),
      text: (await this.breadCrumbTitles[this.$router
        .resolve(i.to).route.name]?.apply(this)) || i.text
    }))
    items = await Promise.all(items)

    // Add a first item if the page is in the home space.
    if (isHomeSpace) {
      items.unshift({
        text: () => this.$tc('global.spaces.home'),
        exact: true,
        to: '/',
      })
    }
    this.items = items
  },
}
</script>

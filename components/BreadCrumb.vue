<template>
  <v-card flat color="grey lighten-3" class="my-2">
    <v-breadcrumbs divider="/" :items="newItems" class="py-2"></v-breadcrumbs>
  </v-card>
</template>

<script>
import getPartners from '~/gql/getPartner.gql'

export default {
  name: 'BreadCrumb',
  data() {
    return {
      items: [],
      partTitles: {
        admin: () => this.$t('global.spaces.admin'),
        assessments: () => this.$tc('assessment._', 2),
        competencies: () => this.$tc('competency._', 2),
        courses: () => this.$tc('course._', 2),
        create: () => this.$t('general.create'),
        edit: () => this.$t('general.edit'),
        learn: () => this.$t('global.spaces.learn'),
        manage: () => this.$t('global.spaces.manage'),
        partners: () => this.$tc('partner._', 2),
        programs: () => this.$tc('program._', 2),
        teach: () => this.$tc('global.spaces.teach', 2),
        users: () => this.$tc('user._', 2),
      },
      breadCrumbTitles: {
        async 'partners-code'() {
          const partner = await this.$apollo
            .query({
              query: getPartners,
              variables: { code: this.$route.params.code },
            })
            .then(({ data }) => data.partner)
          return () => partner.abbreviation || partner.name
        },
      },
    }
  },
  computed: {
    newItems() {
      return this.items.map((i) => ({ ...i, text: i.text.apply?.(this) }))
    },
  },
  watch: {
    $route: {
      handler: 'generateBreadCrumb',
      immediate: true,
    },
  },
  methods: {
    async getText(item) {
      const routeName = this.$router.resolve(item.to).route.name

      if (routeName in this.breadCrumbTitles) {
        return await this.breadCrumbTitles[routeName].apply(this)
      }
      if (item.part in this.partTitles) {
        return this.partTitles[item.part]
      }
      return () => item.part
    },
    async generateBreadCrumb() {
      const parts = this.$route.fullPath.slice(1).split('/')
      const isHomeSpace = !['admin', 'learn', 'manage', 'teach'].includes(
        parts[0]
      )

      const items = await Promise.all(
        parts
          .reduce(
            (acc, part) => [
              ...acc,
              {
                part,
                exact: true,
                to: `${acc.at(-1)?.to ?? ''}/${part}`,
              },
            ],
            []
          )
          .map(async (i) => ({
            ...i,
            text: await this.getText(i),
          }))
      )

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
  },
}
</script>

<template>
  <v-card flat class="my-2" color="grey lighten-3">
    <v-breadcrumbs class="py-2" divider="/" :items="newItems" />
  </v-card>
</template>

<script>
import getAssessment from '@/gql/breadcrumb/getAssessment.gql'
import getPartner from '@/gql/breadcrumb/getPartner.gql'

export default {
  name: 'BreadCrumb',
  data() {
    return {
      items: [],
      partTitles: {
        admin: () => this.$t('global.spaces.admin'),
        assessments: () => this.$tc('assessment._', 2),
        calendar: () => this.$t('calendar._'),
        competencies: () => this.$tc('competency._', 2),
        courses: () => this.$tc('course._', 2),
        create: () => this.$t('general.create'),
        dashboard: () => this.$t('general.dashboard'),
        edit: () => this.$t('general.edit'),
        evaluations: () => this.$tc('evaluation._', 2),
        groups: () => this.$tc('course.groups._', 2),
        learn: () => this.$t('global.spaces.learn'),
        learners: () => this.$tc('learner._', 2),
        manage: () => this.$t('global.spaces.manage'),
        partners: () => this.$tc('partner._', 2),
        programs: () => this.$tc('program._', 2),
        registrations: () => this.$tc('registration._', 2),
        teach: () => this.$tc('global.spaces.teach', 2),
        users: () => this.$tc('user._', 2),
      },
      breadCrumbTitles: {
        async 'assessments-id'() {
          const assessment = await this.$apollo
            .query({
              query: getAssessment,
              variables: { id: this.$route.params.id },
            })
            .then(({ data }) => data.assessment)
          return () => assessment.code ?? assessment.name
        },
        async 'partners-code'() {
          const partner = await this.$apollo
            .query({
              query: getPartner,
              variables: { code: this.$route.params.code },
            })
            .then(({ data }) => data.partner)
          return () => partner.abbreviation ?? partner.name
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

      // Compute text specific to the page and entry, based on a GraphQL query.
      const suffixName = Object.keys(this.breadCrumbTitles).find((r) =>
        routeName.endsWith(r)
      )
      if (suffixName) {
        return await this.breadCrumbTitles[suffixName].apply(this)
      }

      // Use a text from the mapping table.
      if (item.part in this.partTitles) {
        return this.partTitles[item.part]
      }

      // Just use the name of the part.
      return () => item.part
    },
    async generateBreadCrumb() {
      const parts = decodeURI(this.$route.fullPath).slice(1).split('/')
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

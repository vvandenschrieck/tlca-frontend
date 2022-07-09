<template>
  <v-card flat color="grey lighten-3" class="my-2">
    <v-breadcrumbs divider="/" :items="items" class="py-2"></v-breadcrumbs>
  </v-card>
</template>

<script>
function singularise(name) {
  switch (name) {
    case 'competencies':
      return 'competency'

    default:
      return name.slice(0, -1)
  }
}

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
  computed: {
    items() {
      const parts = this.$route.fullPath.slice(1).split('/')
      const isHomeSpace = !['admin', 'learn', 'manage', 'teach'].includes(
        parts[0]
      )

      const items = parts.reduce(
        (acc, part, i) => [
          ...acc,
          {
            text: this.getText(parts, i, isHomeSpace),
            exact: true,
            to: `${acc.at(-1)?.to ?? ''}/${part}`,
          },
        ],
        []
      )

      items.forEach(async (i) => {
        this.$set(
          i,
          'text',
          (await this.$router
            .getMatchedComponents(i.to)[0]
            .options?.head?.(this)) || i.text
        )
      })

      // Add a first item if the page is in the home space.
      if (isHomeSpace) {
        items.unshift({
          text: this.$tc('global.spaces.home'),
          exact: true,
          to: '/',
        })
      }

      return items
    },
  },
  methods: {
    getText(parts, i, isHomeSpace) {
      const check = isHomeSpace ? i + 1 : i

      switch (check) {
        case 0:
          return this.$tc(`global.spaces.${parts[0]}`)
        case 1:
        case 3:
          return parts.length >= i
            ? this.$tc(`${singularise(parts[i])}._`, 2)
            : null
        case 2:
          return this.primaryTitle
        case 4:
          return this.secondaryTitle
      }

      return null
    },
  },
}
</script>

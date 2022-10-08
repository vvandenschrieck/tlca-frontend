<template>
  <ApolloQuery
    v-slot="{ isLoading, result: { error } }"
    :query="require('~/gql/infopanels/getCompetencyInfo.gql')"
    :update="(data) => data.competency"
    :variables="{ code: competencyCode }"
    @result="setItems"
  >
    <generic-info-panel
      icon="mdi-information"
      :items="items"
      :loading="!!isLoading"
      :title="$t('general.information._')"
    >
      <v-card-text v-if="error">{{ $t('error.unexpected') }}</v-card-text>
    </generic-info-panel>
  </ApolloQuery>
</template>

<script>
import datetime from '@/mixins/datetime.js'

export default {
  name: 'CompetencyInfoPanel',
  mixins: [datetime],
  props: {
    competencyCode: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      items: [],
    }
  },
  methods: {
    setItems({ data: competency }) {
      if (!competency) {
        return []
      }

      const items = []

      // Competency status.
      if (competency.isArchived) {
        items.push({
          icon: 'mdi-cloud-upload',
          text: this.$t('competency.status.archived_on', {
            date: this.formatDateFull(competency.archived),
          }),
          tooltip: this.$t('competency.status._'),
        })
      }

      // Competency type.
      const type = competency.type
      if (type) {
        items.push({
          icon: 'mdi-format-list-bulleted',
          text: this.$t(`competency.type.${type.toLowerCase()}`),
          tooltip: this.$t('competency.type._'),
        })
      }

      // Competency visibility.
      const isPublic = competency.isPublic
      items.push({
        icon: 'mdi-eye',
        text: this.$t(
          `competency.visibility.${isPublic ? 'public' : 'private'}`
        ),
        tooltip: this.$t('competency.visibility._'),
      })

      // Competency partners.
      const partners = competency.partners
      if (partners?.length) {
        items.push({
          icon: 'mdi-domain',
          text: partners.map((p) => p.abbreviation ?? p.name).join(', '),
          tooltip: this.$tc('competency.partners', partners.length),
        })
      }

      // Competency tags.
      const tags = competency.tags
      if (tags?.length) {
        items.push({
          icon: 'mdi-tag-multiple',
          text: tags.join(', '),
          tooltip: this.$tc('competency.tags', tags.length),
        })
      }

      // Competency creator.
      const coordinator = competency.user
      if (coordinator) {
        items.push({
          icon: 'mdi-account',
          text: coordinator.displayName,
          tooltip: this.$t('competency.coordinator'),
        })
      }

      this.items = items
    },
  },
}
</script>

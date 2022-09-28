<template>
  <ApolloQuery
    v-slot="{ isLoading, result: { error } }"
    :query="require('~/gql/infopanels/getCourseInfo.gql')"
    :update="(data) => data.course"
    :variables="{ code: courseCode }"
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
export default {
  name: 'CourseInfoPanel',
  props: {
    courseCode: {
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
    setItems({ data: course }) {
      if (!course) {
        return []
      }

      const items = []

      // Course span
      const span = course.span
      if (span) {
        items.push({
          icon: 'mdi-calendar',
          text: this.$tc('course.span.in_weeks', span, { weeks: span }),
          tooltip: this.$t('course.span._'),
        })
      }

      // Course load
      const load = course.load
      if (load) {
        const ects = load.ects
        if (ects) {
          items.push({
            icon: 'mdi-account-clock',
            text: this.$t('course.load.in_credits', { credits: ects }),
            tooltip: this.$t('course.load.ects'),
          })
        }

        if (load.type) {
          let loadDetail = null

          switch (load.type) {
            case 'WEEKLY': {
              const weekload = load.weekload
              if (weekload) {
                loadDetail = this.$t('course.load.in_hours_per_week', {
                  hoursPerWeek: weekload,
                })
              }
              break
            }

            case 'THEO_PRAC': {
              const theory = load.theory
              const practice = load.practice
              if (theory && practice) {
                loadDetail = this.$t('course.load.in_theory_practice_hours', {
                  theoryHours: theory,
                  practiceHours: practice,
                })
              }
              break
            }
          }

          if (loadDetail) {
            items.push({
              icon: 'mdi-clock',
              text: loadDetail,
              tooltip: this.$t('course.load._'),
            })
          }
        }
      }

      // Course partners
      const partners = course.partners
      if (partners?.length) {
        items.push({
          icon: 'mdi-domain',
          text: partners.map((p) => p.abbreviation || p.name).join(', '),
          tooltip: this.$tc('partner._', partners.length),
        })
      }

      // Course field
      const field = course.field
      if (field) {
        items.push({
          icon: 'mdi-school',
          text: field,
          tooltip: this.$t('course.field'),
        })
      }

      // Course tags
      const tags = course.tags
      if (tags?.length) {
        items.push({
          icon: 'mdi-tag-multiple',
          text: tags.join(', '),
          tooltip: this.$tc('course.tags', tags.length),
        })
      }

      // Course language
      const language = course.language
      if (language) {
        items.push({
          icon: 'mdi-translate',
          text: language,
          tooltip: this.$t('course.language'),
        })
      }

      // Course team
      const team = course.team
      if (team?.length) {
        items.push({
          icon: 'mdi-account-group',
          text: team.map((t) => t.displayName).join(', '),
          tooltip: this.$t('course.team'),
        })
      }

      this.items = items
    },
  },
}
</script>

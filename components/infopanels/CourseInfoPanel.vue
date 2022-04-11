<template>
  <generic-info-panel
    :title="$t('global.information')"
    icon="mdi-information"
    :items="items"
  />
</template>

<script>
export default {
  name: 'CourseInfoPanel',
  props: {
    course: {
      type: Object,
      required: true,
    },
  },
  computed: {
    items() {
      const items = []

      // Course span
      const span = this.course.span
      if (span) {
        items.push({
          icon: 'mdi-calendar',
          text: this.$tc('course.span.in_weeks', span, { weeks: span }),
          tooltip: this.$t('course.span._'),
        })
      }

      // Course load
      const load = this.course.load
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
      const partners = this.course.partners
      if (partners?.length) {
        items.push({
          icon: 'mdi-domain',
          text: partners.map((p) => p.abbreviation || p.name).join(', '),
          tooltip: this.$tc('partner._', 2),
        })
      }

      // Course field
      const field = this.course.field
      if (field) {
        items.push({
          icon: 'mdi-school',
          text: field,
          tooltip: this.$t('course.field'),
        })
      }

      // Course tags
      const tags = this.course.tags
      if (tags?.length) {
        items.push({
          icon: 'mdi-tag-multiple',
          text: tags.join(', '),
          tooltip: this.$t('course.tags'),
        })
      }

      // Course language
      const language = this.course.language
      if (language) {
        items.push({
          icon: 'mdi-translate',
          text: language,
          tooltip: this.$t('course.language'),
        })
      }

      // Course team
      const team = this.course.team
      if (team?.length) {
        items.push({
          icon: 'mdi-account-group',
          text: team.map((t) => t.displayName).join(', '),
          tooltip: this.$t('course.team'),
        })
      }

      return items
    },
  },
}
</script>

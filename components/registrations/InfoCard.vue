<template>
  <ApolloQuery
    v-slot="{ isLoading, result: { error } }"
    :query="require('~/gql/cards/getRegistrationsInfo.gql')"
    :variables="{ courseCode }"
    @result="setResult"
  >
    <generic-info-card
      icon="mdi-account-school"
      :link="link"
      :loading="!!isLoading"
      :title="$tc('registration._', 2)"
    >
      <stats-list v-if="!error" entity="registration" :items="stats" />
      <span v-else>{{ $t('error.unexpected') }}</span>
    </generic-info-card>
  </ApolloQuery>
</template>

<script>
import { DateTime } from 'luxon'

import courses from '@/mixins/courses.js'
import datetime from '@/mixins/datetime.js'

export default {
  name: 'RegistrationsInfoCard',
  mixins: [courses, datetime],
  props: {
    courseCode: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      course: null,
      registrations: null,
    }
  },
  computed: {
    link() {
      return {
        icon: 'mdi-view-list',
        text: this.$t('general.list'),
        to: {
          name: 'manage-courses-code-registrations',
          params: { code: this.courseCode },
        },
      }
    },
    stats() {
      if (!this.course || !this.registrations) {
        return null
      }

      const items = [
        {
          text: this.$tc('registration._', 2),
          filter: (r) => !r.invitation,
        },
        {
          text: this.$t('registration.invitation.request.received'),
          filter: (r) => r.invitation === 'REQUESTED',
        },
        {
          text: this.$t('registration.invitation.sent._'),
          filter: (r) => r.invitation === 'SENT',
        },
      ]

      // Compute the registrations stats.
      const stats = items.map((i) => ({
        ...i,
        value: this.registrations.filter(i.filter).length,
      }))

      // Check the oldest invitation request, if any.
      const types = ['request', 'sent']
      for (const [i, type] of types.entries()) {
        if (stats[i + 1].value > 0) {
          const oldest = this.registrations
            .filter(stats[i + 1].filter)
            .map((r) => DateTime.fromISO(r.datetime))
            .sort((a, b) => a - b)[0]

          const days = Math.trunc(
            DateTime.now().diff(oldest, 'days').values.days
          )
          if (days > 10) {
            stats[i + 1].alert = this.$t(
              `registration.invitation.${type}.too_old`,
              { days }
            )
          }
        }
      }

      // Insert the status of registrations.
      stats.unshift({
        chip: true,
        text: this.$t('general.status'),
        ...this.status,
      })

      return stats
    },
    status() {
      const {
        registrationsStart,
        registrationsEnd,
        start,
        end,
        evaluationsEnd,
      } = this.schedule(this.course)

      // Cannot yet register for now, registrations are upcoming.
      if (
        this.isInFuture(registrationsStart) ||
        (!registrationsStart && this.isInFuture(start))
      ) {
        return {
          color: '',
          value: this.$t('registration.upcoming'),
        }
      }

      // Cannot register any more, registrations are closed.
      if (
        this.isInPast(registrationsEnd) ||
        (!registrationsEnd && this.isInPast(evaluationsEnd)) ||
        (!evaluationsEnd && this.isInPast(end))
      ) {
        return {
          color: 'error',
          value: this.$t('registration.closed'),
        }
      }

      // Can register for now, registrations are open.
      return {
        color: 'success',
        value: this.$t('registration.open'),
      }
    },
  },
  methods: {
    setResult({ data }) {
      if (!data) {
        return
      }

      this.course = data.course
      this.registrations = data.registrations
    },
  },
}
</script>

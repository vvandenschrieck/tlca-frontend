<template>
  <generic-info-card
    icon="mdi-account-group"
    :link="{
      icon: 'mdi-view-list',
      text: $t('general.list'),
      to: {
        name: 'manage-courses-code-registrations',
        params: { code: course.code },
      },
    }"
    :title="$tc('registration._', 2)"
  >
    <div v-if="course.registrations?.length">
      <v-simple-table dense>
        <tbody>
          <tr>
            <td class="pa-0 text-center"></td>
            <td class="pl-2">{{ $t('general.status') }}</td>
            <td class="text-center">
              <v-chip :color="status.color" small>{{ status.value }}</v-chip>
            </td>
          </tr>

          <tr v-for="(stat, i) in stats" :key="i">
            <td class="pl-1 pr-0 text-center">
              <v-tooltip v-if="stat.alert" bottom>
                <template #activator="{ on, attrs }">
                  <v-icon color="red" small v-bind="attrs" v-on="on">
                    mdi-alert
                  </v-icon>
                </template>

                <span>{{ stat.alert }}</span>
              </v-tooltip>
            </td>
            <td class="pl-2">{{ stat.text }}</td>
            <td class="text-center">{{ stat.value }}</td>
          </tr>
        </tbody>
      </v-simple-table>
    </div>

    <span v-else>{{ $t('registration.no') }}</span>
  </generic-info-card>
</template>

<script>
import { DateTime } from 'luxon'
import datetime from '@/mixins/datetime.js'

export default {
  name: 'RegistrationsInfoCard',
  mixins: [datetime],
  props: {
    course: {
      type: Object,
      required: true,
    },
  },
  computed: {
    schedule() {
      const schedule = {}
      if (this.course.schedule?.length) {
        this.course.schedule.forEach((e) => {
          schedule[e.name] = DateTime.fromISO(e.datetime)
        })
      }
      return schedule
    },
    stats() {
      const items = [
        {
          text: this.$tc('registration._', 2),
          filter: (r) => !r.invite,
        },
        {
          text: this.$t('registration.invitation.request.received'),
          filter: (r) => r.invite === 'REQUESTED',
        },
        {
          text: this.$t('registration.invitation.sent._'),
          filter: (r) => r.invite === 'SENT',
        },
      ]

      // Compute the registrations stats.
      const stats = items.map((i) => ({
        ...i,
        value: this.course.registrations.filter(i.filter)?.length,
      }))

      // Check the oldest invitation request, if any.
      const types = {
        1: 'request',
        2: 'sent',
      }
      for (const i of [1, 2]) {
        if (stats[i].value) {
          const oldest = this.course.registrations
            .filter(stats[i].filter)
            .map((r) => DateTime.fromISO(r.date))
            .sort((a, b) => a - b)[0]

          const days = Math.trunc(
            DateTime.now().diff(oldest, 'days').values.days
          )
          if (days > 10) {
            stats[i].alert = this.$t(
              `registration.invitation.${types[i]}.too_old`,
              { days }
            )
          }
        }
      }

      return stats
    },
    status() {
      const {
        registrationsStart,
        registrationsEnd,
        start,
        end,
        evaluationsEnd,
      } = this.schedule

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
}
</script>

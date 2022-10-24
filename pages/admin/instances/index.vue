<template>
  <ApolloQuery
    v-slot="{ isLoading, result: { error } }"
    :query="require('~/gql/admin/getInstances.gql')"
    :update="(data) => data.assessmentInstances"
    @result="setResult"
  >
    <page-title :loading="!!isLoading" :value="title" />

    <v-data-table
      v-if="!error"
      class="elevation-1"
      :headers="headers"
      :items="instances"
      :items-per-page="15"
      :loading="!!isLoading"
    >
      <template #item.assessment="{ value: assessment }">
        {{ assessmentName(assessment) }}
      </template>

      <template #item.learner="{ value: learner }">
        {{ learner.displayName }}
      </template>

      <template #item.actions="{ item: { id } }">
        <instance-delete-btn
          :instance-id="id"
          @error="onInstanceDeleteFailed"
          @success="() => onInstanceDeleted(id)"
        />
      </template>
    </v-data-table>

    <div v-else>{{ $t('error.unexpected') }}</div>
  </ApolloQuery>
</template>

<script>
import assessments from '@/mixins/assessments.js'
import datetime from '@/mixins/datetime.js'
import titles from '@/mixins/titles.js'

import getInstances from '@/gql/admin/getInstances.gql'

export default {
  name: 'AdminInstancesPage',
  mixins: [assessments, datetime, titles],
  data() {
    return {
      instances: [],
    }
  },
  head() {
    return {
      title: this.getTitle(this.title, null, 'admin'),
    }
  },
  computed: {
    headers() {
      return [
        { text: this.$tc('assessment._', 1), value: 'assessment' },
        { text: this.$tc('learner._', 1), value: 'learner' },
        { text: this.$t('global.date'), value: 'datetime' },
        { text: this.$t('evaluation.nb_of'), value: 'nbEvaluations' },
        {
          cellClass: 'text-right',
          class: 'text-right',
          sortable: false,
          text: this.$tc('general.action', 2),
          value: 'actions',
        },
      ]
    },
    title() {
      return this.$tc('instance._', 2)
    },
  },
  methods: {
    onInstanceDeleted(id) {
      const { defaultClient: apolloClient } = this.$apolloProvider
      const data = apolloClient.readQuery({ query: getInstances })
      const i = data.assessmentInstances.findIndex((i) => i.id === id)
      apolloClient.writeQuery({
        query: getInstances,
        data: {
          assessmentInstances: [
            ...data.assessmentInstances.slice(0, i),
            ...data.assessmentInstances.slice(i + 1),
          ],
        },
      })

      this.$notificationManager.displaySuccessMessage(
        this.$t('success.INSTANCE_DELETE')
      )
    },
    onInstanceDeleteFailed() {
      this.$notificationManager.displayErrorMessage(
        this.$t('error.INSTANCE_DELETE')
      )
    },
    setResult({ data: instances }) {
      this.instances =
        instances?.map((i) => ({
          ...i,
          datetime: this.formatDateTimeFull(i.datetime),
        })) ?? []
    },
  },
  meta: {
    roles: ['admin'],
  },
}
</script>

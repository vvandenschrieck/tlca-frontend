<template>
  <generic-info-panel
    icon="mdi-information"
    :items="items"
    :title="$t('general.information._')"
  >
    <div v-if="$auth.user" class="text-center">
      <evaluation-publish-btn :evaluation="evaluation" @success="published" />
    </div>
  </generic-info-panel>
</template>

<script>
import datetime from '@/mixins/datetime.js'

export default {
  name: 'EvaluationStatusInfoPanel',
  mixins: [datetime],
  props: {
    evaluation: {
      type: Object,
      required: true,
    },
  },
  computed: {
    items() {
      const items = []

      const status = {
        icon: 'mdi-cloud-upload',
        tooltip: this.$t('evaluation.status._'),
      }
      switch (this.evaluation.status) {
        case 'UNPUBLISHED':
          status.text = this.$t('evaluation.status.unpublished')
          break

        case 'PUBLISHED':
          status.text = this.$t('evaluation.status.published_on', {
            date: this.formatDateFull(this.evaluation.published),
          })
          break
      }
      items.push(status)

      return items
    },
  },
  methods: {
    published() {
      this.$notificationManager.displaySuccessMessage(
        this.$t('success.EVALUATION_PUBLISHED')
      )
    },
  },
}
</script>

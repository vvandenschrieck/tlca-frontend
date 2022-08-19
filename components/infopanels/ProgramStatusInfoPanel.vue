<template>
  <generic-info-panel
    icon="mdi-information"
    :items="items"
    :title="$t('general.information._')"
  >
    <div v-if="$auth.user" class="text-center">
      <program-publish-btn :program="program" @success="published" />
    </div>
  </generic-info-panel>
</template>

<script>
import datetime from '@/mixins/datetime.js'

export default {
  name: 'ProgramStatusInfoPanel',
  mixins: [datetime],
  props: {
    program: {
      type: Object,
      required: true,
    },
  },
  computed: {
    items() {
      const items = []

      // Program status.
      const status = {
        icon: 'mdi-cloud-upload',
        tooltip: this.$t('program.status._'),
      }
      switch (this.program.status) {
        case 'UNPUBLISHED':
          status.text = this.$t('program.status.unpublished')
          break

        case 'PUBLISHED':
          status.text = this.$t('program.status.published_on', {
            date: this.formatDateFull(this.program.published),
          })
          break

        case 'ARCHIVED':
          status.text = this.$t('program.status.archived_on', {
            date: this.formatDateFull(this.program.archived),
          })
          break
      }
      items.push(status)

      // Program visibility.
      const visibility = this.program.visibility.toLowerCase()
      items.push({
        icon: 'mdi-eye',
        text: this.$t(`program.visibility.${visibility}`),
        tooltip: this.$t('program.visibility._'),
      })

      return items
    },
  },
  methods: {
    published() {
      this.$notificationManager.displaySuccessMessage(
        this.$t('success.PROGRAM_PUBLISHED')
      )
    },
  },
}
</script>

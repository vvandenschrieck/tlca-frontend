<template>
  <div>
    <generic-info-panel
      v-if="registration"
      :title="$t('registration.progress')"
      icon="mdi-progress-check"
    >
      <div class="d-flex justify-space-around mt-3">
        <competencies-progress
          :label="$t('competency.category.basic')"
          :value="registration.progress.basic"
        />
        <competencies-progress
          :label="$t('competency.category.advanced')"
          :value="registration.progress.advanced"
        />
      </div>
    </generic-info-panel>

    <v-skeleton-loader v-if="loading" type="image" />
  </div>
</template>

<script>
export default {
  name: 'ProgressPanel',
  props: {
    loading: {
      type: Boolean,
      default: false,
    },
    registration: {
      type: Object,
      default: null,
    },
  },
}
</script>

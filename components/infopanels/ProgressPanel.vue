<template>
  <generic-info-panel
    :title="$t('registration.progress')"
    icon="mdi-progress-check"
    :loading="loading"
  >
    <div v-if="registration" class="d-flex justify-space-around mt-3">
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

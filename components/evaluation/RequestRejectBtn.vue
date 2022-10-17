<template>
  <v-dialog
    v-model="dialog"
    :fullscreen="$vuetify.breakpoint.xsOnly"
    max-width="420"
    :persistent="loading"
  >
    <template #activator="{ on, attrs }">
      <v-btn
        color="error"
        :disabled="disabled"
        :loading="loading"
        text
        v-bind="attrs"
        v-on="on"
      >
        {{ $t('general.reject') }}
      </v-btn>
    </template>

    <v-card>
      <v-card-title class="text-h5">
        {{ $t('evaluation.request.reject._') }}
      </v-card-title>

      <v-card-text>
        {{ $t('evaluation.request.reject.dialog_instructions') }}
        <v-textarea v-model="reason" filled />
      </v-card-text>

      <v-card-actions>
        <v-spacer />

        <cancel-btn :disabled="loading" @click="cancel" />
        <reject-btn
          :disabled="loading || !reason"
          :loading="loading"
          @click="reject"
        />
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: 'EvaluationRequestRejectBtn',
  props: {
    disabled: {
      type: Boolean,
      default: false,
    },
    loading: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      dialog: false,
      reason: '',
    }
  },
  methods: {
    cancel() {
      this.dialog = false
    },
    reject() {
      this.dialog = false
      this.$emit('reject', this.reason)
    },
  },
}
</script>

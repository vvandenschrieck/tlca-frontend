<template>
  <v-dialog
    v-model="dialog"
    :fullscreen="$vuetify.breakpoint.xsOnly"
    max-width="480"
    :persistent="loading"
  >
    <template #activator="{ on, attrs }">
      <v-btn
        color="success"
        :disabled="disabled"
        :loading="loading"
        text
        v-bind="attrs"
        v-on="on"
      >
        {{ $t('general.accept') }}
      </v-btn>
    </template>

    <v-card>
      <v-card-title class="text-h5">
        {{ $t('evaluation.request.accept._') }}
      </v-card-title>

      <v-card-text>
        {{ $t('evaluation.request.accept.dialog_instructions') }}
        <v-textarea v-model="comment" filled />
      </v-card-text>

      <v-card-actions>
        <v-spacer />

        <cancel-btn :disabled="loading" @click="cancel" />
        <accept-btn :disabled="loading" :loading="loading" @click="accept" />
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: 'EvaluationRequestAcceptBtn',
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
      comment: '',
      dialog: false,
    }
  },
  methods: {
    accept() {
      this.dialog = false
      this.$emit('accept', this.comment)
    },
    cancel() {
      this.dialog = false
    },
  },
}
</script>

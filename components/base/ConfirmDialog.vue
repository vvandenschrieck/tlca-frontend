<template>
  <v-dialog
    v-model="dialog"
    :fullscreen="$vuetify.breakpoint.xsOnly"
    max-width="290"
    :persistent="loading"
  >
    <template #activator="{ on, attrs }">
      <slot :attrs="attrs" :on="on" />
    </template>

    <v-card>
      <v-card-title class="text-h5">{{ title }}</v-card-title>
      <v-card-text>{{ text }}</v-card-text>

      <v-card-actions>
        <v-spacer />

        <cancel-btn :disabled="loading" @click="cancel" />
        <v-btn :disabled="loading" :loading="loading" text @click="confirm">
          {{ action }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: 'ConfirmDialog',
  props: {
    action: {
      type: String,
      required: true,
    },
    loading: {
      type: Boolean,
      default: false,
    },
    text: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      dialog: false,
    }
  },
  computed: {
    title() {
      return this.$t('general.confirmation')
    },
  },
  methods: {
    cancel() {
      this.dialog = false
    },
    close() {
      this.dialog = false
    },
    confirm() {
      return this.$emit('confirm')
    },
  },
}
</script>

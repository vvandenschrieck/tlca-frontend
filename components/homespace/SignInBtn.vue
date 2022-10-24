<template>
  <v-dialog
    v-model="dialog"
    :fullscreen="$vuetify.breakpoint.xsOnly"
    max-width="500"
    :persistent="formBusy"
  >
    <template #activator="{ on, attrs }">
      <v-tooltip bottom open-delay="500">
        <template #activator="{ on: tooltip }">
          <v-btn icon small v-bind="attrs" v-on="{ ...on, ...tooltip }">
            <v-icon>mdi-login</v-icon>
          </v-btn>
        </template>
        <span>{{ $t('authentication.sign_in') }}</span>
      </v-tooltip>
    </template>

    <form-sign-in ref="form" v-model="formBusy" @reset="closeDialog" />
  </v-dialog>
</template>

<script>
export default {
  name: 'SignInBtn',
  data() {
    return {
      dialog: false,
      formBusy: false,
    }
  },
  watch: {
    dialog(value) {
      if (!value) {
        this.$refs.form.reset()
      }
    },
  },
  methods: {
    closeDialog() {
      this.dialog = false
    },
  },
}
</script>

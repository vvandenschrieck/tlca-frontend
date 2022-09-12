<template>
  <div>
    <v-speed-dial
      v-if="showActionsMenu"
      v-model="fab"
      class="fab"
      fixed
      :bottom="true"
      direction="top"
      :right="true"
      transition="slide-y-reverse-transition"
    >
      <template #activator>
        <v-btn v-model="fab" color="blue darken-2" dark fab>
          <v-icon v-if="fab">mdi-close</v-icon>
          <v-icon v-else>mdi-arrow-top-right-bold-box-outline</v-icon>
        </v-btn>
      </template>

      <v-btn
        v-if="editLink"
        color="green"
        dark
        fab
        small
        @click.stop="goToEditPage"
      >
        <v-icon>mdi-pencil</v-icon>
      </v-btn>

      <v-btn
        v-if="createLink"
        color="green"
        dark
        fab
        small
        @click.stop="goToCreatePage"
      >
        <v-icon>mdi-plus</v-icon>
      </v-btn>

      <v-btn
        v-if="deleteAction"
        color="red"
        dark
        fab
        small
        @click.stop="showDeleteDialog"
      >
        <v-icon>mdi-delete</v-icon>
      </v-btn>
    </v-speed-dial>

    <!-- Delete confirmation dialog -->
    <v-dialog
      v-if="deleteAction"
      v-model="dialog"
      :fullscreen="$vuetify.breakpoint.xsOnly"
      max-width="290"
      :persistent="loading"
    >
      <v-card>
        <v-card-title class="text-h5">
          {{ $t('general.confirmation') }}
        </v-card-title>

        <v-card-text>
          {{ $t(`${deleteAction.object}.delete.dialog_instructions`) }}
        </v-card-text>

        <v-card-actions>
          <v-spacer />

          <v-btn :disabled="loading" text @click="cancelDelete">
            {{ $t('general.cancel') }}
          </v-btn>

          <v-btn
            :disabled="loading"
            :loading="loading"
            text
            @click="deleteObject"
          >
            {{ $t('general.delete') }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
export default {
  name: 'ActionsMenu',
  props: {
    createLink: {
      type: Object,
      default: null,
    },
    deleteAction: {
      type: Object,
      default: null,
    },
    editLink: {
      type: Object,
      default: null,
    },
  },
  data() {
    return {
      dialog: false,
      fab: false,
      loading: false,
    }
  },
  computed: {
    showActionsMenu() {
      return !!this.createLink || !!this.deleteAction || !!this.editLink
    },
  },
  methods: {
    cancelDelete() {
      this.dialog = false
    },
    async deleteObject() {
      this.loading = true

      const { object } = this.deleteAction
      const { mutation, variables } = this.deleteAction.query
      const query = object.charAt(0).toUpperCase() + object.slice(1)

      try {
        const response = await this.$apollo
          .mutate({
            mutation,
            variables,
          })
          .then(({ data }) => data && data[`delete${query}`])

        if (response) {
          this.dialog = false
          this.$router.push(this.deleteAction.link)

          this.$notificationManager.displaySuccessMessage(
            this.$t(`success.${query.toUpperCase()}_DELETE`)
          )
        }
      } catch (err) {
        this.$notificationManager.displayErrorMessage(
          this.$t(`error.${query.toUpperCase()}_DELETE`)
        )
      }

      this.loading = false
    },
    goToCreatePage() {
      this.$router.push(this.createLink)
    },
    goToEditPage() {
      this.$router.push(this.editLink)
    },
    showDeleteDialog() {
      this.dialog = true
    },
  },
}
</script>

<style scoped>
.fab {
  margin-bottom: 50px;
}
</style>

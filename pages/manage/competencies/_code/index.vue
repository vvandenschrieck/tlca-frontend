<template>
  <ApolloQuery
    v-slot="{ isLoading, result: { data: competency, error } }"
    :query="require('~/gql/manage/getCompetency.gql')"
    :update="(data) => data.competency"
    :variables="{ code: competencyCode }"
    @result="setCompetency"
  >
    <page-title :loading="!!isLoading" :value="title" />

    <v-row v-if="!error">
      <v-col cols="12" md="9">
        <v-card>
          <v-tabs v-model="currentTab" show-arrows>
            <v-tab v-if="showDescription">
              {{ $t('competency.description') }}
            </v-tab>
            <v-tab v-if="showLearningOutcomes">
              {{ $t('competency.learning_outcomes._') }}
            </v-tab>
          </v-tabs>

          <v-card-text class="text--primary">
            <v-tabs-items v-model="currentTab">
              <v-tab-item v-if="showDescription">
                <description-content :text="competency.description" />
              </v-tab-item>

              <v-tab-item v-if="showLearningOutcomes">
                <learning-outcomes-list :items="competency.learningOutcomes" />
              </v-tab-item>
            </v-tabs-items>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col
        cols="12"
        md="3"
        :order="$vuetify.breakpoint.smAndDown ? 'first' : undefined"
      >
        <competency-info-panel :competency-code="competencyCode" />
      </v-col>

      <actions-menu
        v-if="competency"
        :custom-action="customAction(competency)"
        :edit-link="{
          name: 'manage-competencies-code-edit',
          params: { code: competencyCode },
        }"
        @customActionClicked="showArchiveDialog"
      />

      <!-- Archive confirmation dialog -->
      <!-- TODO:: refactor to a dedicated yes/no dialog component -->
      <v-dialog
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
            {{ $t('competency.archive.dialog_instructions') }}
          </v-card-text>

          <v-card-actions>
            <v-spacer />

            <v-btn :disabled="loading" text @click="cancelArchive">
              {{ $t('general.cancel') }}
            </v-btn>

            <v-btn
              :disabled="loading"
              :loading="loading"
              text
              @click="archiveCompetency"
            >
              {{ $t('competency.archive._') }}
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-row>

    <div v-else>{{ $t('error.unexpected') }}</div>
  </ApolloQuery>
</template>

<script>
import titles from '@/mixins/titles.js'

export default {
  name: 'ManageCompetencyPage',
  mixins: [titles],
  data() {
    return {
      currentTab: 0,
      dialog: false,
      loading: false,
      showDescription: false,
      showLearningOutcomes: false,
      title: '',
    }
  },
  head() {
    return {
      title: this.getTitle(this.title, null, 'manage'),
    }
  },
  computed: {
    competencyCode() {
      return this.$route.params.code
    },
  },
  methods: {
    async archiveCompetency() {
      this.loading = true

      const data = {
        code: this.competencyCode,
      }
      const mutation = require(`~/gql/manage/archiveCompetency.gql`)

      try {
        const response = await this.$apollo
          .mutate({
            mutation,
            variables: data,
          })
          .then(({ data }) => data && data.archiveCompetency)

        if (response) {
          this.dialog = false

          this.$notificationManager.displaySuccessMessage(
            this.$t(`success.COMPETENCY_ARCHIVE`)
          )
        }
      } catch (err) {
        if (!err.graphQLErrors) {
          this.$notificationManager.displayErrorMessage(
            this.$t(`error.COMPETENCY_ARCHIVE`)
          )
        }
      }

      this.loading = false
    },
    cancelArchive() {
      this.dialog = false
    },
    customAction(competency) {
      if (competency.isArchived || !competency.isOwner) {
        return null
      }

      return {
        icon: 'mdi-archive',
      }
    },
    setCompetency({ data: competency }) {
      this.title = competency?.name ?? ''

      this.showDescription =
        competency &&
        (competency.description ||
          !competency.learningOutcomes ||
          !competency.learningOutcomes.length)
      this.showLearningOutcomes = competency?.learningOutcomes?.length > 0
    },
    showArchiveDialog() {
      this.dialog = true
    },
  },
  meta: {
    roles: ['teacher'],
  },
}
</script>

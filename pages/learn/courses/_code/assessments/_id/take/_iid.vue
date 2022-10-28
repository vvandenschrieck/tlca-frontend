<template>
  <ApolloQuery
    v-slot="{ isLoading, result: { error } }"
    :query="require('~/gql/learn/getTake.gql')"
    :variables="{ courseCode, assessmentId, instanceId }"
    @result="setResult"
  >
    <page-title :loading="!!isLoading" :value="title" />

    <v-row v-if="!error && canShowContent">
      <v-col cols="12" md="9">
        <v-progress-linear v-if="!!isLoading" :indeterminate="true" />

        <v-form
          v-if="assessment && instance"
          :disabled="formBusy || isTimeUp"
          @submit.prevent="submit"
        >
          <v-card>
            <template v-if="assessment.provider === 'tfq' && answer">
              <v-card-title>Vrai ou faux</v-card-title>
              <v-card-text class="text--primary">
                <template v-for="(block, i) of instance.content.questions">
                  <div :key="i">
                    <h4 class="mt-5">Question {{ i + 1 }}</h4>

                    <i>Compétence visée : {{ block.targetedCompetency }}</i>

                    <v-list class="pa-0" dense>
                      <template v-for="(question, j) of block.items">
                        <v-list-item :key="2 * j" class="line" dense>
                          <v-list-item-content class="pa-0">
                            <v-list-item-title>
                              <v-checkbox
                                v-model="answer[i][j]"
                                class="checkbox ml-1"
                                dense
                                hide-details
                              >
                                <span
                                  slot="label"
                                  class="checkbox-label text-body-2"
                                >
                                  {{ question }}
                                </span>
                              </v-checkbox>
                            </v-list-item-title>
                          </v-list-item-content>
                        </v-list-item>

                        <v-divider
                          v-if="j < block.length - 1"
                          :key="2 * j + 1"
                        />
                      </template>
                    </v-list>
                  </div>
                </template>
              </v-card-text>
            </template>
          </v-card>

          <div v-if="!isTimeUp" class="text-right mt-5">
            <submit-btn action="send" :loading="formBusy" />
          </div>
        </v-form>

        <v-dialog
          v-model="dialog"
          :fullscreen="$vuetify.breakpoint.xsOnly"
          max-width="290"
          :persistent="formBusy"
        >
          <v-card>
            <v-card-title class="text-h5">
              {{ $t('general.confirmation') }}
            </v-card-title>

            <v-card-text>
              {{ $t('assessment.take.send.dialog_instructions') }}
            </v-card-text>

            <v-card-actions>
              <v-spacer />

              <v-btn :disabled="formBusy" text @click="cancelSubmit">
                {{ $t('general.cancel') }}
              </v-btn>

              <v-btn
                :disabled="formBusy"
                :loading="formBusy"
                text
                @click="finish"
              >
                {{ $t('general.send') }}
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-col>

      <v-col
        cols="12"
        md="3"
        :order="$vuetify.breakpoint.smAndDown ? 'first' : undefined"
      >
        <timer-info-panel
          v-if="instance?.content?.deadline"
          :deadline="instance.content.deadline"
          @timeup="() => (isTimeUp = true)"
        />

        <div v-show="autoSaving" class="mt-5 text-center">
          <v-progress-circular
            indeterminate
            color="primary"
            size="16"
          />&nbsp;Saving...
        </div>
      </v-col>
    </v-row>

    <div v-else>{{ $t('error.unexpected') }}</div>
  </ApolloQuery>
</template>

<script>
import competencies from '@/mixins/competencies.js'
import datetime from '@/mixins/datetime.js'
import titles from '@/mixins/titles.js'

export default {
  name: 'LearnCourseAssessmentTakePage',
  mixins: [competencies, datetime, titles],
  data() {
    return {
      assessment: null,
      autoSaving: false,
      course: null,
      dialog: false,
      evaluations: null,
      formBusy: false,
      instance: null,
      isTimeUp: false,
      title: '',
      answer: null,
    }
  },
  head() {
    return {
      title: this.getTitle(this.title, null, 'learn'),
    }
  },
  computed: {
    assessmentId() {
      return this.$route.params.id
    },
    canShowContent() {
      return !this.course || this.course.isRegistered
    },
    courseCode() {
      return this.$route.params.code
    },
    instanceId() {
      return this.$route.params.iid
    },
  },
  mounted() {
    setInterval(this.autosave, 60000)
  },
  methods: {
    async autosave() {
      this.autoSaving = true
      await this.save()
      this.autoSaving = false
    },
    cancelSubmit() {
      this.dialog = false
    },
    async finish() {
      this.formBusy = true

      try {
        const response = await this.save(true)
        if (response) {
          this.$router.push({
            name: 'learn-courses-code-evaluations-id',
            params: { code: this.courseCode, id: response.id },
          })
          this.$notificationManager.displaySuccessMessage(
            this.$t('success.TAKE_SEND')
          )
        }
      } catch (err) {}

      this.formBusy = false
    },
    initialiseTfq() {
      const content = this.instance.content

      content.questions.forEach((q) => {
        const competency = this.assessment.competencies.find(
          (c) => c.competency.code === q.competency
        )
        q.targetedCompetency = this.competencyName(competency.competency)
      })

      if (!this.answer) {
        this.answer = Array.from({ length: content.questions.length }, (_, i) =>
          Array.from({ length: content.questions[i].items.length }, (_, j) =>
            this.evaluations && this.evaluations[0]
              ? this.evaluations[0].data.answer[i][j]
              : false
          )
        )
      }
    },
    setResult({ data }) {
      if (!data) {
        return
      }

      this.assessment = data.assessment
      this.course = data.course
      this.evaluations = data.evaluations
      this.instance = data.assessmentInstance
      this.title = data.assessment?.name ?? ''

      // Initialise answers according to provider type.
      if (this.assessment && this.instance) {
        switch (this.assessment.provider) {
          case 'tfq':
            this.initialiseTfq()
            break
        }
      }
    },
    async save(finalise = false) {
      if (this.isTimeUp) {
        return
      }

      const data = {
        answer: this.answer,
        finalise,
        id: this.instanceId,
      }
      const mutation = require(`~/gql/learn/saveAssessmentTake.gql`)
      const response = await this.$apollo
        .mutate({
          mutation,
          variables: data,
        })
        .then(({ data }) => data && data.saveAssessmentTake)

      return response
    },
    submit() {
      this.dialog = true
    },
  },
  meta: {
    roles: ['student'],
  },
}
</script>

<style scoped>
.checkbox:deep(.v-input--selection-controls__input) {
  align-self: baseline;
}
.checkbox-label {
  text-align: justify;
  white-space: normal;
}
.line {
  min-height: 30px;
}
</style>

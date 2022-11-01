<template>
  <ApolloQuery
    v-slot="{ isLoading, result: { error } }"
    :query="require('~/gql/provider/tfq/getEvaluation.gql')"
    :update="(data) => data.evaluation"
    :variables="{ evaluationId, teacherView }"
    @result="setResult"
  >
    <v-card :loading="!!isLoading" flat>
      <v-card-title v-if="!hideTitle">{{ title }}</v-card-title>

      <v-card-text class="text--primary">
        <template v-if="!error">
          <div v-for="(block, i) of content?.questions ?? []" :key="i">
            <h4 class="mt-5">{{ questionTitle(i + 1) }}</h4>

            <i>{{ targetedCompetency(block.competency) }}</i>

            <v-list class="pa-0" dense>
              <template v-for="(question, j) of block.items">
                <v-list-item :key="2 * j" class="line" dense>
                  <v-list-item-content class="pa-0">
                    <v-list-item-title>
                      <v-checkbox
                        class="checkbox ml-1"
                        dense
                        hide-details
                        readonly
                        :ripple="false"
                        :input-value="question.selected"
                      >
                        <div
                          slot="label"
                          class="checkbox-label text-body-2"
                          style="width: 100%"
                        >
                          {{ question.question }}

                          <v-alert
                            v-if="!hideFeedback && question.feedback"
                            class="mt-2 text-body-2"
                            dense
                            outlined
                            :type="question.correct ? 'success' : 'error'"
                          >
                            {{
                              question.correct
                                ? question.feedback.correct
                                : question.feedback.wrong
                            }}
                          </v-alert>
                        </div>

                        <span
                          v-if="'correct' in question || teacherView"
                          slot="append"
                        >
                          <v-icon
                            v-if="
                              question.correct ||
                              (teacherView &&
                                question.selected === question.answer)
                            "
                            color="success"
                          >
                            mdi-check-bold
                          </v-icon>
                          <v-icon v-else color="error">mdi-close-thick</v-icon>
                        </span>
                      </v-checkbox>
                    </v-list-item-title>
                  </v-list-item-content>
                </v-list-item>

                <v-divider v-if="j < block.length - 1" :key="2 * j + 1" />
              </template>
            </v-list>
          </div>
        </template>
        <div v-else>{{ $t('error.unexpected') }}</div>
      </v-card-text>
    </v-card>
  </ApolloQuery>
</template>

<script>
import competencies from '@/mixins/competencies.js'

export default {
  name: 'TfqView',
  mixins: [competencies],
  props: {
    evaluationId: {
      type: String,
      required: true,
    },
    hideFeedback: {
      type: Boolean,
      default: false,
    },
    hideTitle: {
      type: Boolean,
      default: false,
    },
    teacherView: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      evaluation: null,

      config: null,
      content: null,
      title: null,
    }
  },
  methods: {
    buildContent(evaluation) {
      const { assessment, data, instance } = evaluation

      // Build the content depending on the role (student or teacher).
      const content = !this.config
        ? {
            ...instance.content,
            questions: instance.content.questions.map((q) => ({
              ...q,
              items: q.items.map((item) => ({
                question: item,
              })),
            })),
          }
        : {
            ...instance.data,
            questions: instance.data.questions.map((q, i) => ({
              competency: this.config.questions[i].competency,
              items: q.select.map((item, j) => ({
                ...this.config.questions[i].pool[item],
              })),
            })),
          }

      // Fill in the content with several additional fields.
      return {
        ...content,
        questions: content.questions.map((q, i) => ({
          ...q,
          items: q.items.map((item, j) => ({
            ...item,
            ...(data.answers ? data.answers[i][j] : {}),
            selected: data?.answer ? data.answer[i][j] : undefined,
          })),
          competency: this.competencyName(
            assessment.competencies.find(
              (c) => c.competency.code === q.competency
            ).competency
          ),
        })),
      }
    },
    questionTitle(i) {
      return this.$t('provider.tfq.question', { i })
    },
    setResult({ data: evaluation }) {
      if (!evaluation) {
        return
      }

      this.evaluation = evaluation

      this.config = evaluation.assessment.providerConfig
      this.content = this.buildContent(evaluation)
      this.title = this.$t(`provider.${evaluation.assessment.provider}._`)
    },
    targetedCompetency(name) {
      return this.$t('provider.tfq.targeted_competency', { name })
    },
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

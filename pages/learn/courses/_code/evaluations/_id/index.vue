<template>
  <ApolloQuery
    v-slot="{ isLoading, result: { error } }"
    :query="require('~/gql/learn/getEvaluation.gql')"
    :variables="{ courseCode, evaluationId }"
    @result="setResult"
  >
    <page-title :loading="!!isLoading" :value="title" />

    <v-row v-if="!error && canShowContent">
      <v-col cols="12" md="9">
        <v-card>
          <v-tabs v-model="currentTab" show-arrows>
            <v-tab>{{ $tc('evaluation._', 1) }}</v-tab>
            <v-tab>{{ $t('general.history') }}</v-tab>
          </v-tabs>

          <v-card-text class="text--primary">
            <v-tabs-items v-model="currentTab">
              <v-tab-item>
                <div v-if="showCompetencies">
                  <h4>{{ $tc('competency._', 2) }}</h4>

                  <assessment-competencies-list
                    v-if="evaluation"
                    :assessment-id="evaluation.assessment.id"
                    :course-code="courseCode"
                    :selected="evaluation.competencies"
                    student-view
                  />
                </div>

                <div v-if="showComment">
                  <h4>{{ $t('evaluation.comment._') }}</h4>

                  <description-content
                    entity="evaluation.comment"
                    :text="evaluation?.comment"
                  />
                </div>

                <div v-if="showRejectionReason">
                  <h4>{{ $t('evaluation.rejectionReason') }}</h4>

                  <description-content :text="evaluation?.rejectionReason" />
                </div>

                <div v-if="showExplanation">
                  <h4>{{ $t('evaluation.explanation._') }}</h4>

                  <description-content
                    entity="evaluation.explanation"
                    :text="evaluation?.explanation"
                  />
                </div>

                <div v-if="showData">
                  <h4>{{ $t('evaluation.answer.mine') }}</h4>

                  <template v-if="assessment?.provider === 'tfq'">
                    <template v-for="(block, i) of instance?.content.questions">
                      <div :key="i">
                        <h4 class="mt-5">Question {{ i + 1 }}</h4>

                        <i>Compétence visée : {{ block.targetedCompetency }}</i>

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
                                    :input-value="evaluation?.data.answer[i][j]"
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
                  </template>
                </div>
              </v-tab-item>

              <v-tab-item>
                <v-alert type="info" dense outlined>Upcoming feature</v-alert>
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
        <evaluation-info-panel :evaluation-id="evaluationId" hide-learner />
      </v-col>
    </v-row>

    <div v-else>{{ $t('error.unexpected') }}</div>
  </ApolloQuery>
</template>

<script>
import titles from '@/mixins/titles.js'

export default {
  name: 'LearnEvaluationPage',
  mixins: [titles],
  data() {
    return {
      assessment: null,
      course: null,
      currentTab: 0,
      evaluation: null,
      instance: null,
      title: '',
    }
  },
  head() {
    return {
      title: this.getTitle(this.title, null, 'learn'),
    }
  },
  computed: {
    canShowContent() {
      return !this.course || this.course.isRegistered
    },
    courseCode() {
      return this.$route.params.code
    },
    evaluationId() {
      return this.$route.params.id
    },
    hasProvider() {
      return this.assessment?.provider
    },
    showComment() {
      return this.evaluation?.status === 'PUBLISHED'
    },
    showCompetencies() {
      return !this.hasProvider || this.evaluation?.status === 'PUBLISHED'
    },
    showData() {
      return this.hasProvider
    },
    showExplanation() {
      return (
        !this.hasProvider &&
        ['ACCEPTED', 'REJECTED', 'REQUESTED'].includes(this.evaluation?.status)
      )
    },
    showRejectionReason() {
      return this.evaluation?.status === 'REJECTED'
    },
  },
  methods: {
    setResult({ data }) {
      if (!data) {
        return
      }

      this.assessment = data.evaluation?.assessment
      this.course = data.course
      this.evaluation = data.evaluation
      this.instance = data.evaluation?.instance
      this.title = data.evaluation?.assessment.name ?? ''
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

<!-- eslint-disable vue/no-v-html -->
<template>
  <ApolloQuery
    v-slot="{ isLoading, result: { data, error } }"
    :query="require('~/gql/learn/getCourseAssessmentTake.gql')"
    :variables="{
      courseCode,
      assessmentId: $route.params.id,
      assessmentInstanceId: $route.params.uid,
    }"
    @result="
      (data) => {
        setTitle(data)
        initialiseProvider(data)
      }
    "
  >
    <h2>{{ title }}</h2>

    <v-row v-if="!error">
      <v-col cols="12" md="9">
        <v-progress-linear v-if="!!isLoading" :indeterminate="true" />

        <v-card v-if="data?.assessment && data?.assessmentInstance">
          <template v-if="data?.assessment.provider === 'tfq' && answer">
            <v-card-title>Vrai ou faux</v-card-title>
            <v-card-text class="text--primary">
              <template
                v-for="(block, i) of data?.assessmentInstance.content.questions"
              >
                <div :key="i">
                  <h4 class="mt-5">Question {{ i + 1 }}</h4>

                  <v-list class="pa-0" dense>
                    <template v-for="(question, j) of block">
                      <v-list-item :key="2 * j">
                        <v-list-item-content>
                          <v-list-item-title>{{ question }}</v-list-item-title>
                        </v-list-item-content>

                        <v-list-item-action>
                          <v-switch v-model="answer[i][j]" dense>
                            <span slot="label" class="text-subtitle-2 ml-2">
                              {{ answer[i][j] ? 'Vrai' : 'Faux' }}
                            </span>
                          </v-switch>
                        </v-list-item-action>
                      </v-list-item>

                      <v-divider v-if="j < block.length - 1" :key="2 * j + 1" />
                    </template>
                  </v-list>
                </div>
              </template>
            </v-card-text>
          </template>
        </v-card>
      </v-col>

      <v-col
        cols="12"
        md="3"
        :order="$vuetify.breakpoint.smAndDown ? 'first' : undefined"
      >
        <assessment-schedule-panel
          :loading="!!isLoading"
          :schedule="schedule(data?.assessment)"
        />
      </v-col>
    </v-row>

    <div v-else>{{ $t('error.unexpected') }}</div>
  </ApolloQuery>
</template>

<script>
export default {
  name: 'LearnCourseAssessmentPage',
  data() {
    return {
      title: '',
      answer: null,
    }
  },
  head() {
    return {
      title: this.title + ' | ' + this.$t('global.spaces.learn'),
    }
  },
  computed: {
    courseCode() {
      return this.$route.params.code
    },
  },
  methods: {
    initialiseProvider({ data }) {
      switch (data?.assessment.provider) {
        case 'tfq':
          this.answer = Array.from(
            { length: data?.assessmentInstance.content.questions.length },
            (_, i) =>
              Array.from(
                {
                  length: data?.assessmentInstance.content.questions[i].length,
                },
                () => false
              )
          )
          break
      }
    },
    setTitle({ data }) {
      this.title = data?.assessment?.name ?? ''
    },
  },
  meta: {
    roles: ['student'],
  },
}
</script>

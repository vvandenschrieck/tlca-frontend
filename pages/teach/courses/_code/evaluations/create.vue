<template>
  <div>
    <page-title :value="title" />

    <v-row>
      <v-col cols="12" md="9">
        <form-evaluation
          :course-code="courseCode"
          @assessmentSelected="(value) => (assessmentId = value)"
        />
      </v-col>

      <v-col
        cols="12"
        md="3"
        :order="$vuetify.breakpoint.smAndDown ? 'first' : undefined"
      >
        <assessment-info-panel
          v-if="assessmentId"
          class="mb-5"
          :assessment-id="assessmentId"
        />
        <course-schedule-panel :course-code="courseCode" />
      </v-col>
    </v-row>
  </div>
</template>

<script>
import titles from '@/mixins/titles.js'

export default {
  name: 'TeachCreateEvaluationPage',
  mixins: [titles],
  data() {
    return {
      assessmentId: null,
    }
  },
  head() {
    return {
      title: this.getTitle(this.title, null, 'teach'),
    }
  },
  computed: {
    courseCode() {
      return this.$route.params.code
    },
    title() {
      return this.$t('evaluation.create')
    },
  },
  meta: {
    roles: ['teacher'],
  },
}
</script>

<!-- eslint-disable vue/no-v-html -->
<template>
  <ApolloQuery
    :query="require('../../gql/getProgram.gql')"
    :update="(data) => data.program"
    :variables="{ code: programCode }"
  >
    <template #default="{ result: { error, data: program }, isLoading }">
      <div v-if="isLoading" v-t="'global.loading'"></div>

      <div v-else-if="program">
        <h2>{{ program.name }}</h2>

        <v-row>
          <v-col cols="12" md="9">
            <div>
              <div v-html="program.description"></div>
            </div>

            <h3>{{ $tc('course._', 2) }}</h3>

            <card-list
              :cards-per-page="3"
              :component="component"
              :items="courses(program) || []"
              :items-per-page="8"
              :prop-name="propName"
              class="mt-3"
            />
          </v-col>
          <v-col
            cols="12"
            md="3"
            :order="$vuetify.breakpoint.smAndDown ? 'first' : undefined"
          >
            <registration-info-panel
              v-if="$auth.user"
              :code="programCode"
              entity="program"
              :visibility="program.visibility"
              class="mb-5"
            />

            <program-info-panel :program="program" />
          </v-col>
        </v-row>
      </div>

      <div v-else-if="error">An error occurred</div>
    </template>
  </ApolloQuery>
</template>

<script>
import CourseCard from '~/components/cards/CourseCard.vue'

export default {
  name: 'ProgramPage',
  data() {
    return {
      component: CourseCard,
      propName: 'course',
    }
  },
  computed: {
    programCode() {
      return this.$route.params.code
    },
  },
  methods: {
    courses(program) {
      return program.courses.map((c) => c.course)
    },
  },
  meta: {
    roles: ['guest'],
  },
}
</script>

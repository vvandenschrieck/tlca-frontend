<template>
  <ApolloQuery
    v-slot="{ isLoading, result: { data: coursesList, error } }"
    :query="require('~/gql/manage/getCourses.gql')"
    :update="(data) => data.courses"
  >
    <ValidationProvider
      v-if="!isLoading && coursesList"
      v-slot="{ errors }"
      :vid="$attrs.vid"
    >
      <div v-if="courses.length > 0">
        <v-row>
          <v-col
            v-for="(header, i) in headers"
            :key="i"
            cols="12"
            :md="header.size"
          >
            <b>{{ header.title }}</b>
          </v-col>
        </v-row>

        <v-row v-for="(course, index) in courses" :key="index">
          <v-col cols="12" md="10">
            <v-autocomplete-with-validation
              v-model="course.course"
              dense
              :item-text="({ code, name }) => code + ' – ' + name"
              item-value="code"
              :items="coursesList"
              required
              rules="required"
              :vid="`course-${index}`"
            >
              <template #item="{ item: { code, name } }">
                <b>{{ code }}</b>
                &nbsp;–&nbsp;{{ name }}
              </template>
            </v-autocomplete-with-validation>
          </v-col>

          <v-col cols="12" md="1" class="text-center">
            <v-simple-checkbox
              v-model="course.isOptional"
              dense
              hide-details
              :vid="`course-${index}-isOptional`"
            />
          </v-col>

          <v-col cols="12" md="1" class="text-center">
            <v-btn :disabled="disabled" icon @click="removeCourse(index)">
              <v-icon small>mdi-delete</v-icon>
            </v-btn>
          </v-col>
        </v-row>
      </div>

      <div v-else>
        {{ $t('course.no') }}
      </div>

      <div class="text-right mt-5">
        <v-row>
          <v-col class="v-messages error--text" cols="12" md="6">
            <span v-if="errors[0]">{{ $t(`error.${errors[0]}`) }}</span>
          </v-col>

          <v-col cols="12" md="6">
            <v-btn :disabled="disabled" small @click="addCourse">
              <v-icon left>mdi-plus</v-icon>
              {{ $t('program.courses.add') }}
            </v-btn>
          </v-col>
        </v-row>
      </div>
    </ValidationProvider>

    <div v-else-if="isLoading">
      <v-skeleton-loader type="table-heading, table-row-divider" />
    </div>

    <div v-else-if="error">{{ $t('error.unexpected') }}</div>
  </ApolloQuery>
</template>

<script>
import { ValidationProvider } from 'vee-validate'

export default {
  name: 'SelectProgramCourses',
  components: { ValidationProvider },
  props: {
    disabled: {
      type: Boolean,
      default: false,
    },
    value: {
      type: Array,
      default: () => [{}],
    },
  },
  computed: {
    courses: {
      get() {
        return this.value
      },
      set(value) {
        this.$emit('input', value)
      },
    },
    headers() {
      return [
        { title: this.$tc('course._', 1), size: 10 },
        { title: this.$t('program.courses.optional'), size: 1 },
        { title: this.$tc('general.action', 1), size: 1 },
      ]
    },
  },
  methods: {
    addCourse() {
      if (!this.disabled) {
        this.courses.push({})
      }
    },
    removeCourse(index) {
      if (!this.disabled) {
        this.courses.splice(index, 1)
      }
    },
  },
}
</script>

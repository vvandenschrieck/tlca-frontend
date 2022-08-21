<template>
  <ApolloQuery
    :query="require('~/gql/manage/getCourses.gql')"
    :update="(data) => data.courses"
  >
    <template #default="{ result: { error, data: courses }, isLoading }">
      <div v-if="!isLoading && courses">
        <div v-if="value.length > 0">
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

          <v-row v-for="(course, index) in value" :key="index">
            <v-col cols="12" md="10">
              <v-autocomplete-with-validation
                dense
                item-value="code"
                :item-text="({ code, name }) => code + ' – ' + name"
                :items="courses"
                required
                rules="required"
                :value="course.course"
                :vid="`course-${index}`"
                @input="update(index, 'course', $event)"
              >
                <template #item="{ item: { code, name } }">
                  <b>{{ code }}</b>
                  &nbsp;–&nbsp;{{ name }}
                </template>
              </v-autocomplete-with-validation>
            </v-col>

            <v-col cols="12" md="1" class="text-center">
              <v-simple-checkbox
                dense
                hide-details
                :value="course.optional"
                :vid="`course-optional-${index}`"
                @input="update(index, 'optional', $event)"
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
          <v-btn :disabled="disabled" small @click="addCourse()">
            <v-icon left>mdi-plus</v-icon>
            {{ $t('program.courses.add') }}
          </v-btn>
        </div>
      </div>

      <div v-else-if="isLoading">
        <v-skeleton-loader type="table-heading, table-row-divider" />
      </div>

      <div v-else-if="error">{{ $t('error.unexpected') }}</div>
    </template>
  </ApolloQuery>
</template>

<script>
export default {
  name: 'SelectProgramCourses',
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
    headers() {
      return [
        { title: this.$tc('course._', 1), size: 10 },
        { title: this.$tc('program.courses.optional', 1), size: 1 },
        { title: this.$tc('general.action', 1), size: 1 },
      ]
    },
  },
  methods: {
    addCourse() {
      if (!this.disabled) {
        this.$emit('input', [...this.value, {}])
      }
    },
    removeCourse(index) {
      if (!this.disabled) {
        this.$emit('input', [
          ...this.value.slice(0, index),
          ...this.value.slice(index + 1),
        ])
      }
    },
    update(index, field, value) {
      this.$emit('input', [
        ...this.value.slice(0, index),
        {
          ...this.value[index],
          [field]: value,
        },
        ...this.value.slice(index + 1),
      ])
    },
  },
}
</script>

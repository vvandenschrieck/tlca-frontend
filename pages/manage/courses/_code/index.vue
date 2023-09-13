<template>
  <ApolloQuery
    v-slot="{ isLoading, result: { error } }"
    :query="require('~/gql/manage/getCourse.gql')"
    :variables="{ code: courseCode }"
    @result="setResult"
  >
    <page-title :loading="!!isLoading" :spaces="spaces" :value="title" />

    <div v-if="!!isLoading">{{ $t('global.loading') }}</div>

    <v-row v-if="!error && canShowContent">
      <v-col cols="12" md="9">
        <v-row>
          <v-col cols="12" md="6">
            <registrations-info-card :course-code="courseCode" />
            <groups-info-card
              v-if="course?.hasGroups"
              class="mt-5"
              :course-code="courseCode"
            />
          </v-col>

          <v-col cols="12" md="6">
            <assessments-info-card
              :course-code="courseCode"
              hide-takes-status
              space="manage"
              :teacher-view="true"
            />
          </v-col>
        </v-row>
      </v-col>

      <v-col
        cols="12"
        md="3"
        :order="$vuetify.breakpoint.smAndDown ? 'first' : undefined"
      >
        <course-status-info-panel :course-code="courseCode" />
        <course-schedule-panel class="mt-5" :course-code="courseCode" />
      </v-col>

      <actions-menu
        :custom-actions="customActions"
        :edit-link="editLink"
        @customActionClicked="onCustomActionClicked"
      />
    </v-row>

    <div v-else>{{ $t('error.unexpected') }}</div>

    <!-- Course archive confirmation dialog -->
    <v-dialog
      v-if="course?.isPublished && !course.isArchived"
      v-model="archiveDialog"
      :fullscreen="$vuetify.breakpoint.xsOnly"
      max-width="500"
      :persistent="executing"
    >
      <v-card>
        <ValidationObserver ref="archiveForm" v-slot="{ handleSubmit }">
          <v-form :disabled="executing" @submit.prevent="handleSubmit(archive)">
            <v-card-title class="text-h5" dense>
              {{ $t('course.archive._') }}
            </v-card-title>

            <v-card-text>
              <v-alert v-if="archiveFormError" dense outlined type="error">
                {{ $t(archiveFormError) }}
              </v-alert>

              <div class="text--primary">
                {{ $t('course.archive.dialog_instructions') }}
              </div>

              <v-text-field-with-validation
                v-model="archiveCode"
                autofocus
                :label="$t('course.code')"
                rules="alpha_dash"
                vid="archiveCode"
              />
            </v-card-text>

            <v-card-actions>
              <v-spacer />

              <v-btn
                color="error"
                :disabled="executing"
                text
                @click="archiveReset"
              >
                {{ $t('general.cancel') }}
              </v-btn>
              <v-btn type="submit" color="primary" :loading="executing" text>
                {{ $t('course.archive._') }}
              </v-btn>
            </v-card-actions>
          </v-form>
        </ValidationObserver>
      </v-card>
    </v-dialog>

    <!-- Course clone confirmation dialog -->
    <v-dialog
      v-model="cloneDialog"
      :fullscreen="$vuetify.breakpoint.xsOnly"
      max-width="500"
      :persistent="executing"
    >
      <v-card>
        <ValidationObserver ref="cloneForm" v-slot="{ handleSubmit }">
          <v-form :disabled="executing" @submit.prevent="handleSubmit(clone)">
            <v-card-title class="text-h5" dense>
              {{ $t('course.clone._') }}
            </v-card-title>

            <v-card-text>
              <v-alert v-if="cloneFormError" dense outlined type="error">
                {{ $t(cloneFormError) }}
              </v-alert>

              <div class="text--primary">
                {{ $t('course.clone.dialog_instructions') }}
              </div>

              <v-text-field-with-validation
                v-model="cloneCode"
                autofocus
                :label="$t('course.code')"
                rules="alpha_dash"
                vid="cloneCode"
              />
            </v-card-text>

            <v-card-actions>
              <v-spacer />

              <v-btn
                color="error"
                :disabled="executing"
                text
                @click="cloneReset"
              >
                {{ $t('general.cancel') }}
              </v-btn>
              <v-btn type="submit" color="primary" :loading="executing" text>
                {{ $t('course.clone._') }}
              </v-btn>
            </v-card-actions>
          </v-form>
        </ValidationObserver>
      </v-card>
    </v-dialog>
  </ApolloQuery>
</template>

<script>
import { ValidationObserver } from 'vee-validate'

import titles from '@/mixins/titles.js'

export default {
  name: 'ManageCoursePage',
  components: { ValidationObserver },
  mixins: [titles],
  data() {
    return {
      archiveCode: '',
      archiveDialog: false,
      archiveFormError: null,
      cloneCode: '',
      cloneDialog: false,
      cloneFormError: null,
      course: null,
      executing: false,
      title: '',
    }
  },
  head() {
    return {
      title: this.getTitle(this.title, null, 'manage'),
    }
  },
  computed: {
    canShowContent() {
      return !this.course || this.course.isCoordinator
    },
    courseCode() {
      return this.$route.params.code
    },
    customActions() {
      if (!this.course) {
        return null
      }

      const actions = []

      if (!this.course.isPublished) {
        actions.push({
          icon: 'mdi-cloud-upload',
          key: 'publish',
          tooltip: this.$t('course.publish'),
        })
      } else if (!this.course.isArchived) {
        actions.push({
          icon: 'mdi-archive',
          key: 'archive',
          tooltip: this.$t('course.archive._'),
        })
      } else {
        actions.push({
          icon: 'mdi-content-copy',
          key: 'clone',
          tooltip: this.$t('course.clone'),
        })
      }

      return actions
    },
    editLink() {
      if (this.course?.isArchived) {
        return null
      }

      return {
        name: 'manage-courses-code-edit',
        params: { code: this.courseCode },
      }
    },
    spaces() {
      if (!this.course) {
        return null
      }

      const items = {
        home: {
          name: 'courses-code',
          params: { code: this.courseCode },
        },
      }

      if (this.course.isPublished && !this.course.isArchived) {
        items.teach = {
          name: 'teach-courses-code',
          params: { code: this.courseCode },
        }
      }

      return items
    },
  },
  methods: {
    async archive() {
      const response = await this.execute({
        key: 'COURSE_ARCHIVE',
        mutation: require('~/gql/manage/archiveCourse.gql'),
        name: 'archiveCourse',
        variables: { archiveCode: this.archiveCode, code: this.courseCode },
      })

      if (response) {
        this.archiveDialog = false
        this.$router.push({
          name: 'manage-courses-code',
          params: { code: response.code },
        })
      }
    },
    archiveReset() {
      this.archiveDialog = false
      this.archiveFormError = null
    },
    async clone() {
      const response = await this.execute({
        key: 'COURSE_CLONE',
        mutation: require('~/gql/manage/cloneCourse.gql'),
        name: 'cloneCourse',
        variables: { cloneCode: this.cloneCode, code: this.courseCode },
      })

      if (response) {
        this.cloneDialog = false
        this.$router.push({
          name: 'manage-courses-code',
          params: { code: response.code },
        })
      }
    },
    cloneReset() {
      this.cloneDialog = false
      this.cloneFormError = null
    },
    async execute(action) {
      if (this.executing) {
        return
      }
      this.executing = true

      const { key, mutation, name, variables } = action

      try {
        const response = await this.$apollo
          .mutate({ mutation, variables })
          .then(({ data }) => data && data[name])

        if (response) {
          this.$notificationManager.displaySuccessMessage(
            this.$t(`success.${key}`)
          )
          return response
        }
      } catch {
        return false
      } finally {
        this.executing = false
      }
    },
    onCustomActionClicked(key) {
      switch (key) {
        case 'archive':
          this.archiveDialog = true
          return
        case 'clone':
          this.cloneDialog = true
          return
        case 'publish':
          return this.publish()
      }
    },
    publish() {
      this.execute({
        key: 'COURSE_PUBLISH',
        mutation: require('~/gql/manage/publishCourse.gql'),
        name: 'publishCourse',
        variables: { code: this.courseCode },
      })
    },
    setResult({ data }) {
      if (!data) {
        return
      }

      this.course = data.course
      this.title = data.course?.name ?? ''
    },
  },
  meta: {
    roles: ['teacher'],
  },
}
</script>

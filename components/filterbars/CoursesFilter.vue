<template>
  <div>
    <v-row>
      <v-col cols="3">{{ $t('course.status.archived') }}</v-col>
      <v-col cols="9">
        <v-switch
          v-model="innerValue.includeArchived"
          class="mt-0 pt-0"
          dense
          hide-details
          @change="update"
        />
      </v-col>
    </v-row>

    <v-row v-if="!hideRoles">
      <v-col cols="3">{{ $t('course.filter.role') }}</v-col>
      <v-col cols="9">
        <v-select
          v-model="innerValue.roles"
          clearable
          dense
          hide-details
          :items="rolesList"
          multiple
          @input="update"
        />
      </v-col>
    </v-row>
  </div>
</template>

<script>
import filterStorage from '@/mixins/filter-storage.js'

export default {
  name: 'CoursesFilter',
  mixins: [filterStorage],
  props: {
    hideRoles: {
      type: Boolean,
      default: false,
    },
    hideUnpublished: {
      type: Boolean,
      default: false,
    },
    value: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      defaultValue: {
        includeArchived: false,
        roles: null,
      },
      innerValue: {},
    }
  },
  computed: {
    rolesList() {
      return [
        { text: this.$t('course.coordinator'), value: 'COORDINATOR' },
        { text: this.$tc('course.teacher', 1), value: 'TEACHER' },
      ]
    },
  },
}
</script>

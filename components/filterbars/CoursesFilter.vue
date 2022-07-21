<template>
  <div>
    <v-row>
      <v-col cols="3">{{ $t('course.filter.status') }}</v-col>
      <v-col cols="9">
        <v-select
          clearable
          dense
          hide-details
          :items="statusList"
          multiple
          :value="value.status"
          @input="update('status', $event)"
        />
      </v-col>
    </v-row>

    <v-row v-if="!hideRoles">
      <v-col cols="3">{{ $t('course.filter.role') }}</v-col>
      <v-col cols="9">
        <v-select
          clearable
          dense
          hide-details
          :items="rolesList"
          multiple
          :value="value.roles"
          @input="update('roles', $event)"
        />
      </v-col>
    </v-row>
  </div>
</template>

<script>
export default {
  name: 'ProgramsFilter',
  props: {
    hideRoles: {
      type: Boolean,
      default: false
    },
    value: {
      type: Object,
      default: () => {
        return {
          status: null,
          roles: null,
        }
      },
    },
  },
  computed: {
    statusList() {
      const status = []

      status.push(
        { text: this.$t('course.status.unpublished'), value: 'UNPUBLISHED' },
        { text: this.$t('course.status.published'), value: 'PUBLISHED' },
        { text: this.$t('course.status.archived'), value: 'ARCHIVED' }
      )
      return status
    },
    rolesList() {
      return [
        { text: this.$t('course.coordinator'), value: 'COORDINATOR' },
        { text: this.$tc('course.teacher', 1), value: 'TEACHER' },
      ]
    },
  },
  methods: {
    update(field, value) {
      this.$emit('input', { ...this.value, [field]: value })
    },
  },
}
</script>

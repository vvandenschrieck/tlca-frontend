<template>
  <div>
    <v-row>
      <v-col cols="3">{{ $t('course.status.archived') }}</v-col>
      <v-col cols="9">
        <v-switch
          class="mt-0 pt-0"
          dense
          hide-details
          :value="value.includeArchived"
          @change="update('includeArchived', $event)"
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
      default: false,
    },
    hideUnpublished: {
      type: Boolean,
      default: false,
    },
    value: {
      type: Object,
      default: () => {
        return {
          includeArchived: false,
          roles: null,
        }
      },
    },
  },
  computed: {
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

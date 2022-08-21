<template>
  <div>
    <v-row>
      <v-col cols="3">{{ $t('program.filter.status') }}</v-col>
      <v-col cols="9">
        <v-select
          clearable
          dense
          hide-details
          :items="statusList"
          multiple
          :value="value.status"
          @input="update('status', $event)"
        >
        </v-select>
      </v-col>
    </v-row>
  </div>
</template>

<script>
export default {
  name: 'ProgramsFilter',
  props: {
    value: {
      type: Object,
      default: () => {
        return {
          status: null,
        }
      },
    },
  },
  computed: {
    statusList() {
      const status = []

      status.push(
        { text: this.$t('program.status.unpublished'), value: 'UNPUBLISHED' },
        { text: this.$t('program.status.published'), value: 'PUBLISHED' },
        { text: this.$t('program.status.archived'), value: 'ARCHIVED' }
      )
      return status
    },
  },
  methods: {
    update(field, value) {
      this.$emit('input', { ...this.value, [field]: value })
    },
  },
}
</script>

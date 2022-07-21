<template>
  <div>
    <v-row>
      <v-col cols="3">{{ $t('competency.filter.visibility') }}</v-col>
      <v-col cols="9">
        <v-select
          clearable
          dense
          hide-details
          :items="visibilitiesList"
          multiple
          :value="value.visibilities"
          @input="update('visibilities', $event)"
        />
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="3">{{ $t('competency.filter.creator') }}</v-col>
      <v-col cols="9">
        <v-select
          clearable
          dense
          hide-details
          :items="creatorsList"
          multiple
          :value="value.creators"
          @input="update('creators', $event)"
        />
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="3">{{ $t('competency.filter.tags') }}</v-col>
      <v-col cols="9">
        <v-combobox
          chips
          clearable
          deletable-chips
          dense
          hide-details
          multiple
          small-chips
          :value="value.tags"
          @input="update('tags', $event)"
        />
      </v-col>
    </v-row>
  </div>
</template>

<script>
export default {
  name: 'CompetenciesFilter',
  props: {
    value: {
      type: Object,
      default: () => {
        return {
          creators: null,
          tags: null,
          visibilities: null,
        }
      },
    },
  },
  computed: {
    creatorsList() {
      const visibilities = []

      visibilities.push(
        { text: this.$t('competency.creator.own'), value: 'OWN' },
        { text: this.$t('competency.creator.partners'), value: 'PARTNERS' },
        { text: this.$t('competency.creator.external'), value: 'EXTERNAL' }
      )
      return visibilities
    },
    visibilitiesList() {
      const visibilities = []

      visibilities.push(
        { text: this.$t('competency.visibility.public'), value: 'PUBLIC' },
        { text: this.$t('competency.visibility.private'), value: 'PRIVATE' }
      )
      return visibilities
    },
  },
  methods: {
    update(field, value) {
      this.$emit('input', { ...this.value, [field]: value })
    },
  },
}
</script>

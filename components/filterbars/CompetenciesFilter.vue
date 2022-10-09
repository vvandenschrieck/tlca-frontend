<template>
  <div>
    <v-row>
      <v-col cols="3">{{ $t('competency.filter.public') }}</v-col>
      <v-col cols="9">
        <v-switch
          class="mt-0 pt-0"
          dense
          hide-details
          :value="value.includePublic"
          @change="update('includePublic', $event)"
        />
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="3">{{ $t('competency.filter.archived') }}</v-col>
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
          append-icon=""
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
          includeArchived: false,
          includePublic: false,
          tags: null,
        }
      },
    },
  },
  computed: {
    creatorsList() {
      const creators = []

      creators.push(
        { text: this.$t('competency.creator.own'), value: 'OWN' },
        { text: this.$t('competency.creator.partners'), value: 'PARTNERS' },
        { text: this.$t('competency.creator.external'), value: 'EXTERNAL' }
      )
      return creators
    },
  },
  methods: {
    update(field, value) {
      this.$emit('input', { ...this.value, [field]: value })
    },
  },
}
</script>

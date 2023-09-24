<template>
  <div>
    <v-row>
      <v-col cols="3">{{ $t('competency.filter.public') }}</v-col>
      <v-col cols="9">
        <v-switch
          v-model="innerValue.includePublic"
          class="mt-0 pt-0"
          dense
          hide-details
          @change="update"
        />
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="3">{{ $t('competency.filter.archived') }}</v-col>
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

    <v-row>
      <v-col cols="3">{{ $t('competency.filter.creator') }}</v-col>
      <v-col cols="9">
        <v-select
          v-model="innerValue.creators"
          clearable
          dense
          hide-details
          :items="creatorsList"
          multiple
          @input="update"
        />
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="3">{{ $t('competency.filter.tags') }}</v-col>
      <v-col cols="9">
        <v-combobox
          v-model="innerValue.tags"
          append-icon=""
          chips
          clearable
          deletable-chips
          dense
          hide-details
          multiple
          small-chips
          @input="update"
        />
      </v-col>
    </v-row>
  </div>
</template>

<script>
import filterStorage from '@/mixins/filter-storage.js'

export default {
  name: 'CompetenciesFilter',
  mixins: [filterStorage],
  props: {
    value: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      defaultValue: {
        creators: null,
        includeArchived: false,
        includePublic: false,
        tags: null,
      },
      innerValue: {},
    }
  },
  computed: {
    creatorsList() {
      return [
        { text: this.$t('competency.creator.own'), value: 'OWN' },
        { text: this.$t('competency.creator.partners'), value: 'PARTNERS' },
        { text: this.$t('competency.creator.external'), value: 'EXTERNAL' },
      ]
    },
  },
}
</script>

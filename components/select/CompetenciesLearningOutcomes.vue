<template>
  <ValidationProvider v-slot="{ errors }" :vid="$attrs.vid">
    <div v-if="learningOutcomes.length > 0">
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

      <v-row v-for="(learningOutcome, index) in learningOutcomes" :key="index">
        <v-col cols="12" md="9">
          <v-text-field-with-validation
            v-model="learningOutcome.name"
            dense
            required
            rules="required"
            :vid="`learningOutcome-${index}-name`"
          />
        </v-col>

        <v-col cols="12" md="2">
          <v-text-field-with-validation
            v-model="learningOutcome.takes"
            clearable
            dense
            type="number"
            rules="positive"
            :vid="`learningOutcome-${index}-takes`"
          />
        </v-col>

        <v-col cols="12" md="1" class="text-center">
          <v-btn
            icon
            :disabled="disabled"
            @click="removeLearningOutcome(index)"
          >
            <v-icon small>mdi-delete</v-icon>
          </v-btn>
        </v-col>
      </v-row>
    </div>

    <div v-else>
      {{ $t('competency.learning_outcomes.no') }}
    </div>

    <div class="text-right mt-5">
      <v-row>
        <v-col class="v-messages error--text" cols="12" md="6">
          {{ errors[0] }}
        </v-col>

        <v-col cols="12" md="6">
          <v-btn :disabled="disabled" small @click="addLearningOutcome">
            <v-icon left>mdi-plus</v-icon>
            {{ $t('competency.learning_outcomes.add') }}
          </v-btn>
        </v-col>
      </v-row>
    </div>
  </ValidationProvider>
</template>

<script>
import { ValidationProvider } from 'vee-validate'

export default {
  name: 'SelectCompetenciesLearningOutcomes',
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
    headers() {
      return [
        { title: this.$t('competency.learning_outcomes.name'), size: 9 },
        { title: this.$t('competency.learning_outcomes.takes'), size: 2 },
        { title: this.$tc('general.action', 1), size: 1 },
      ]
    },
    learningOutcomes: {
      get() {
        return this.value
      },
      set(value) {
        this.$emit('input', value)
      },
    },
  },
  methods: {
    addLearningOutcome() {
      if (!this.disabled) {
        this.learningOutcomes.push({})
      }
    },
    removeLearningOutcome(index) {
      if (!this.disabled) {
        this.learningOutcomes.splice(index, 1)
      }
    },
  },
}
</script>

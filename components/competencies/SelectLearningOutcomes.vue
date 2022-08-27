<template>
  <ValidationProvider v-slot="{ errors }" :vid="$attrs.vid">
    <div v-if="value.length">
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

      <v-row v-for="(learningOutcome, index) in value" :key="index">
        <v-col cols="12" md="11">
          <v-text-field-with-validation
            dense
            required
            rules="required"
            :value="value[index]"
            :vid="`learningOutcome-${index}`"
            @input="update(index, $event)"
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
  name: 'CompetenciesSelectLearningOutcomes',
  components: { ValidationProvider },
  props: {
    disabled: {
      type: Boolean,
      default: false,
    },
    value: {
      type: Array,
      default: () => [''],
    },
  },
  computed: {
    headers() {
      return [
        { title: this.$tc('competency.learning_outcomes.name', 1), size: 11 },
        { title: this.$tc('general.action', 1), size: 1 },
      ]
    },
  },
  methods: {
    addLearningOutcome() {
      if (!this.disabled) {
        this.$emit('input', [...this.value, ''])
      }
    },
    removeLearningOutcome(index) {
      if (!this.disabled) {
        this.$emit('input', [
          ...this.value.slice(0, index),
          ...this.value.slice(index + 1),
        ])
      }
    },
    update(index, value) {
      this.$emit('input', [
        ...this.value.slice(0, index),
        value,
        ...this.value.slice(index + 1),
      ])
    },
  },
}
</script>

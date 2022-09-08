<template>
  <ValidationProvider v-if="nb" v-slot="{ errors }" :vid="$attrs.vid">
    <v-card>
      <v-tabs v-model="currentPhase" show-arrows>
        <v-tab v-for="i in nb" :key="i">
          {{ $t('assessment.phase.phase_nb', { nb: i }) }}
        </v-tab>
      </v-tabs>

      <v-card-text class="text--primary">
        <v-tabs-items v-model="currentPhase">
          <v-tab-item v-for="i in nb" :key="i">
            <v-row>
              <v-col cols="12" md="12">
                <v-text-field-with-validation
                  v-model="phases[i - 1].name"
                  :label="$t('assessment.phase.name')"
                  required
                  rules="required"
                  :vid="`phase-${i - 1}-name`"
                />
              </v-col>
            </v-row>

            <v-row>
              <v-col cols="12" md="12">
                <v-textarea-with-validation
                  v-model="phases[i - 1].description"
                  auto-grow
                  clearable
                  filled
                  :label="$t('assessment.phase.description')"
                  :vid="`phase-${i - 1}-description`"
                />
              </v-col>
            </v-row>

            <select-assessment-competencies
              v-model="phases[i - 1].competencies"
              :disabled="disabled"
              :vid="`phase-${i - 1}-competencies`"
            />
          </v-tab-item>
        </v-tabs-items>
      </v-card-text>
    </v-card>

    <div>{{ errors[0] }}</div>
  </ValidationProvider>
  <div v-else>No phases nb</div>
</template>

<script>
import { ValidationProvider } from 'vee-validate'

export default {
  name: 'SelectAssessmentPhases',
  components: { ValidationProvider },
  props: {
    disabled: {
      type: Boolean,
      default: false,
    },
    nb: {
      type: Number,
      required: true,
    },
    value: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      currentPhase: 0,
    }
  },
  computed: {
    phases: {
      get() {
        return this.value
      },
      set(value) {
        this.$emit('input', value)
      },
    },
  },
  watch: {
    nb(value) {
      this.phases = Array.from({ length: value }, () => ({
        competencies: [{}],
      }))
    },
  },
}
</script>

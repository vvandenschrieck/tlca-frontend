<template>
  <v-list-item class="unselected" :class="{ selected: state.selected }">
    <v-list-item-content>
      <v-list-item-title>
        <v-checkbox
          v-if="form && !competency.useLearningOutcomes"
          v-model="state.selected"
          class="ml-1"
          dense
          :disabled="state.disabled"
          hide-details
          :readonly="readonly"
        >
          <span slot="label" class="text-body-1 title">
            {{ competencyName(competency.competency) }}
          </span>
        </v-checkbox>
        <span v-else>{{ competencyName(competency.competency) }}</span>
      </v-list-item-title>

      <v-list-item-subtitle>
        <learning-outcomes-list
          v-model="state.learningOutcomes"
          class="ml-3 mt-3"
          :form="form"
          hide-divider
          hide-takes
          :items="competency.learningOutcomes"
          :title="$t('assessment.learning_outcomes.targeted')"
          @input="updateSelected"
        />

        <competency-check-list
          v-if="!hideChecklist || !state.disabled"
          v-model="state.checklist.public"
          class="ml-3 mt-3"
          :form="form && !state.selected"
          :items="competency.checklist?.public"
          :name="$t(`assessment.checklist.${studentView ? '_' : 'public'}`)"
        />

        <competency-check-list
          v-if="!hideChecklist || !state.selected"
          v-model="state.checklist.private"
          class="ml-3 mt-3"
          :form="form"
          :items="competency.checklist?.private"
          :name="$t('assessment.checklist.private')"
        />
      </v-list-item-subtitle>
    </v-list-item-content>

    <v-list-item-action class="align-self-baseline">
      <learning-outcome-chip
        v-if="competency.useLearningOutcomes"
        :color="color(state)"
      />
      <stars-field
        v-else
        :color="color(state)"
        :length="3"
        readonly
        :value="competency.stars"
      />
    </v-list-item-action>
  </v-list-item>
</template>

<script>
import competencies from '@/mixins/competencies.js'

export default {
  name: 'CompetencyListItem',
  mixins: [competencies],
  props: {
    competency: {
      type: Object,
      required: true,
    },
    form: {
      type: Boolean,
      default: false,
    },
    hideChecklist: {
      type: Boolean,
      default: false,
    },
    readonly: {
      type: Boolean,
      default: false,
    },
    studentView: {
      type: Boolean,
      default: false,
    },
    value: {
      type: Object,
      default: null,
    },
  },
  data() {
    return {
      state: {
        checklist: {
          private: [],
          public: [],
        },
        competency: this.competency.competency.code,
        disabled: false,
        learningOutcomes: [],
        selected: false,
      },
    }
  },
  watch: {
    state: {
      handler(value) {
        this.$emit('input', value)
      },
      immediate: true,
    },
    value: {
      handler(value) {
        if (!value) {
          return
        }

        this.state = value
        if (!this.state.checklist) {
          this.state.checklist = {}
        }
        // this.state.checklist = value.checklist
        // this.state.disabled = value.disabled
        // this.state.learningOutcomes = value.learningOutcomes
        // this.state.selected = value.selected
      },
      immediate: true,
    },
  },
  methods: {
    color(state) {
      return state.selected ? 'success' : 'primary'
    },
    updateSelected() {
      this.state.selected = this.state.learningOutcomes?.every(
        (lo) => lo.selected
      )
    },
  },
  // watch: {
  //   value: {
  //     handler(value) {
  //       console.log('Changed : ', value)

  //       if (!this.value || !value.checklist || !value.learningOutcomes) {
  //         console.log('JE SUIS DANS LE IF')

  //         this.state = {
  //           checklist: {
  //             private: value?.checklist?.private ?? [],
  //             public: value?.checklist?.public ?? [],
  //           },
  //           disabled: false,
  //           learningOutcomes: value?.learningOutcomes ?? [],
  //           selected: false,
  //         }

  //         return this.$emit('input', this.state)
  //       }

  //       this.state = value
  //     },
  //     immediate: true,
  //   },
  // },
}
</script>

<style scoped>
.selected {
  border-left: 3px solid green;
  padding-left: 9px !important;
}
.title {
  color: rgba(0, 0, 0, 0.87);
}
.unselected {
  padding-left: 12px;
}
</style>

<template>
  <v-text-field
    clearable
    dense
    hide-details
    outlined
    prepend-inner-icon="mdi-magnify"
    :value="value.text"
    @input="updateText"
  >
    <v-menu
      v-if="!hideFilter"
      slot="append"
      v-model="showMenu"
      :close-on-content-click="false"
      left
      :max-width="400"
      :nudge-width="400"
      offset-y
      @input="initialise"
    >
      <template #activator="{ on, attrs }">
        <v-btn icon small v-bind="attrs" v-on="on">
          <v-icon>{{ filterIcon }}</v-icon>
        </v-btn>
      </template>

      <v-card>
        <v-card-text>
          <slot
            :filter="innerFilter"
            :on="{ input: (value) => (innerFilter = value) }"
          />
        </v-card-text>

        <v-card-actions>
          <v-spacer />

          <v-btn color="error" text @click="reset()">
            {{ $t('general.reset') }}
          </v-btn>
          <v-btn color="primary" text @click="apply()">
            {{ $t('general.apply') }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-menu>

    <v-btn
      v-if="createLink"
      slot="append-outer"
      color="success"
      style="top: -7px"
      :to="createLink"
    >
      <v-icon left>mdi-plus</v-icon>
      <span>{{ $t('general.create') }}</span>
    </v-btn>
  </v-text-field>
</template>

<script>
import { useLocalStorage } from '@vueuse/core'

export default {
  name: 'GenericFilterBar',
  props: {
    cacheKey: {
      type: String,
      default: 'filter',
    },
    createLink: {
      type: Object,
      default: null,
    },
    hideFilter: {
      type: Boolean,
      default: false,
    },
    value: {
      type: Object,
      default: () => {
        return {
          text: null,
          options: {},
        }
      },
    },
  },
  setup(props) {
    const filter = useLocalStorage(props.cacheKey, {})
    return { filter }
  },
  data() {
    return {
      innerFilter: null,
      showMenu: false,
      text: '',
    }
  },
  computed: {
    filterIcon() {
      const { options } = this.value
      return options &&
        Object.values(options).some((v) => v !== undefined && v !== null)
        ? 'mdi-filter'
        : 'mdi-filter-outline'
    },
  },
  watch: {
    showMenu(value) {
      if (value) {
        this.innerFilter = { ...this.filter }
      }
    },
    value: {
      handler(value) {
        this.filter = { ...this.filter, ...value.options }
        this.text = value.text
      },
      immediate: true,
    },
  },
  mounted() {
    this.innerFilter = this.filter
    this.apply()
  },
  methods: {
    apply() {
      this.filter = this.innerFilter
      this.$emit('input', { text: this.text, options: { ...this.filter } })
    },
    initialise(open) {
      if (open) {
        this.text = this.value.text
        this.filter = this.value.options
      }
    },
    reset() {
      this.innerFilter = null
      this.showMenu = false
      this.apply()
    },
    updateText(value) {
      this.$emit('input', { ...this.value, text: value })
    },
  },
}
</script>

<template>
  <div class="content pl-5">
    <i v-if="name">{{ name }}</i>

    <template v-if="checklist.length > 0">
      <v-row v-for="(item, index) in checklist" :key="index" class="mt-0">
        <v-col class="pt-0" cols="12" md="11">
          <v-text-field-with-validation
            v-model="checklist[index]"
            dense
            required
            rules="required"
            :vid="`${vid}-item-${index}`"
          >
            <template #prepend-inner>
              <v-icon class="mt-1" small>mdi-checkbox-blank-outline</v-icon>
            </template>
          </v-text-field-with-validation>
        </v-col>

        <v-col class="pt-0" cols="12" md="1">
          <v-btn :disabled="disabled" icon @click="removeItem(index)">
            <v-icon small>mdi-delete</v-icon>
          </v-btn>
        </v-col>
      </v-row>
    </template>

    <div v-else>
      {{ $t('assessment.checklist.no') }}
    </div>

    <div class="text-right mt-3">
      <v-btn :disabled="disabled" x-small @click="addItem">
        <v-icon left>mdi-plus</v-icon>
        {{ $t('assessment.checklist.add_item') }}
      </v-btn>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CheckList',
  props: {
    disabled: {
      type: Boolean,
      default: false,
    },
    name: {
      type: String,
      default: '',
    },
    value: {
      type: Array,
      default: () => [],
    },
    vid: {
      type: String,
      default: '',
    },
  },
  computed: {
    checklist: {
      get() {
        return this.value
      },
      set(value) {
        this.$emit('input', value)
      },
    },
  },
  methods: {
    addItem() {
      if (!this.disabled) {
        this.checklist.push('')
      }
    },
    removeItem(index) {
      if (!this.disabled) {
        this.checklist.splice(index, 1)
      }
    },
  },
}
</script>

<style scoped>
.content {
  border-left: 1px solid rgba(0, 0, 0, 0.12);
}
</style>

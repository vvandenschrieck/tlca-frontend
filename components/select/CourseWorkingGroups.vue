<template>
  <ValidationProvider v-slot="{ errors }" :vid="$attrs.vid">
    <div v-if="groups.length > 0">
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

      <v-row v-for="(group, index) in groups" :key="index">
        <v-col cols="12" md="6">
          <v-text-field
            v-model="group.name"
            dense
            :vid="`group-${index}-name`"
          />
        </v-col>

        <v-col cols="12" md="5">
          <v-text-field
            v-model="group.size"
            dense
            type="number"
            :vid="`group-${index}-size`"
          />
        </v-col>

        <v-col class="text-center" cols="12" md="1">
          <v-btn :disabled="disabled" icon @click="() => removeGroup(index)">
            <v-icon small>mdi-delete</v-icon>
          </v-btn>
        </v-col>
      </v-row>
    </div>

    <div v-else>{{ $t('course.groups.working.no') }}</div>

    <div class="text-right mt-5">
      <v-row>
        <v-col class="v-messages error--text" cols="12" md="6">
          <span v-if="errors[0]">{{ $t(`error.${errors[0]}`) }}</span>
        </v-col>

        <v-col cols="12" md="6">
          <v-btn class="mb-1" :disabled="disabled" small @click="addGroup">
            <v-icon left>mdi-plus</v-icon>
            {{ $t('course.groups.working.add') }}
          </v-btn>
        </v-col>
      </v-row>
    </div>
  </ValidationProvider>
</template>

<script>
import { ValidationProvider } from 'vee-validate'

export default {
  name: 'SelectCourseWorkingGroups',
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
    groups: {
      get() {
        return this.value
      },
      set(value) {
        this.$emit('input', value)
      },
    },
    headers() {
      return [
        { title: this.$t('course.groups.name'), size: 6 },
        { title: this.$t('course.groups.size'), size: 5 },
        { title: this.$tc('general.action', 1), size: 1 },
      ]
    },
  },
  methods: {
    addGroup() {
      if (!this.disabled) {
        this.groups.push({})
      }
    },
    removeGroup(index) {
      if (!this.disabled) {
        this.groups.splice(index, 1)
      }
    },
  },
}
</script>

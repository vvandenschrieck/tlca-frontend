<template>
  <ValidationProvider v-slot="{ errors }" :vid="$attrs.vid">
    <div v-if="value.length > 0">
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

      <v-row v-for="(group, index) in value" :key="index">
        <v-col cols="12" md="6">
          <v-text-field
            dense
            :value="group.name"
            @input="update(index, 'name', $event)"
          />
        </v-col>
        <v-col cols="12" md="5">
          <v-select-with-validation
            dense
            :items="teachers"
            required
            rules="required"
            :value="group.supervisor"
            :vid="`group-supervisor-${index}`"
            @input="update(index, 'supervisor', $event)"
          />
        </v-col>
        <v-col cols="12" md="1" class="text-center">
          <v-btn icon :disabled="disabled" @click="removeGroup(index)">
            <v-icon small>mdi-delete</v-icon>
          </v-btn>
        </v-col>
      </v-row>
    </div>
    <div v-else>
      {{ $t('course.groups.no') }}
    </div>

    <div class="text-right mt-5">
      <v-row>
        <v-col class="v-messages error--text" cols="12" md="6">
          {{ errors[0] }}
        </v-col>

        <v-col cols="12" md="6">
          <v-btn :disabled="disabled" small @click="addGroup()">
            <v-icon left>mdi-plus</v-icon>
            {{ $t('course.groups.add') }}
          </v-btn>
        </v-col>
      </v-row>
    </div>
  </ValidationProvider>
</template>

<script>
import { ValidationProvider } from 'vee-validate'

export default {
  name: 'SelectCourseGroups',
  components: { ValidationProvider },
  props: {
    disabled: {
      type: Boolean,
      default: false,
    },
    teachers: {
      type: Array,
      default: () => [],
    },
    value: {
      type: Array,
      default: () => [{}],
    },
  },
  computed: {
    headers() {
      return [
        { title: this.$t('course.groups.name'), size: 6 },
        { title: this.$t('course.groups.supervisor'), size: 5 },
        { title: this.$tc('general.action', 1), size: 1 },
      ]
    },
  },
  methods: {
    addGroup() {
      if (!this.disabled) {
        this.$emit('input', [...this.value, {}])
      }
    },
    removeGroup(index) {
      if (!this.disabled) {
        this.$emit('input', [
          ...this.value.slice(0, index),
          ...this.value.slice(index + 1),
        ])
      }
    },
    update(index, field, value) {
      this.$emit('input', [
        ...this.value.slice(0, index),
        {
          ...this.value[index],
          [field]: value,
        },
        ...this.value.slice(index + 1),
      ])
    },
  },
}
</script>

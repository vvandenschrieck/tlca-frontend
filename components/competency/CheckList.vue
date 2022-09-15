<template>
  <div>
    <i>{{ name }}</i>

    <v-list class="pa-0 mt-2">
      <v-list-item v-for="(item, i) in items" :key="i" class="line pl-3" dense>
        <v-list-item-content class="pa-0">
          <v-list-item-title>
            <v-icon class="mt-0" small>mdi-checkbox-blank-outline</v-icon>
            {{ item }}
          </v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </v-list>
  </div>
</template>

<script>
export default {
  name: 'CompetencyCheckList',
  props: {
    name: {
      type: String,
      default: '',
    },
    items: {
      type: Array,
      required: true,
    },
  },
}
</script>

<style scoped>
.line {
  min-height: 30px;
}
</style>

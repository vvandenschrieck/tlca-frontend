<template>
  <v-card>
    <v-card-title class="grey lighten-2 py-2">
      <v-icon left size="20">{{ icon }}</v-icon>
      <span class="subtitle-1">{{ title }}</span>
    </v-card-title>
    <v-card-text>
      <v-list v-if="items && items.length" dense>
        <v-list-item v-for="(item, i) in items" :key="i" class="item pa-0 my-1">
          <v-list-item-icon class="ma-0">
            <v-tooltip left open-delay="500">
              <template #activator="{ on, attrs }">
                <v-icon v-bind="attrs" size="16" v-on="on">{{
                  item.icon
                }}</v-icon>
              </template>
              <span>{{ item.tooltip }}</span>
            </v-tooltip>
          </v-list-item-icon>
          <v-list-item-content class="py-0">
            <v-list-item-title>{{ item.text }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
      <slot></slot>
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  name: 'InfoPanel',
  props: {
    title: {
      type: String,
      required: true,
    },
    icon: {
      type: String,
      required: true,
    },
    items: {
      type: Array,
      default: undefined,
    },
  },
}
</script>

<style scoped>
.item {
  min-height: 10px;
}
</style>

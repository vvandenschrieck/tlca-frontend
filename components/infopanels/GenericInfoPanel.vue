<template>
  <v-card>
    <v-card-title class="grey lighten-2 py-2">
      <v-icon left size="20" v-text="icon"></v-icon>
      <span class="subtitle-1" v-text="title"></span>
    </v-card-title>
    <v-card-text class="px-0">
      <v-list v-if="items && items.length" dense>
        <template v-for="(item, i) in items">
          <v-list-item v-if="!item.details" :key="i" class="item mb-1">
            <v-list-item-icon class="ma-auto">
              <v-tooltip left open-delay="500">
                <template #activator="{ on, attrs }">
                  <v-icon
                    v-bind="attrs"
                    size="16"
                    v-on="on"
                    v-text="item.icon"
                  ></v-icon>
                </template>
                <span v-text="item.tooltip"></span>
              </v-tooltip>
            </v-list-item-icon>
            <v-list-item-content class="py-0">
              <v-list-item-title
                class="content"
                v-text="item.text"
              ></v-list-item-title>
            </v-list-item-content>
          </v-list-item>

          <v-list-group v-else :key="i" v-model="item.active" no-action>
            <v-list-item slot="activator" class="pl-0">
              <v-list-item-icon class="ma-auto">
                <v-tooltip left open-delay="500">
                  <template #activator="{ on, attrs }">
                    <v-icon
                      v-bind="attrs"
                      size="16"
                      v-on="on"
                      v-text="item.icon"
                    ></v-icon>
                  </template>
                  <span v-text="item.tooltip"></span>
                </v-tooltip>
              </v-list-item-icon>
              <v-list-item-content>
                <v-list-item-title v-text="item.text"></v-list-item-title>
              </v-list-item-content>
            </v-list-item>
            <v-list-item
              v-for="(child, j) in item.details"
              :key="i + '-' + j"
              class="item mt-1 mb-2 pl-10"
            >
              <v-list-item-content class="py-0">
                <v-list-item-title v-text="child"></v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list-group>
        </template>
      </v-list>
      <slot></slot>
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  name: 'GenericInfoPanel',
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
  min-height: 10px !important;
}
.content {
  white-space: inherit;
}
</style>

<template>
  <v-card :loading="loading">
    <v-card-title class="grey lighten-2 py-2">
      <v-icon left size="20">{{ icon }}</v-icon>
      <span class="subtitle-1">{{ title }}</span>
    </v-card-title>

    <v-card-text class="px-0">
      <v-list v-if="items?.length" dense>
        <template v-for="(item, i) in items">
          <v-list-item v-if="!item.details" :key="i" class="item mb-1">
            <v-list-item-icon class="align-self-baseline ma-auto">
              <v-tooltip v-if="item.icon" left open-delay="500">
                <template #activator="{ on, attrs }">
                  <v-icon size="16" v-bind="attrs" v-on="on">
                    {{ item.icon }}
                  </v-icon>
                </template>

                <span>{{ item.tooltip }}</span>
              </v-tooltip>
            </v-list-item-icon>

            <v-list-item-content class="py-0">
              <v-list-item-title class="content">
                <span v-if="!item.status">{{ item.text }}</span>
                <v-chip v-else :color="item.status" small>
                  {{ item.text }}
                </v-chip>
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>

          <v-list-group v-else :key="i" v-model="item.active" no-action>
            <v-list-item slot="activator" class="pl-0">
              <v-list-item-icon class="ma-auto">
                <v-tooltip v-if="item.icon" left open-delay="500">
                  <template #activator="{ on, attrs }">
                    <v-icon size="16" v-bind="attrs" v-on="on">
                      {{ item.icon }}
                    </v-icon>
                  </template>

                  <span>{{ item.tooltip }}</span>
                </v-tooltip>
              </v-list-item-icon>

              <v-list-item-content>
                <v-list-item-title>{{ item.text }}</v-list-item-title>
              </v-list-item-content>
            </v-list-item>

            <v-list-item
              v-for="(child, j) in item.details"
              :key="i + '-' + j"
              class="item mt-1 mb-2 pl-10"
            >
              <v-list-item-content class="py-0">
                <v-list-item-title>{{ child }}</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list-group>
        </template>
      </v-list>

      <slot />
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  name: 'GenericInfoPanel',
  props: {
    icon: {
      type: String,
      required: true,
    },
    items: {
      type: Array,
      default: undefined,
    },
    loading: {
      type: Boolean,
      default: false,
    },
    title: {
      type: String,
      required: true,
    },
  },
}
</script>

<style scoped>
.content {
  white-space: inherit;
}
.item {
  min-height: 10px !important;
}
</style>

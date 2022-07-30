<template>
  <v-menu v-if="!empty" offset-y>
    <template #activator="{ on, attrs }">
      <v-btn class="float-right" small v-bind="attrs" v-on="on">
        <v-icon left>mdi-swap-horizontal</v-icon>
        {{ $tc('global.spaces._', 2) }}
      </v-btn>
    </template>

    <v-list dense>
      <template v-for="space in spaces">
        <v-list-item
          v-if="space in items"
          :key="space"
          dense
          :to="items[space]"
        >
          <v-list-item-title>
            {{ $t(`global.spaces.${space}`) }}
          </v-list-item-title>
        </v-list-item>
      </template>
    </v-list>
  </v-menu>
</template>

<script>
export default {
  name: 'SpaceSwitcher',
  props: {
    items: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      spaces: ['home', 'manage', 'teach', 'learn'],
    }
  },
  computed: {
    empty() {
      return !this.items || this.spaces.every((s) => !(s in this.items))
    },
  },
}
</script>

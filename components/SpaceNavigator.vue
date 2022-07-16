<template>
  <v-navigation-drawer
    permanent
    app
    fixed
    disable-resize-watcher
    expand-on-hover
    clipped
    :mini-variant.sync="miniVariant"
    @mouseleave.native="hoveredItem = undefined"
  >
    <v-row class="fill-height" no-gutters>
      <v-navigation-drawer dark mini-variant permanent>
        <v-list>
          <v-list-item-group :value="selectedSpace">
            <v-list-item
              v-for="(item, i) in filteredSpaces"
              :key="i"
              @mouseenter="hoveredItem = item"
              @change="selectItem(i)"
            >
              <v-list-item-action>
                <v-icon>{{ item.icon }}</v-icon>
              </v-list-item-action>
              <v-list-item-content>
                <v-list-item-title>{{ item.title }}</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list-item-group>
        </v-list>
      </v-navigation-drawer>
      <v-list v-show="!miniVariant" width="calc(100% - 56px)">
        <v-subheader v-t="hoveredSpace.title" inset></v-subheader>
        <v-divider />
        <v-list-item
          v-for="(item, i) in hoveredSpace.sections"
          :key="i"
          :to="item.to"
        >
          <v-list-item-content>
            <v-list-item-title>{{ $tc(item.title, 2) }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-row>
  </v-navigation-drawer>
</template>

<script>
import authentication from '@/mixins/authentication.js'

import { spaces } from '@/data/spaces.config.js'

export default {
  name: 'SpaceNavigator',
  mixins: [authentication],
  data() {
    return {
      miniVariant: true,
      hoveredItem: undefined,
    }
  },
  computed: {
    hoveredSpace() {
      return this.hoveredItem ?? this.filteredSpaces[this.selectedSpace]
    },
    selectedSpace() {
      const spacesRoot = spaces.map((s) => s.to.name).slice(1)
      const path = this.$route.path

      for (const [i, space] of spacesRoot.entries()) {
        if (path.startsWith(space)) {
          return i + 1
        }
      }
      return 0
    },
    filteredSpaces() {
      return spaces
        .filter((space) => !space.roles || this.hasAnyRoles(space.roles))
        .map((space) => ({
          ...space,
          sections: space.sections.filter(
            (section) => !section.roles || this.hasAnyRoles(section.roles)
          ),
        }))
    },
  },
  methods: {
    selectItem(index) {
      this.$router.push(this.filteredSpaces[index].to)
    },
  },
}
</script>

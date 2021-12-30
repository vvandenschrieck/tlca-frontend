<template>
  <v-navigation-drawer permanent app fixed disable-resize-watcher expand-on-hover clipped :mini-variant.sync="miniVariant" @mouseleave.native="hoveredItem = undefined">
    <v-row class="fill-height" no-gutters>
      <v-navigation-drawer dark mini-variant permanent>
        <v-list>
          <v-list-item-group :value="selectedSpace">
            <v-list-item v-for="(item, i) in spaces" :key="i" @mouseenter="hoveredItem = item" @change="selectItem(i)">
              <v-list-item-action>
                <v-icon>{{ item.icon }}</v-icon>
              </v-list-item-action>
              <v-list-item-content>
                <v-list-item-title v-text="item.title" />
              </v-list-item-content>
            </v-list-item>
          </v-list-item-group>
        </v-list>
      </v-navigation-drawer>
      <v-list v-show="!miniVariant" width="calc(100% - 56px)">
        <v-subheader inset>{{ hoveredSpace.title }}</v-subheader>
        <v-divider />
        <v-list-item v-for="(item, i) in hoveredSpace.sections" :key="i" :to="item.to">
          <v-list-item-content>
            <v-list-item-title v-text="item.title" />
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-row>
  </v-navigation-drawer>
</template>

<script>
export default {
  name: 'SpaceNavigator',
  data() {
    return {
      miniVariant: true,
      spaces: [{
        title: 'Home',
        icon: 'mdi-home',
        to: { name: 'index' },
        sections: [{
          title: 'Courses',
          to: { name: 'courses' }
        }, {
          title: 'Partners',
          to: { name: 'partners' }
        }]
      }, {
        title: 'Manage',
        icon: 'mdi-view-dashboard',
        to: { name: 'manage' },
        sections: [{
          title: 'Courses',
          to: { name: 'manage-courses' }
        }, {
          title: 'Competencies',
          to: { name: 'manage-competencies' }
        }]
      }, {
        title: 'Teach',
        icon: 'mdi-human-male-board',
        to: { name: 'teach' },
        sections: [{
          title: 'Courses',
          to: { name: 'teach-courses' }
        }]
      }, {
        title: 'Learn',
        icon: 'mdi-school',
        to: { name: 'learn' },
        sections: [{
          title: 'Courses',
          to: { name: 'learn-courses' }
        }]
      }],
      hoveredItem: undefined
    }
  },
  computed: {
    hoveredSpace() {
      return this.hoveredItem ?? this.spaces[this.selectedSpace];
    },
    selectedSpace() {
      const spaces = ['/manage', '/teach', '/learn'];
      const path = this.$route.path;

      for (const [i, space] of spaces.entries()) {
        if (path.startsWith(space)) {
          return i + 1;
        }
      }
      return 0;
    }
  },
  methods: {
    selectItem(index) {
      this.$router.push(this.spaces[index].to);
    }
  }
}
</script>

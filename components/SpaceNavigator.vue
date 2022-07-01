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
              v-for="(item, i) in spaces"
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
      return this.hoveredItem ?? this.spaces[this.selectedSpace]
    },
    selectedSpace() {
      const spaces = ['/manage', '/teach', '/learn']
      const path = this.$route.path

      for (const [i, space] of spaces.entries()) {
        if (path.startsWith(space)) {
          return i + 1
        }
      }
      return 0
    },
    spaces() {
      const spaces = [
        {
          title: 'global.spaces.home',
          icon: 'mdi-home',
          to: { name: 'index' },
          show: true,
          sections: [
            { title: 'course._', to: { name: 'courses' } },
            { title: 'program._', to: { name: 'programs' } },
            { title: 'partner._', to: { name: 'partners' } },
          ],
        },
        {
          title: 'global.spaces.manage',
          icon: 'mdi-view-dashboard',
          to: { name: 'manage' },
          show: this.hasAnyRoles(['manager', 'teacher']),
          sections: [
            {
              title: 'course._',
              to: { name: 'manage-courses' },
              show: 'teacher',
            },
            {
              title: 'competency._',
              to: { name: 'manage-competencies' },
              show: 'teacher',
            },
            {
              title: 'partner._',
              to: { name: 'manage-partners' },
              show: 'manager',
            },
          ],
        },
        {
          title: 'global.spaces.teach',
          icon: 'mdi-human-male-board',
          to: { name: 'teach' },
          show: this.hasRole('teacher'),
          sections: [{ title: 'course._', to: { name: 'teach-courses' } }],
        },
        {
          title: 'global.spaces.learn',
          icon: 'mdi-school',
          to: { name: 'learn' },
          show: this.hasRole('student'),
          sections: [{ title: 'course._', to: { name: 'learn-courses' } }],
        },
        {
          title: 'global.spaces.admin',
          icon: 'mdi-account-cog',
          to: { name: 'admin' },
          show: this.hasRole('admin'),
          sections: [
            { title: 'course._', to: { name: 'admin-courses' } },
            { title: 'competency._', to: { name: 'admin-competencies' } },
            { title: 'partner._', to: { name: 'admin-partners' } },
            { title: 'user._', to: { name: 'admin-users' } },
          ],
        },
      ]
      return spaces
        .filter((space) => space.show)
        .map((space) => ({
          ...space,
          sections: space.sections.filter(
            (section) => !section.show || this.hasRole(section.show)
          ),
        }))
    },
  },
  methods: {
    selectItem(index) {
      this.$router.push(this.spaces[index].to)
    },
  },
}
</script>

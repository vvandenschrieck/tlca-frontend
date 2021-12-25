<template>
  <v-app dark>
    <v-navigation-drawer
      v-model="drawer"
      disable-resize-watcher
      fixed
      app
    >
      <v-list>
        <v-list-item
          v-for="(item, i) in items"
          :key="i"
          :to="item.to"
          router
          exact
        >
          <v-list-item-action>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title v-text="item.title" />
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    <v-app-bar fixed app>
      <v-app-bar-nav-icon @click.stop="drawer = !drawer" />
      <v-toolbar-title v-text="title" />
      <v-spacer />
    </v-app-bar>
    <v-main>
      <v-container>
        <Nuxt />
      </v-container>
    </v-main>
    <v-footer absolute app>
      <span>{{ $t('global.powered_by') }} AEI Consulting – v1.1.1.</span>
      <v-spacer />
      <div>
        <language-switcher />
      </div>
    </v-footer>
  </v-app>
</template>

<script>
import LanguageSwitcher from '~/components/LanguageSwitcher.vue'
export default {
  name: 'DefaultLayout',
  components: { LanguageSwitcher },
  data() {
    return {
      drawer: false,
      items: [
        {
          icon: 'mdi-apps',
          title: 'Welcome',
          to: '/',
        },
        {
          icon: 'mdi-chart-bubble',
          title: 'Inspire',
          to: '/inspire',
        },
      ],
      title: 'TLCA',
    }
  },
}
</script>

<template>
  <v-select v-model="currentLocale" :items="availableLocales" dense solo hide-details item-text="name" item-value="code">
    <template #selection="{ item }">
      <v-list-item dense>
        <v-list-item-content><v-list-item-title>{{ item.name }}</v-list-item-title></v-list-item-content>
      </v-list-item>
    </template>
    <template #item="{ item, on, attrs }">
      <v-list-item dense v-bind="attrs" v-on="on">
        <v-list-item-avatar size="20"><v-img :src="`/flags/${item.code}.png`" /></v-list-item-avatar>
        <v-list-item-content><v-list-item-title>{{ item.name }}</v-list-item-title></v-list-item-content>
      </v-list-item>
    </template>
  </v-select>
</template>

<script>
export default {
  name: 'LanguageSwitcher',
  computed: {
    availableLocales() {
      return this.$i18n.locales;
    },
    currentLocale: {
      get() {
        return this.$i18n.locale;
      },
      set(value) {
        this.$i18n.setLocale(value);
      },
    }
  }
}
</script>

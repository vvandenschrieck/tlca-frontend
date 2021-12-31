<template>
  <card-list :name="name" :component="component" :items="items">
    <template #append>
      <div align="center" class="py-8">
        <v-btn :to="{ name: name }">{{ $t(`homepage.see_all_${name}`) }}</v-btn>
      </div>
    </template>
  </card-list>
</template>

<script>
import CardList from '~/components/cards/CardList.vue';

export default {
  name: 'TabList',
  components: { CardList },
  props: {
    component: {
      type: Object,
      required: true
    },
    name: {
      type: String,
      required: true
    },
    items: {
      type: Array,
      default: undefined
    },
  }
}
</script>

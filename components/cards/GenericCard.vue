<template>
  <v-hover v-slot="{ hover }">
    <v-card :to="to" :elevation="hover ? 12 : 2">
      <v-img :src="innerBanner">
        <div v-if="label" id="type">
          <span class="label-default">{{ label }}</span>
        </div>
      </v-img>
      <slot></slot>
    </v-card>
  </v-hover>
</template>

<script>
export default {
  name: 'GenericCard',
  props: {
    banner: {
      type: String,
      default: undefined,
    },
    label: {
      type: String,
      default: undefined,
    },
    to: {
      type: Object,
      required: true,
    },
  },
  computed: {
    innerBanner() {
      return this.banner ?? '/default-banner.png'
    },
  },
}
</script>

<style scoped>
#type {
  bottom: 0px;
  margin: 0px 10px 10px 0;
  position: absolute;
  right: 0px;
}
span.label-default {
  background-color: #777;
  border-radius: 0.25em;
  color: #fff;
  font-size: 75%;
  padding: 0.2em 0.6em 0.3em;
}
</style>

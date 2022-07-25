<template>
  <v-hover v-slot="{ hover: isHoverCard }">
    <v-card :elevation="isHoverCard ? 12 : 2" :to="to">
      <banner-image :src="banner" :options="bannerEditOptions">
        <div v-if="label" id="label">
          <span class="label-default">{{ label }}</span>
        </div>
      </banner-image>

      <slot />
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
    bannerEditOptions: {
      type: Object,
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
}
</script>

<style scoped>
#label {
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

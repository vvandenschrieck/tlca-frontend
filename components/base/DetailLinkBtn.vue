<template>
  <v-tooltip bottom open-delay="500">
    <template #activator="{ on, attrs }">
      <v-btn exact icon small :to="to" v-bind="attrs" v-on="on">
        <v-icon small>mdi-information</v-icon>
      </v-btn>
    </template>
    <span>{{ $t('general.details') }}</span>
  </v-tooltip>
</template>

<script>
export default {
  name: 'DetailLinkBtn',
  props: {
    to: {
      type: Object,
      required: true,
    },
  },
}
</script>

<template>
  <v-btn color="primary" text v-bind="$attrs" v-on="$listeners">
    {{ $t('general.correct') }}
  </v-btn>
</template>

<script>
export default {
  name: 'CorrectBtn',
}
</script>

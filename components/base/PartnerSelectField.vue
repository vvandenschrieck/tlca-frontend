<template>
  <ApolloQuery
    :query="require('~/gql/getPartners.gql')"
    :update="(data) => data.partners"
  >
    <template #default="{ result: { error, data: partners }, isLoading }">
      <v-autocomplete
        v-if="!error"
        chips
        clearable
        deletable-chips
        dense
        :disabled="disabled || isLoading !== 0"
        :items="partners"
        :item-text="(p) => p.abbreviation || p.name"
        item-value="code"
        :label="$tc('partner._', 2)"
        :loading="isLoading !== 0"
        multiple
        small-chips
        :value="value"
        @input="$emit('input', $event)"
      >
        <template #item="{ item: { abbreviation, name } }">
          {{ name }}
          <span v-if="abbreviation">&nbsp;({{ abbreviation }})</span>
        </template>
      </v-autocomplete>

      <div v-else>{{ $t('error.unexpected') }}</div>
    </template>
  </ApolloQuery>
</template>

<script>
export default {
  name: 'PartnerSelectField',
  props: {
    disabled: {
      type: Boolean,
      default: false,
    },
    value: {
      type: Array,
      default: () => [],
    },
  },
}
</script>

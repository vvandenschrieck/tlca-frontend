<template>
  <div>
    <v-simple-table v-if="items?.length" dense>
      <tbody>
        <tr v-for="(item, i) in items" :key="i">
          <td class="pl-1 pr-0">{{ item.type }}</td>
          <td class="pl-2">{{ item.name }}</td>
          <td class="text-center">{{ formatFileSize(item.size) }}</td>
        </tr>

        <slot name="rows" />
      </tbody>
    </v-simple-table>

    <span v-else>{{ $t('resource.no') }}</span>
  </div>
</template>

<script>
import utils from '@/mixins/utils.js'

export default {
  name: 'ResourcesList',
  mixins: [utils],
  props: {
    items: {
      type: Array,
      default: null,
    },
  },
}
</script>

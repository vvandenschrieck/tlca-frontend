<template>
  <div>
    <v-simple-table v-if="items?.length" dense>
      <tbody>
        <tr v-for="(item, i) in items" :key="i">
          <td class="pl-1 pr-0 text-center">
            <v-tooltip v-if="item.alert" bottom open-delay="500">
              <template #activator="{ on, attrs }">
                <v-icon color="red" small v-bind="attrs" v-on="on">
                  mdi-alert
                </v-icon>
              </template>

              <span>{{ item.alert }}</span>
            </v-tooltip>
          </td>
          <td class="pl-2">{{ item.text }}</td>
          <td class="text-center">
            <v-chip v-if="item.chip" :color="item.color" small>
              {{ item.value }}
            </v-chip>
            <span v-else>{{ item.value }}</span>
          </td>
        </tr>

        <slot name="rows" />
      </tbody>
    </v-simple-table>

    <span v-else>{{ $t(`${entity}.no`) }}</span>
  </div>
</template>

<script>
export default {
  name: 'StatsList',
  props: {
    entity: {
      type: String,
      required: true,
    },
    items: {
      type: Array,
      default: null,
    },
  },
}
</script>

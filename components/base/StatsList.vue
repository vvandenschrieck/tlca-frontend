<template>
  <div>
    <v-simple-table v-if="stats?.length" dense>
      <tbody>
        <tr v-for="(stat, i) in stats" :key="i">
          <td class="pl-1 pr-0 text-center">
            <v-tooltip v-if="stat.alert" bottom open-delay="500">
              <template #activator="{ on, attrs }">
                <v-icon color="red" small v-bind="attrs" v-on="on">
                  mdi-alert
                </v-icon>
              </template>

              <span>{{ stat.alert }}</span>
            </v-tooltip>
          </td>
          <td class="pl-2">{{ stat.text }}</td>
          <td class="text-center">{{ stat.value }}</td>
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
    stats: {
      type: Array,
      default: null,
    },
  },
}
</script>

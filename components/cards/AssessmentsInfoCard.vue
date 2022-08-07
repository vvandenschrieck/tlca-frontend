<template>
  <generic-info-card
    icon="mdi-clipboard"
    :link="{
      icon: 'mdi-view-list',
      text: $t('general.list'),
      to: {
        name: 'manage-courses-code-assessments',
        params: { code: course.code },
      },
    }"
    :title="$tc('assessment._', 2)"
  >
    <div v-if="course.assessments?.length">
      <v-simple-table dense>
        <tbody>
          <tr>
            <td class="pa-0 text-center"></td>
            <td class="pl-2">{{ $tc('assessment._', 2) }}</td>
            <td class="text-center">{{ course.assessments.length }}</td>
          </tr>
        </tbody>
      </v-simple-table>
    </div>

    <span v-else>{{ $t('assessment.no') }}</span>
  </generic-info-card>
</template>

<script>
export default {
  name: 'RegistrationsInfoCard',
  props: {
    course: {
      type: Object,
      required: true,
    },
  },
}
</script>

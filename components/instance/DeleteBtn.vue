<template>
  <ApolloMutation
    v-slot="{ mutate, loading }"
    :mutation="require('~/gql/admin/deleteInstance.gql')"
    tag="span"
    :variables="{ id: instanceId }"
    @done="success"
  >
    <confirm-dialog
      ref="dialog"
      v-slot="{ on, attrs }"
      :action="$t('general.delete')"
      :loading="loading"
      :text="$t('instance.delete.dialog_instructions')"
      @confirm="mutate"
    >
      <v-btn icon small v-bind="attrs" v-on="on">
        <v-icon small>mdi-delete</v-icon>
      </v-btn>
    </confirm-dialog>
  </ApolloMutation>
</template>

<script>
export default {
  name: 'InstanceDeleteBtn',
  props: {
    instanceId: {
      type: String,
      required: true,
    },
  },
  methods: {
    success({ data: { deleteInstance } }) {
      this.$refs.dialog.close()
      this.$emit(deleteInstance ? 'success' : 'error')
    },
  },
}
</script>

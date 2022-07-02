<template>
  <div>
    <bread-crumb
      :items="navItems('manage', 'competency', $t('general.create'))"
    />

    <h2 v-t="'competency.create'"></h2>

    <v-form>
      <v-stepper non-linear vertical>
        <v-stepper-step editable step="1">{{
          $t('general.information.general')
        }}</v-stepper-step>

        <v-stepper-content step="1">
          <v-row>
            <v-col cols="12" md="3">
              <v-text-field
                v-model="code"
                :label="$t('competency.code')"
                required
              ></v-text-field>
            </v-col>

            <v-col cols="12" md="9">
              <v-text-field
                v-model="name"
                :label="$t('competency.name')"
                required
              ></v-text-field>
            </v-col>
          </v-row>

          <v-row>
            <v-col cols="12" md="12">
              <v-textarea
                v-model="description"
                :label="$t('competency.description')"
                filled
                auto-grow
                clearable
                clear-icon="mdi-close-circle"
              ></v-textarea>
            </v-col>
          </v-row>
        </v-stepper-content>

        <v-stepper-step editable step="2">{{
          $t('general.information.additional')
        }}</v-stepper-step>

        <v-stepper-content step="2">
          <v-row>
            <v-col cols="12" md="6">
              <v-select
                v-model="type"
                :items="types"
                :label="$t('competency.type._')"
              ></v-select>
            </v-col>
          </v-row>

          <v-row>
            <v-col cols="12" md="6">
              <v-switch
                v-model="isPublic"
                :label="$t('competency.visibility.public')"
              ></v-switch>
            </v-col>
          </v-row>

          <v-row>
            <v-col cols="12" md="6">
              <v-select
                v-model="partners"
                :items="partnersList"
                :label="$t('competency.partners')"
              ></v-select>
            </v-col>
          </v-row>
        </v-stepper-content>

        <v-stepper-step editable step="3">{{
          $t('competency.learning_outcomes._')
        }}</v-stepper-step>

        <v-stepper-content step="3">
          <v-alert type="info" dense outlined>Upcoming feature</v-alert>
        </v-stepper-content>
      </v-stepper>
      <div class="text-right mt-5">
        <v-btn
          v-t="'general.cancel'"
          :disabled="formBusy"
          color="error"
          text
          @click="cancel()"
        ></v-btn>
        <v-btn
          v-t="'general.create'"
          type="submit"
          :loading="formBusy"
          color="primary"
          text
        ></v-btn>
      </div>
    </v-form>
  </div>
</template>

<script>
import breadcrumb from '@/mixins/breadcrumb.js'

export default {
  name: 'ManageCreateCompetencyPage',
  mixins: [breadcrumb],
  data() {
    return {
      code: '',
      description: '',
      error: null,
      formBusy: false,
      name: '',
      partners: [],
      partnersList: [],
      isPublic: false,
      type: '',
    }
  },
  computed: {
    types() {
      return [
        { text: this.$t('competency.type.practical'), value: 'practical' },
        { text: this.$t('competency.type.theoretical'), value: 'theoretical' },
      ]
    },
  },
  methods: {
    cancel() {
      this.code = ''
      this.description = ''
      this.error = null
      this.name = ''
      this.partners = []
      this.isPublic = false
      this.type = ''
    },
  },
  meta: {
    roles: ['teacher'],
  },
}
</script>

<template>
  <v-hover v-slot="{ hover }">
    <v-img :src="innerPath">
      <div v-if="options && hover">
        <v-btn id="img-add-btn" icon small @click.prevent="showDialog">
          <v-icon small>mdi-camera-plus</v-icon>
        </v-btn>
      </div>

      <v-dialog v-model="dialog" width="500" @click:outside="cancel">
        <v-card>
          <v-card-title class="text-h5 grey lighten-2">
            {{ $t('global.banner.edit') }}
          </v-card-title>

          <v-card-text class="mt-5">
            <image-chooser-field v-model="image" />
          </v-card-text>

          <v-card-actions>
            <v-spacer />

            <ApolloMutation
              :mutation="require('../../gql/updateBanner.gql')"
              :variables="{ ...options, ...image }"
              @done="updated"
            >
              <template #default="{ loading, mutate }">
                <v-btn color="error" :disabled="loading" text @click="cancel">
                  {{ $t('general.cancel') }}
                </v-btn>
                <v-btn
                  color="primary"
                  :disabled="!image"
                  :loading="loading"
                  text
                  @click="mutate"
                >
                  {{ $t('general.update') }}
                </v-btn>
              </template>
            </ApolloMutation>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <slot />
    </v-img>
  </v-hover>
</template>

<script>
import { gql } from 'graphql-tag'

export default {
  name: 'GenericCard',
  props: {
    src: {
      type: String,
      default: undefined,
    },
    options: {
      type: Object,
      default: undefined,
    },
  },
  data() {
    return {
      image: null,
      dialog: false,
      path: null,
    }
  },
  computed: {
    innerPath() {
      return this.path ?? '/default-banner.png'
    },
  },
  mounted() {
    this.path = this.src
  },
  methods: {
    updated(result) {
      const { updateBanner } = result.data

      if (updateBanner) {
        const type = this.options.type.toLowerCase()

        this.path = updateBanner.path
        this.$apolloProvider.defaultClient.writeQuery({
          query: gql`
            query UpdateBanner($code: ID!) {
              ${type}(code: $code) {
                banner
                code
              }
            }
          `,
          data: {
            [type]: {
              __typename: type.charAt(0).toUpperCase() + type.slice(1),
              banner: updateBanner.path,
              code: this.options.code,
            },
          },
          variables: { code: this.options.code },
        })

        this.cancel()
        this.$notificationManager.displaySuccessMessage(
          this.$t('success.BANNER_UPDATED')
        )
      } else {
        this.$notificationManager.displayErrorMessage(
          this.$t('error.BANNER_UPDATE_ERROR')
        )
      }
    },
    cancel() {
      this.image = null
      this.dialog = false
    },
    showDialog() {
      this.dialog = true
    },
  },
}
</script>

<style scoped>
#img-add-btn {
  bottom: 0px;
  left: 0px;
  margin: 0px 0px 5px 10px;
  position: absolute;
}
</style>

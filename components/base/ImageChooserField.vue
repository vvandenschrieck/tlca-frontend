<template>
  <v-col>
    <v-row
      v-if="bannerPreviewImg"
      class="text-center"
      style="position: relative"
    >
      <cropper
        :auto-zoom="true"
        class="cropper ma-auto"
        :src="bannerPreviewImg"
        :stencil-props="{
          aspectRatio: 378 / 224,
        }"
        @change="updateCoordinates"
      />
      <v-btn
        id="remove-btn"
        class="error rounded-circle"
        icon
        small
        @click="removePreview"
      >
        <v-icon color="white" small>mdi-close</v-icon>
      </v-btn>
    </v-row>
    <v-row v-if="!bannerPreviewImg">
      <div
        id="upload-area"
        @click="openFileSelector"
        @dragleave.prevent=""
        @dragover.prevent=""
        @dragenter.prevent=""
        @drop.prevent="loadFile"
      >
        <v-icon size="64">mdi-tray-arrow-up</v-icon>
        <div>{{ $t('general.upload_click_drag') }}</div>
      </div>
      <v-file-input
        v-show="false"
        ref="fileSelector"
        accept="image/*"
        truncate-length="30"
        @change="updatePreview"
      />
    </v-row>
  </v-col>
</template>

<script>
import { Cropper } from 'vue-advanced-cropper'
import 'vue-advanced-cropper/dist/style.css'

export default {
  name: 'ImageChooserField',
  components: { Cropper },
  inheritAttrs: false,
  props: {
    value: {
      type: Object,
      default: null,
    },
  },
  data() {
    return {
      bannerPreviewImg: '',
    }
  },
  watch: {
    value: {
      handler(value) {
        if (value == null) {
          this.removePreview()
        }
      },
      immediate: true,
    },
  },
  methods: {
    loadFile($event) {
      const files = $event.target.files || $event.dataTransfer.files
      if (files[0].type.includes('image')) {
        this.updatePreview(files[0])
      }
    },
    openFileSelector() {
      this.$refs.fileSelector.$refs.input.click()
    },
    removePreview() {
      this.bannerPreviewImg = ''
      this.$emit('input', null)
    },
    updateCoordinates({ canvas }) {
      const dataURLimage = canvas.toDataURL()
      this.$emit('input', {
        ...this.value,
        image: dataURLimage.slice(dataURLimage.indexOf(',')),
      })
    },
    updatePreview(file) {
      this.removePreview()
      if (file) {
        const reader = new window.FileReader()
        reader.onload = (e) => {
          this.bannerPreviewImg = e.target.result
        }
        reader.readAsDataURL(file)

        this.$emit('input', { ...this.value, name: file.name })
      }
    },
  },
}
</script>

<style scoped>
.cropper {
  height: 300px;
  width: 480px;
}
#remove-btn {
  position: absolute;
  right: 10px;
  top: 10px;
}
#upload-area {
  border: 2px dashed #aaa;
  border-radius: 4px;
  text-align: center;
  padding: 40px;
  width: 100%;
}
</style>

export default {
  methods: {
    capitalise(str) {
      return str.charAt(0).toUpperCase() + str.slice(1)
    },
    downloadFile(result) {
      const element = document.createElement('a')
      element.setAttribute(
        'href',
        `data:${result.type};base64,${result.content}`
      )
      element.setAttribute('download', result.filename)
      element.style.display = 'none'
      document.body.appendChild(element)
      element.click()
      document.body.removeChild(element)
    },
    formatFileSize(size) {
      const units = ['B', 'KiB', 'MiB', 'GiB']
      for (const unit of units) {
        if (size < 1024) {
          return `${size.toFixed(2)} ${this.$t(`general.size_units.${unit}`)}`
        }
        size /= 1024
      }
    },
    newArray(length, value) {
      return Array.from({ length: length ?? 0 }, () => value)
    },
  },
}

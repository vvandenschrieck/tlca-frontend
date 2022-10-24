export default {
  methods: {
    capitalise(str) {
      return str.charAt(0).toUpperCase() + str.slice(1)
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
  },
}

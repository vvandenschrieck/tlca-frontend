export default {
  watch: {
    value: {
      handler(value) {
        this.innerValue = { ...this.defaultValue, ...value }
      },
      immediate: true,
    },
  },
  methods: {
    update() {
      const newValue = Object.entries(this.innerValue).reduce(
        (acc, [k, v]) =>
          v !== this.defaultValue[k] ? { ...acc, [k]: v } : acc,
        {}
      )
      this.$emit('input', newValue)
    },
  },
}

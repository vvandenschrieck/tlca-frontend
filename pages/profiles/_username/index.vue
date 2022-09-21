<template>
  <div>
    <h2>{{ title }}</h2>

    <actions-menu
      :edit-link="{
        name: 'profiles-username-edit',
        params: { username },
      }"
    />
  </div>
</template>

<script>
export default {
  name: 'UserPage',
  head() {
    return {
      title: this.title,
    }
  },
  computed: {
    title() {
      return this.username
    },
    username() {
      return this.$route.params.username
    },
  },
  meta: {
    roles: ['user'],
  },
}
</script>

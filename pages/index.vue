<template>
  <v-row justify="center" align="center">
    <v-col cols="12" sm="8" md="6">
      <course-card :course="course" />
    </v-col>
  </v-row>
</template>

<script>
export default {
  name: 'IndexPage',
  data() {
    return {
      course: {
        code: 'SE410µ',
        name: 'Gestion sécurisée des entrées des systèmes logiciels',
        banner: 'https://www.tlca.eu/modules/courses/client/img/banner/uploads/5fc3b83e6c4fb97907544e98.jpg',
        type: 'training'
      }
    }
  }
}
</script>

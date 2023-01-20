<template>
  <v-app>
    <v-main>
      <FormPrueba/>
      <!-- <FormSat /> -->
    </v-main>
  </v-app>
</template>

<script>
/* import FormSat from "./components/FormSat.vue";
 */import FormPrueba from "./components/FormPrueba.vue";
export default {
  name: "App",
  components: {
    FormPrueba,
    /* FormSat, */
  },
  data() {
    return {};
  },
};
</script>

<template>
  <v-app>
    <v-main>
      <FormSat />
    </v-main>
  </v-app>
</template>

<script>
import FormSat from "./components/FormSat.vue";
export default {
  name: "App",
  components: {
    FormSat,
  },
  data() {
    return {};
  },
};
</script>

<template>
  <v-form ref="form" lazy-validation>
    <v-text-field
      label="Codigo Estado"
      required
    ></v-text-field>
    <v-text-field
      label="Nombre"
      required
    ></v-text-field>
    <v-text-field
      label="Pais"
      required
    ></v-text-field>
    <v-btn color="success" class="mr-4">
      Agregar
    </v-btn>
  </v-form>
</template>
<script>
export default {
  name: "FormAdd",
  data() {
    return {};
  },
  methods: {},
};
</script>

<template>
  <v-container>
    <template class="Comprobante">
      <span>Comprobante</span>
      <v-text-field v-model="setData.id" label="Codigo" disabled></v-text-field>
      <v-combobox
        v-model="setData"
        @click="getData"
        label="Forma de Pago"
        item-text="descripcion"
        :items="data"
      ></v-combobox>
      <v-text-field label="Serie"></v-text-field>
      <v-text-field label="Folio"></v-text-field>
      <v-text-field label="Condiciones de Pago"></v-text-field>
      <v-text-field label="SubTotal"></v-text-field>
      <v-text-field label="Descuento"></v-text-field>
      <v-text-field label="Moneda"></v-text-field>
      <v-text-field label="Tipo de Cambio"></v-text-field>
      <v-text-field label="Total"></v-text-field>
      <v-text-field label="Tipo de Comprobante"></v-text-field>
      <v-text-field label="Exportación"></v-text-field>
      <v-text-field label="Metodo de Pago"></v-text-field>
      <v-text-field label="Lugar de Expedición"></v-text-field>
      <v-text-field label="Confirmación"></v-text-field>
    </template>
    <template class="informacionGlobal"></template>
  </v-container>
</template>

<script>
import axios from "axios";

export default {
  name: "HomeView",
  data() {
    return {
      setData: "",
      data: [],
      result: {},
    };
  },

  methods: {
    getData() {
      axios.get("http://localhost:8081/FormaPago").then((response) => {
        this.result = response.data;
        this.data = this.result;
      });
    },
  },
};
</script>

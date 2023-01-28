<template>
  <v-container>
    <v-data-table :search="search" :headers="headers" :items="desserts" class="elevation-1">
      <template v-slot:top>
        <v-toolbar flat>
          <v-toolbar-title>Tasa o Cuota</v-toolbar-title>
          <v-divider class="mx-6" inset vertical></v-divider>
          <template>
            <v-dialog v-model="dialog" max-width="500px">
              <template v-slot:activator="{ on, attrs }">
                <v-btn color="success" dark v-bind="attrs" v-on="on">
                  <v-icon>mdi-plus</v-icon>
                </v-btn>
                <v-divider class="mx-6" inset vertical></v-divider>
                <v-text-field v-model="search" append-icon="mdi-magnify" label="Buscar" hide-details>
                </v-text-field>
              </template>
              <v-card>
                <v-card-title>
                  <span class="text-h5">{{ formTitle }}</span>
                </v-card-title>
                <v-card-text>
                  <v-container>
                    <v-form ref="form" v-model="valid" lazy-validation>
                      <v-text-field label="Rango o Fijo" v-model="editedItem.rangofijo"></v-text-field>
                      <v-text-field label="Valor Minimo" v-model="editedItem.minimo"></v-text-field>
                      <v-text-field label="Valor Maximo" v-model="editedItem.maximo"></v-text-field>
                      <v-text-field label="Impuesto" v-model="editedItem.impuesto"></v-text-field>
                      <v-text-field label="Factor" v-model="editedItem.factor"></v-text-field>
                      <v-text-field label="Traslado" v-model="editedItem.traslado"></v-text-field>
                      <v-text-field label="Retencion" v-model="editedItem.retencion"></v-text-field>
                      <v-switch label="Status" v-model="editedItem.status" required></v-switch>
                    </v-form>
                  </v-container>
                </v-card-text>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn color="blue darken-1" text @click="close">
                    Cancelar
                  </v-btn>
                  <v-btn color="blue darken-1" text @click="saveData">
                    {{ formTitle }}
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
          </template>
        </v-toolbar>
      </template>
      <template v-slot:[`item.actions`]="{ item }">
        <v-btn class="mr-3" elevation="1" color="primary" fab tile x-small @click="editItem(item)">
          <v-icon small> mdi-pencil </v-icon>
        </v-btn>
        <v-btn elevation="1" color="error" fab tile x-small @click="deleteMapping(item.id)">
          <v-icon small> mdi-delete </v-icon>
        </v-btn>
      </template>
    </v-data-table>
  </v-container>
</template>

<script>
import axios from "axios";
/* import ModalAdd from "./ModalAdd.vue"; */

export default {
  name: "TablaTasaCuota",
  data: () => ({
    search: "",
    valid: "true",
    headers: [
      {
        text: "Rango O Fijo",
        align: "start",
        value: "rangofijo",
        sortable: false,
      },
      { text: "Valor Minimo", value: "minimo", sortable: false },
      { text: "Valor Maximo", value: "maximo", sortable: false },
      { text: "Impuesto", value: "impuesto", sortable: false },
      { text: "Factor", value: "factor", sortable: false },
      { text: "Traslado", value: "traslado", sortable: false },
      { text: "Retencion", value: "retencion", sortable: false },
      { text: "Status", value: "status", sortable: false },
      { text: "Actions", value: "actions", sortable: false },
    ],
    titleTable: "Aduana",
    desserts: [],
    result: [],
    dialog: false,
    dialogDelete: false,
    editedIndex: -1,
    editedItem: [{
      rangofijo: "",
      minimo: "",
      maximo: "",
      impuesto: "",
      factor: "",
      traslado: "",
      retencion: "",
      status: "",
    }],
    defaultItem: {},

  }), created() {
    this.showData();
  },
  watch: {
    dialog(val) {
      val || this.close();
    },
    dialogDelete(val) {
      val || this.closeDelete();
    },
  },
  computed: {
    formTitle() {
      return this.editedIndex === -1 ? "Agregar" : "Editar";
    },
  },
  methods: {
    showData() {
      this.desserts.length = "";
      axios
        .get("http://localhost:8081/TasaoCuota")
        .then((response) => {
          this.result = response.data.data;
          //console.log(response.data);
          for (let i = 0; i < response.data.length; i++) {
            this.desserts.push({
              rangofijo: response.data[i].rangoFijo,
              minimo: response.data[i].valorMinimo,
              maximo: response.data[i].valorMaximo,
              impuesto: response.data[i].impuesto,
              factor: response.data[i].factor,
              traslado: response.data[i].traslado,
              retencion: response.data[i].retencion,
              status: response.data[i].status,
            });
          }
        })
    },
    saveData: function () {
      // let selectTabla = this.tablasD[this.tablaData];
      if (this.editedIndex > -1) {
        axios
          .put(
            "http://localhost:8081/TasaoCuota/" + this.editedItem.id,
            {
              rangoFijo: this.editedItem.rangofijo,
              valorMinimo: this.editedItem.minimo,
              valorMaximo: this.editedItem.maximo,
              impuesto: this.editedItem.impuesto,
              factor: this.editedItem.factor,
              traslado: this.editedItem.traslado,
              retencion: this.editedItem.retencion,
              status: this.editedItem.status,
            }
          )
          .then(() => {
            // console.log(response);
            this.showData();
            this.close();
          });
      } else {
        axios
          .post("http://localhost:8081/TasaoCuota", {
            rangoFijo: this.editedItem.rangofijo,
            valorMinimo: this.editedItem.minimo,
            valorMaximo: this.editedItem.maximo,
            impuesto: this.editedItem.impuesto,
            factor: this.editedItem.factor,
            traslado: this.editedItem.traslado,
            retencion: this.editedItem.retencion,
            status: this.editedItem.status,
          })
          .then(() => {
            // console.log(response);
            this.showData();
            this.close();
          });
      }
    },
    deleteMapping: function (id) {
      console.log(id)
      axios
        .delete("http://localhost:8081/TasaoCuota/" + id)
        .then(() => {
          this.showData();
        });
    },
    close() {
      this.dialog = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      });
    },
    editItem(item) {
      this.editedIndex = this.desserts.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialog = true;
    },
    validate() {
      this.$refs.form.validate();
    },
  }
};
</script>

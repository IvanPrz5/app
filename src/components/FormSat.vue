<template>
  <v-container>
    <v-overflow-btn class="my-2" label="Aduana" v-model="tablaData" :items="tablas" @change="showData"></v-overflow-btn>
    <v-data-table :search="search" :headers="headers" :items="desserts" class="elevation-1">
      <template v-slot:top>
        <v-toolbar flat>
          <v-toolbar-title>{{ titleTable }}</v-toolbar-title>
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
                      <v-row>
                        <v-col cols="12" sm="6" md="4">
                          <v-text-field label="Codigo" v-model="editedItem.codigo" required></v-text-field>
                        </v-col>
                        <v-col cols="12" sm="6" md="4">
                          <v-text-field label="Descripcion" v-model="editedItem.descripcion" required></v-text-field>
                        </v-col>
                        <v-col cols="12" sm="6" md="4">
                          <v-switch label="Status" v-model="editedItem.status" required></v-switch>
                        </v-col>
                      </v-row>
                    </v-form>
                  </v-container>
                </v-card-text>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn color="blue darken-1" text @click="close">
                    Cancelar
                  </v-btn>
                  <v-btn color="blue darken-1" text @click="saveData">
                    Continuar
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
        <v-btn elevation="1" color="error" fab tile x-small @click="deleteMapping(item.codigo)">
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
  name: "FormSat",
  data: () => ({
    search: "",
    valid: true,
    headers: [
      {
        text: "ID",
        align: "start",
        value: "codigo",
        sortable: false,
      },
      { text: "Descripción", value: "descripcion", sortable: false },
      { text: "Status", value: "status", sortable: false },
      { text: "Opciones", value: "actions", sortable: false },
    ],
    titleTable: "Aduana",
    desserts: [],
    result: {},
    dialog: false,
    dialogDelete: false,
    editedIndex: -1,
    editedItem: [
      {
        codigo: "",
        descripcion: "",
        status: "",
      },
    ],
    defaultItem: {},
    tablaData: "Aduana",
    tablas: [
      "Aduana",
      "Exportacion",
      "Meses",
      "MetodoPago",
      "Moneda",
      "ObjetoImpuesto",
      "Pais",
      "Periodicidad",
      "TipoComprobante",
      "TipoRelacion",
    ],
    tablasD: {
      Aduana: "Aduana",
      Exportacion: "Exportacion",
      Meses: "Meses",
      MetodoPago: "MetodoPago",
      Moneda: "Moneda",
      Pais: "Pais",
      Periodicidad: "Periodicidad",
      TipoComprobante: "TipoComprobante",
      TipoRelacion: "TipoRelacion",
      ObjetoImpuesto: "ObjetoImp",
    },
    tablasTitle: {
      Aduana: "Aduana",
      Exportacion: "Exportacion",
      Meses: "Meses",
      MetodoPago: "Metodo De Pago",
      Moneda: "Moneda",
      Pais: "Pais",
      Periodicidad: "Periodicidad",
      TipoComprobante: "Tipo De Comprobante",
      TipoRelacion: "Tipo De Relacion",
      ObjetoImpuesto: "Impuesto Al Objeto",
    },
  }),
  created() {
    this.initialize();
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
    initialize() {
      axios
        .get("http://localhost:8081/Aduana")
        .then((response) => {
          this.result = response.data.data;
          //console.log(response.data);
          for (let i = 0; i < response.data.length; i++) {
            this.desserts.push({
              codigo: response.data[i].id,
              descripcion: response.data[i].descripcion,
              status: response.data[i].status,
            });
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    showData() {
      let selectTabla = this.tablasD[this.tablaData];
      this.desserts.length = "";
      this.titleTable = this.tablasTitle[this.tablaData];
      axios.get("http://localhost:8081/" + selectTabla).then((response) => {
        this.result = response.data.data;
        for (let i = 0; i < response.data.length; i++) {
          this.desserts.push({
            codigo: response.data[i].id,
            descripcion: response.data[i].descripcion,
            status: response.data[i].status,
          });
        }
      });
    },
    saveData: function () {
      let selectTabla = this.tablasD[this.tablaData];
      // || this.id != "" || this.id != null
      //console.log(this.editedItem.codigo);
      if (this.editedIndex > -1) {
        axios
          .put(
            "http://localhost:8081/" +
            selectTabla +
            "/" +
            this.editedItem.codigo,
            {
              id: this.editedItem.codigo,
              descripcion: this.editedItem.descripcion,
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
          .post("http://localhost:8081/" + selectTabla, {
            id: this.editedItem.codigo,
            descripcion: this.editedItem.descripcion,
            status: this.editedItem.status,
          })
          .then(() => {
            // console.log(response);
            this.showData();
            this.close();
          });
      }
    },
    deleteMapping: function (codigo) {
      //console.log(codigo);
      let selectTabla = this.tablasD[this.tablaData];
      axios
        .delete("http://localhost:8081/" + selectTabla + "/" + codigo)
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
  },
};
</script>

<style>

</style>

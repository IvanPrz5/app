<template>
  <v-container>
    <v-overflow-btn class="my-2" label="Aduana" v-model="tablaData" :items="tablas"
      @change="selectTabla"></v-overflow-btn>
    <v-data-table :search="search" :headers="headers" :items="desserts" class="elevation-1">
      <template v-slot:top>
        <v-toolbar flat>
          <v-toolbar-title>{{ titleTable }}</v-toolbar-title>
          <v-divider class="mx-15" inset vertical></v-divider>
          <v-spacer></v-spacer>
          <template>
            <v-dialog v-model="dialog" max-width="500px">
              <template v-slot:activator="{ on, attrs }">
                <v-btn color="success" dark v-bind="attrs" v-on="on">
                  <v-icon>mdi-plus</v-icon>
                </v-btn>
                <v-spacer></v-spacer>
                <v-text-field v-model="search" append-icon="mdi-magnify" label="Search" single-line hide-details>
                </v-text-field>
              </template>
              <v-card>
                <v-card-title>
                  <span class="text-h5">{{ formTitle }}</span>
                </v-card-title>
                <v-card-text>
                  <v-container>
                    <form>
                      <v-row>
                        <v-col cols="12" sm="6" md="4">
                          <v-text-field label="Codigo" v-model="editedItem.codigo"></v-text-field>
                        </v-col>
                        <v-col cols="12" sm="6" md="4">
                          <v-text-field label="Descripcion" v-model="editedItem.descripcion"></v-text-field>
                        </v-col>
                        <v-col cols="12" sm="6" md="4">
                          <v-switch label="Status" v-model="editedItem.status"></v-switch>
                        </v-col>
                      </v-row>
                    </form>
                  </v-container>
                </v-card-text>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn color="blue darken-1" text @click="close">
                    Cancelar
                  </v-btn>
                  <v-btn color="blue darken-1" text @click="selecType">
                    Continuar
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
            <v-dialog v-model="dialogDelete" max-width="500px">
              <v-card>
                <v-card-title class="text">Eliminar este elemento?</v-card-title>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn color="blue darken-1" text @click="closeDelete">Cancelar</v-btn>
                  <v-btn color="blue darken-1" text @click="deleteItemConfirm">Continuar</v-btn>
                  <v-spacer></v-spacer>
                </v-card-actions>
              </v-card>
            </v-dialog>
          </template>
        </v-toolbar>
      </template>
      <template v-slot:[`item.actions`]="{ item }">
        <v-icon small class="mr-6" @click="putMapping(item)"> mdi-pencil </v-icon>
        <v-icon small @click="deleteMapping(item.codigo)"> mdi-delete </v-icon>
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
    headers: [
      {
        text: "ID",
        align: "start",
        value: "codigo",
        sortable: false,
      },
      { text: "Descripcion", value: "descripcion", sortable: false },
      { text: "Actions", value: "actions", sortable: false },
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
    selecType(){
      return this.editedIndex === -1 ? this.postMapping : this.putMapping;
    }
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
    selectTabla() {
      this.desserts.length = "";
      let selectTabla = this.tablasD[this.tablaData];
      this.titleTable = this.tablasD[this.tablaData];
      axios
        .get("http://localhost:8081/" + selectTabla)
        .then((response) => {
          this.result = response.data.data;
          for (let i = 0; i < response.data.length; i++) {
            this.desserts.push({
              codigo: response.data[i].id,
              descripcion: response.data[i].descripcion,
              //status: response.data[i].status,
            });
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    postMapping: function () {
      let selectTabla = this.tablasD[this.tablaData];
      if (this.id != "" || this.id != null) {
        axios
          .post("http://localhost:8081/" + selectTabla, {
            id: this.editedItem.codigo,
            descripcion: this.editedItem.descripcion,
            status: this.editedItem.status,
          })
          .then((response) => {
            this.desserts.push({
              codigo: response.data.id,
              descripcion: response.data.descripcion,
              status: response.data.status,
            });
            this.close();
          });
      }
    },
    putMapping: function (codigo) {
      let selectTabla = this.tablasD[this.tablaData];
      console.log(codigo);
      console.log("http://localhost:8081/" + selectTabla + "/" + codigo);
        axios
          .post("http://localhost:8081/" + selectTabla + "/" + codigo.id, {
            id: codigo.id,
            descripcion: codigo.descripcion,
            status: codigo.status,
          })
          .then((response) => {
            this.desserts.push({
              codigo: response.data.id,
              descripcion: response.data.descripcion,
              status: response.data.status,
            });
            this.close();
          });
      
    },
    deleteMapping: function (codigo) {
      console.log(codigo)
      let selectTabla = this.tablasD[this.tablaData];
      axios.delete("http://localhost:8081/" + selectTabla + "/" + codigo);
      this.desserts.splice(this.editedIndex, 1);
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
    deleteItem(item) {
      this.editedIndex = this.desserts.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialogDelete = true;
    },
    deleteItemConfirm() {
      this.desserts.splice(this.editedIndex, 1);
      this.closeDelete();
    },
    closeDelete() {
      this.dialogDelete = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      });
    },
  },
};
</script>

<style>

</style>

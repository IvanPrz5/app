<template>
  <v-container>
    <v-overflow-btn
      class="my-2"
      label="Aduana"
      v-model="tablaData"
      :items="tablas"
      @change="selectTabla"
    ></v-overflow-btn>
    <v-data-table :headers="headers" :items="desserts" class="elevation-1">
      <template v-slot:top>
        <v-toolbar flat>
          <v-toolbar-title>{{ algo }}</v-toolbar-title>
          <v-divider class="mx-15" inset vertical></v-divider>
          <v-spacer></v-spacer>
          <template>
            <v-dialog v-model="dialog" max-width="500px">
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  color="success"
                  dark
                  v-bind="attrs"
                  v-on="on"
                  @click="postMapping"
                >
                  <v-icon>mdi-plus</v-icon>
                </v-btn>
              </template>
              <v-card>
                <v-card-title>
                  <span class="text-h5">{{ formTitle }}</span>
                </v-card-title>
                <v-card-text>
                  <v-container>
                    <v-row>
                      <v-col cols="12" sm="6" md="4">
                        <v-text-field label="Codigo"></v-text-field>
                      </v-col>
                      <v-col cols="12" sm="6" md="4">
                        <v-text-field label="Descripcion"></v-text-field>
                      </v-col>
                      <v-col cols="12" sm="6" md="4">
                        <v-text-field label="Tipo"></v-text-field>
                      </v-col>
                      <v-col cols="12" sm="6" md="4">
                        <v-text-field label="Retencion"></v-text-field>
                      </v-col>
                      <v-col cols="12" sm="6" md="4">
                        <v-text-field label="Traslado"></v-text-field>
                      </v-col>
                    </v-row>
                  </v-container>
                </v-card-text>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn color="blue darken-1" text @click="close">
                    Cancelar
                  </v-btn>
                  <v-btn color="blue darken-1" text @click="save">
                    Continuar
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
            <v-dialog v-model="dialogDelete" max-width="500px">
              <v-card>
                <v-card-title class="text"
                  >Eliminar este elemento?</v-card-title
                >
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn color="blue darken-1" text @click="closeDelete"
                    >Cancelar</v-btn
                  >
                  <v-btn color="blue darken-1" text @click="deleteItemConfirm"
                    >Continuar</v-btn
                  >
                  <v-spacer></v-spacer>
                </v-card-actions>
              </v-card>
            </v-dialog>
          </template>
        </v-toolbar>
      </template>
      <template v-slot:[`item.actions`]="{ item }">
        <v-icon small class="mr-6" @click="editItem(item)">mdi-pencil</v-icon>
        <v-icon small @click="deleteItem(item)"> mdi-delete </v-icon>
      </template>
    </v-data-table>
  </v-container>
</template>

<script>
import axios from "axios";
/* import ModalAdd from "./ModalAdd.vue"; */

export default {
  name: "FormPrueba",
  data: () => ({
    headers: [
      {
        text: "ID",
        align: "start",
        value: "codigo",
        sortable: false,
      },
      { text: "Descripcion", value: "descripcion", sortable: false },
      //{ text: "Status", value: "status", sortable: false },
      { text: "Actions", value: "actions", sortable: false },
    ],
    algo: "Aduana",
    desserts: [],
    result: [],
    dialog: false,
    dialogDelete: false,
    editedIndex: -1,
    editedItem: {},
    defaultItem: {},
    tablaData: "",
    tablas: [
      "Aduana",
      "Exportacion",
      "Meses",
      "MetodoPago",
      "Moneda",
      "Pais",
      "Periodicidad",
      "TipoComprobante",
      "TipoRelacion",
      "ObjetoImpuesto",
    ],
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
              //status: response.data[i].status,
            });
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    selectTabla() {
      let tablas = {
        Aduana: "Aduana",
        Exportacion: "Exportacion",
        Meses: "Meses",
        MetodoPago: "MetodoPago",
        Moneda:"Moneda",
        Pais: "Pais",
        Periodicidad: "Periodicidad",
        TipoComprobante: "TipoComprobante",
        TipoRelacion: "TipoRelacion",
        ObjetoImpuesto: "ObjetoImp",
      };
      this.desserts.length = "";
      let selectTabla = tablas[this.tablaData];
      //console.log(selectTabla);
      this.algo = tablas[this.tablaData];
      axios
        .get("http://localhost:8081/" + selectTabla)
        .then((response) => {
          this.result = response.data.data;
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
    postMapping() {},
    save() {
      if (this.editedIndex > -1) {
        Object.assign(this.desserts[this.editedIndex], this.editedItem);
      } else {
        this.desserts.push(this.editedItem);
      }
      this.close();
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

<style></style>

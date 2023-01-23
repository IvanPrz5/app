<template>
  <v-container>
    <v-data-table :headers="headers" :items="desserts" class="elevation-1">
      <template v-slot:top>
        <v-toolbar flat>
          <v-toolbar-title>Codigo Postal</v-toolbar-title>
          <v-divider class="mx-15" inset vertical></v-divider>
          <v-spacer></v-spacer>
          <template>
            <v-dialog v-model="dialog" max-width="500px">
              <template v-slot:activator="{ on, attrs }">
                <v-btn color="success" dark v-bind="attrs" v-on="on" @click="postMapping">
                  <v-icon>mdi-plus</v-icon>
                </v-btn>
                <v-text-field v-model="search" append-icon="mdi-magnify" label="Search" single-line
                  hide-details></v-text-field>
              </template>
              <v-card>
                <v-card-title>
                  <span class="text-h5">{{ formTitle }}</span>
                </v-card-title>
                <v-card-text>
                  <v-container>
                    <v-row @submit.prevent="save">
                      <v-col cols="12" sm="6" md="4">
                        <v-text-field label="Clave" v-model="customer.customerClave" ></v-text-field>
                      </v-col>
                      <v-col cols="12" sm="6" md="4">
                        <v-text-field label="Estado"></v-text-field>
                      </v-col>
                      <v-col cols="12" sm="6" md="4">
                        <v-text-field label="ID Municipio"></v-text-field>
                      </v-col>
                      <v-col cols="12" sm="6" md="4">
                        <v-text-field label="ID Localidad"></v-text-field>
                      </v-col>
                      <v-col cols="12" sm="6" md="4">
                        <v-text-field label="Status"></v-text-field>
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
  name: "TablaCFDI",
  data: () => ({
    headers: [
      {
        text: "Clave",
        align: "start",
        value: "clave",
        sortable: false,
      },
      { text: "Estado", value: "estado", sortable: false },
      { text: "Cod Municipio", value: "cmunicipio", sortable: false },
      { text: "Cod Localidad", value: "clocalidad", sortable: false },
      { text: "ID Municipio", value: "idmunicipio", sortable: false },
      { text: "ID Localidad", value: "idlocalidad", sortable: false },
      { text: "Actions", value: "actions", sortable: false },
    ],
    titleTable: "Aduana",
    desserts: [],
    result: [],
    dialog: false,
    dialogDelete: false,
    editedIndex: -1,
    editedItem: {},
    defaultItem: {},
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
        .get("http://localhost:8081/CodigoPostal")
        .then((response) => {
          this.result = response.data.data;
          //console.log(response.data);
          for (let i = 0; i < response.data.length; i++) {
            this.desserts.push({
              clave: response.data[i].ccodigoPostal,
              estado: response.data[i].estado.cestado,
              cmunicipio: response.data[i].municipios.cmunicipio,
              clocalidad: response.data[i].localidades.clocalidad,
              idmunicipio: response.data[i].municipios.idMunicipio,
              idlocalidad: response.data[i].localidades.idLocalidad,
              status: response.data[i].status,
            });
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    postMapping() { },
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

<template>
  <v-container>
    <v-data-table :headers="headers" :items="desserts" class="elevation-1">
      <template v-slot:top>
        <v-toolbar flat>
          <v-toolbar-title>Clave Unidad</v-toolbar-title>
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
                          <v-text-field label="ID" v-model="editedItem.id"></v-text-field>
                        </v-col>
                        <v-col cols="12" sm="6" md="4">
                          <v-text-field label="Nombre" v-model="editedItem.nombre"></v-text-field>
                        </v-col>
                        <v-col cols="12" sm="6" md="4">
                          <v-text-field label="Descripcion" v-model="editedItem.descripcion"></v-text-field>
                        </v-col>
                        <v-col cols="12" sm="6" md="4">
                          <v-text-field label="Simbolo" v-model="editedItem.simbolo"></v-text-field>
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
  name: "TablaClaveUni",
  data: () => ({
    search: "",
    valid: true,
    headers: [
      {
        text: "ID",
        align: "start",
        value: "id",
        sortable: false,
      },
      { text: "Nombre", value: "nombre", sortable: false },
      { text: "Descripcion", value: "descripcion", sortable: false },
      { text: "Simbolo", value: "simbolo", sortable: false },
      { text: "Status", value: "status", sortable: false },
      { text: "Actions", value: "actions", sortable: false },
    ],
    titleTable: "Clave Unidad",
    desserts: [],
    result: [],
    dialog: false,
    dialogDelete: false,
    editedIndex: -1,
    editedItem: [{
      id: "",
      nombre: "",
      descripcion: "",
      simbolo: "",
      status: "",
    }],
    defaultItem: [],
  }),
  created() {
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
        .get("http://localhost:8081/ClaveUnidad")
        .then((response) => {
          this.result = response.data.data;
          //console.log(response.data);
          for (let i = 0; i < response.data.length; i++) {
            this.desserts.push({
              id: response.data[i].id,
              nombre: response.data[i].nombre,
              descripcion: response.data[i].descripcion,
              simbolo: response.data[i].simbolo,
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
            "http://localhost:8081/ClaveUnidad/" + this.editedItem.id, 
            {
              id: this.editedItem.id,
              nombre: this.editedItem.nombre,
              descripcion: this.editedItem.descripcion,
              simbolo: this.editedItem.simbolo,
              status: this.editedItem.status,
            }
          )
          .then(() => {
            this.showData();
            this.close();
          });
      } else {
        axios
          .post("http://localhost:8081/ClaveUnidad", 
          {
            id: this.editedItem.id,
            nombre: this.editedItem.nombre,
            descripcion: this.editedItem.descripcion,
            simbolo: this.editedItem.simbolo,
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
      //console.log(id)
      axios
        .delete("http://localhost:8081/ClaveUnidad/" + id)
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

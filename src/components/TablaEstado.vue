<template>
    <v-container>
      <v-data-table :search="search" :headers="headers" :items="desserts" class="elevation-1">
        <template v-slot:top>
          <v-toolbar flat>
            <v-toolbar-title>Estado</v-toolbar-title>
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
                        <v-text-field label="ID" v-model="editedItem.id"></v-text-field>
                        <v-text-field label="Nombre" v-model="editedItem.estado"></v-text-field>
                        <v-text-field label="Pais" v-model="editedItem.pais"></v-text-field>
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
  
  export default {
    name: "TablaEstado",
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
        { text: "Estado", value: "estado", sortable: false },
        { text: "Pais", value: "pais", sortable: false },
        { text: "Status", value: "status"},
        { text: "Actions", value: "actions", sortable: false },
      ],
      titleTable: "Tasa o Cuota",
      desserts: [],
      result: [],
      dialog: false,
      dialogDelete: false,
      editedIndex: -1,
      editedItem: [{
        id:"",
        estado:"",
        pais:"",
        status:"",
      }],
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
          .get("http://localhost:8081/Estado")
          .then((response) => {
            this.result = response.data.data;
            //console.log(response.data);
            for (let i = 0; i < response.data.length; i++) {
              this.desserts.push({
                id: response.data[i].cestado,
                estado: response.data[i].nombreEstado,
                pais: response.data[i].pais.id,
                status: response.data[i].status
              });
            }
          })
      },
      saveData: function () {
        if (this.editedIndex > -1) {
          axios
            .put(
              "http://localhost:8081/Estado/" + this.editedItem.id,
              {
                cestado: this.editedItem.id,
                nombreEstado: this.editedItem.estado,
                pais: this.editedItem.pais,
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
            .post("http://localhost:8081/Estado", {
                cestado: this.editedItem.id,
                nombreEstado: this.editedItem.estado,
                pais: this.editedItem.pais,
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
          .delete("http://localhost:8081/Estado/" + id)
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
  
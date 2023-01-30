<template>
  <v-container>
    <LoaderComponent v-if="loading"/>
    <!-- <v-progress-circular v-if="loading" :size="50" color="primary" indeterminate></v-progress-circular> -->
    <v-data-table v-show="mostrar" :search="search" :headers="headers" :items="desserts" class="elevation-1">
      <template v-slot:top>
        <v-toolbar flat>
          <v-toolbar-title>Codigo Postal</v-toolbar-title>
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
                    <v-text-field label="ID" v-model="editedItem.id"></v-text-field>
                    <v-text-field label="Estado" v-model="editedItem.estado"></v-text-field>
                    <v-text-field label="Cod Municipio" v-model="editedItem.codmunicipio"></v-text-field>
                    <v-text-field label="Cod Localidad" v-model="editedItem.codlocalidad"></v-text-field>
                    <v-text-field label="ID Municipio" v-model="editedItem.idmunicipio"></v-text-field>
                    <v-text-field label="ID Localidad" v-model="editedItem.idlocalidad"></v-text-field>
                    <v-text-field label="Status" v-model="editedItem.status"></v-text-field>
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
            <!-- <v-dialog v-model="dialogDelete" max-width="500px">
              <v-card>
                <v-card-title class="text">Eliminar este elemento?</v-card-title>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn color="blue darken-1" text @click="closeDelete">Cancelar</v-btn>
                  <v-btn color="blue darken-1" text @click="deleteItemConfirm">Continuar</v-btn>
                  <v-spacer></v-spacer>
                </v-card-actions>
              </v-card>
            </v-dialog> -->
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
import LoaderComponent from "./LoaderComponent.vue";

export default {
  name: "TablaCodigoP",
  components:{
    LoaderComponent,
  },
  data: () => ({
    loading:true,
    mostrar:false,
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
      { text: "Cod Municipio", value: "codmunicipio", sortable: false },
      { text: "Cod Localidad", value: "codlocalidad", sortable: false },
      { text: "ID Municipio", value: "idmunicipio", sortable: false },
      { text: "ID Localidad", value: "idlocalidad", sortable: false },
      { text: "Status", value: "status", },
      { text: "Actions", value: "actions", sortable: false },
    ],
    titleTable: "Aduana",
    desserts: [],
    result: [],
    dialog: false,
    dialogDelete: false,
    editedIndex: -1,
    editedItem: [
      {
        id: "",
        estado: "",
        codmunicipio: "",
        codlocalidad: "",
        idmunicipio: "",
        idlocalidad: "",
        status: "",
      }
    ],
    defaultItem: {},
  }),
  created() {
    this.showData();
  },
  watch: {
    dialog(val) {
      val || this.close();
    },
    loading(){
      this.mostrar = true;
    }
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
        .get("http://localhost:8081/CodigoPostal")
        .then((response) => {
          this.result = response.data.data;
          //console.log(response.data);
          for (let i = 0; i < response.data.length; i++) {
            this.desserts.push({
              id: response.data[i].ccodigoPostal,
              estado: response.data[i].estado.cestado,
              codmunicipio: response.data[i].municipios.cmunicipio,
              codlocalidad: response.data[i].localidades.clocalidad,
              idmunicipio: response.data[i].municipios.idMunicipio,
              idlocalidad: response.data[i].localidades.idLocalidad,
              status: response.data[i].status,
            });
          }
          this.loading = false;
        })
    },
    //ingresar registro otra vez
    saveData: function () {
      // let selectTabla = this.tablasD[this.tablaData];
      if (this.editedIndex > -1) {
        axios
          .put(
            "http://localhost:8081/CodigoPostal/" + this.editedItem.id,
            {
              ccodigoPostal: this.editedItem.id,
              cestado: this.editedItem.estado,
              cmunicipio: this.editedItem.codmunicipio,
              clocalidad: this.editedItem.codlocalidad,
              idMunicipio: this.editedItem.idMunicipio,
              idLocalidad: this.editedItem.idLocalidad,
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
          .post("http://localhost:8081/CodigoPostal", {
            ccodigoPostal: this.editedItem.id,
            cestado: this.editedItem.estado.cestado,
            cmunicipio: this.editedItem.codmunicipio,
            clocalidad: this.editedItem.codlocalidad,
            idMunicipio: this.editedItem.idMunicipio,
            idLocalidad: this.editedItem.idLocalidad,
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
        .delete("http://localhost:8081/CodigoPostal/" + id)
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

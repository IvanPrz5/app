<template>
  <v-container>
    <LoaderComponent v-if="loading" />
    <v-data-table v-show="mostrar" :search="search" :headers="headers" :items="desserts" class="elevation-1">
      <template v-slot:top>
        <v-toolbar flat>
          <v-toolbar-title>Num. Pedimento Aduanal</v-toolbar-title>
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
                    <v-text-field label="ID" v-model="editedItem.id" v-show="false"></v-text-field>
                    <v-text-field label="Codigo Aduanal" v-model="editedItem.codigo"></v-text-field>
                    <v-text-field label="Patente" v-model="editedItem.patente"></v-text-field>
                    <v-switch label="Status" v-model="editedItem.status" required></v-switch>
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
import LoaderComponent from "./LoaderComponent.vue";

export default {
  name: "TablaNumPedAduana",
  components: {
    LoaderComponent,
  },
  data: () => ({
    loading: true,
    mostrar: false,
    search: "",
    valid: true,
    headers: [
      {
        text: "Codigo",
        align: "start",
        value: "codigo",
        sortable: false,
      },
      { text: "Patente", value: "patente", sortable: false },
      { text: "Status", value: "status", sortable: false },
      { text: "Actions", value: "actions", sortable: false },
    ],
    desserts: [],
    result: [],
    dialog: false,
    dialogDelete: false,
    editedIndex: -1,
    editedItem: [
      {
        id: "",
        codigo: "",
        patente: "",
        status: "",
      },
    ],
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
    loading() {
      this.mostrar = true;
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
      axios.get("http://localhost:8081/NumPedimentoAduana").then((response) => {
        this.result = response.data.data;
        //console.log(response.data);
        for (let i = 0; i < response.data.length; i++) {
          this.desserts.push({
            id: response.data[i].idNum,
            codigo: response.data[i].caduana,
            patente: response.data[i].patente,
            status: response.data[i].status,
          });
        }
        this.loading = false;
      });
    },
    saveData: function () {
      if (this.editedIndex > -1) {
        axios
          .put(
            "http://localhost:8081/NumPedimentoAduana/" + this.editedItem.id,
            {
              caduana: this.editedItem.codigo,
              patente: this.editedItem.patente,
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
          .post("http://localhost:8081/NumPedimentoAduana", {
            caduana: this.editedItem.codigo,
            patente: this.editedItem.patente,
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
      axios.delete("http://localhost:8081/NumPedimentoAduana/" + id)
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

<template>
  <v-container>
    <HomeView />
    <v-overflow-btn class="my-2" label="Aduana" v-model="tablaData" :items="tablas" @change="showData"></v-overflow-btn>
    <v-data-table
      v-if="tablaData != 'UsoCFDI' && tablaData != 'ClaveUnidad' && tablaData != 'CodigoPostal' && tablaData != 'TasaoCuota' && tablaData != 'ClaveProdServ' && tablaData != 'RegimenFiscal' && tablaData != 'Impuesto' && tablaData != 'FormaPago' && tablaData != 'NumPedimentoAduana' && tablaData != 'Estado' && tablaData != 'Localidad' && tablaData != 'Municipio'"
      :search="search" :headers="headers" :items="desserts" class="elevation-1">
      <template v-slot:top>
        <v-toolbar flat>
          <v-toolbar-title>{{ titleTable }}</v-toolbar-title>
          <v-divider class="mx-6" inset vertical></v-divider>
          <template>
            <v-dialog v-model="dialog" max-width="400px">
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
                      <v-text-field label="ID" v-model="editedItem.id" required></v-text-field>
                      <v-text-field label="Descripcion" v-model="editedItem.descripcion" required></v-text-field>
                      <v-switch label="Status" v-model="editedItem.status" required></v-switch>
                    </v-form>
                  </v-container>
                </v-card-text>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn color="error darken-1" text @click="close">
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
    <TablaCFDI v-if="tablaData == 'UsoCFDI'" />
    <TablaClaveUni v-if="tablaData == 'ClaveUnidad'" />
    <TablaCodigoP v-if="tablaData == 'CodigoPostal'" />
    <TablaTasaCutoa v-if="tablaData == 'TasaoCuota'" />
    <TablaClaveProd v-if="tablaData == 'ClaveProdServ'" />
    <TablaRegFis v-if="tablaData == 'RegimenFiscal'" />
    <TablaImpuesto v-if="tablaData == 'Impuesto'" />
    <TablaFormaPago v-if="tablaData == 'FormaPago'" />
    <TablaNumPedAduana v-if="tablaData == 'NumPedimentoAduana'" />
    <TablaEstado v-if="tablaData == 'Estado'" />
    <TablaLocalidad v-if="tablaData == 'Localidad'" />
    <TablaMunicipio v-if="tablaData == 'Municipio'" />
  </v-container>
</template>

<script>
import axios from "axios";
import TablaCFDI from "./TablaCFDI.vue";
import TablaClaveUni from "./TablaClaveUni.vue";
import TablaCodigoP from "./TablaCodigoP.vue";
import TablaTasaCutoa from "./TablaTasaCutoa.vue";
import TablaClaveProd from "./TablaClaveProd.vue";
import TablaRegFis from "./TablaRegFis.vue";
import TablaImpuesto from "./TablaImpuesto.vue"
import TablaFormaPago from "./TablaFormaPago.vue";
import TablaNumPedAduana from "./TablaNumPedAduana.vue";
import TablaEstado from "./TablaEstado.vue";
import TablaLocalidad from "./TablaLocalidad.vue";
import TablaMunicipio from "./TablaMunicipio.vue";
import HomeView from "./HomeView.vue"

export default {
  name: "TablasMain",
  components: {
    HomeView,
    TablaCFDI,
    TablaClaveUni,
    TablaCodigoP,
    TablaTasaCutoa,
    TablaClaveProd,
    TablaRegFis,
    TablaImpuesto,
    TablaFormaPago,
    TablaNumPedAduana,
    TablaEstado,
    TablaLocalidad,
    TablaMunicipio,
  },
  data: () => ({
    search: "",
    valid: true,
    headers: [
      {
        text: "ID",
        align: "start",
        value: "id",
      },
      { text: "Descripción", value: "descripcion" },
      { text: "Status", value: "status" },
      { text: "Opciones", value: "actions" },
    ],
    titleTable: "Aduana",
    desserts: [],
    result: {},
    dialog: false,
    dialogDelete: false,
    editedIndex: -1,
    editedItem: [
      {
        id: "",
        descripcion: "",
        status: "",
      },
    ],
    defaultItem: {},
    tablaData: "Aduana",
    tablas: [
      "Aduana",
      "ClaveUnidad",
      "ClaveProdServ",
      "CodigoPostal",
      "Estado",
      "Exportacion",
      "FormaPago",
      "Impuesto",
      "Localidad",
      "Meses",
      "MetodoPago",
      "Moneda",
      "Municipio",
      "NumPedimentoAduana",
      "ObjetoImp",
      "Pais",
      "Periodicidad",
      "RegimenFiscal",
      "TasaoCuota",
      "TipoComprobante",
      "TipoRelacion",
      "UsoCFDI"
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
      ObjetoImp: "ObjetoImp",
    },
    tablasTitle: {
      Aduana: "Aduana",
      Asentamientos: "Asentamientos",
      Exportacion: "Exportacion",
      Meses: "Meses",
      MetodoPago: "Metodo De Pago",
      Moneda: "Moneda",
      ObjetoImp: "Impuesto Al Objeto",
      Pais: "Pais",
      Periodicidad: "Periodicidad",
      TasaoCuota: "Tasa o Cuota",
      TipoComprobante: "Tipo De Comprobante",
      TipoRelacion: "Tipo De Relacion",
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
              id: response.data[i].id,
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
      let selectTabla = this.tablaData;
      this.desserts.length = "";
      this.titleTable = this.tablasTitle[this.tablaData];
      axios.get("http://localhost:8081/" + selectTabla).then((response) => {
        this.result = response.data.data;
        for (let i = 0; i < response.data.length; i++) {
          this.desserts.push({
            id: response.data[i].id,
            descripcion: response.data[i].descripcion,
            status: response.data[i].status,
          });
        }
      });
    },
    saveData: function () {
      let selectTabla = this.tablasD[this.tablaData];
      if (this.editedIndex > -1) {
        axios
          .put(
            "http://localhost:8081/" +
            selectTabla +
            "/" +
            this.editedItem.id,
            {
              id: this.editedItem.id,
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
            id: this.editedItem.id,
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
    deleteMapping: function (id) {
      //console.log(codigo);
      let selectTabla = this.tablasD[this.tablaData];
      axios
        .delete("http://localhost:8081/" + selectTabla + "/" + id)
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

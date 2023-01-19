<template>
  <v-container>
    <v-data-table
      :headers="headers"
      :items="desserts"
      sort-by="calories"
      class="elevation-1"
    >
      <template v-slot:[`item.actions`]>
        <v-icon small class="mr-2"> mdi-pencil </v-icon>
        <v-icon small> mdi-delete </v-icon>
      </template>
    </v-data-table>
  </v-container>
</template>

<script>
//import axios from "axios";
/* import FormAdd from "./FormAdd.vue"; */

export default {
  name: "FormSat",
  components: {
    /* FormAdd, */
  },
  data: () => ({
    dialog: false,
    dialogDelete: false,
    headers: [
      {
        text: "ID",
        align: "start",
        sortable: false,
        value: "name",
      },
      { text: "Nombre", value: "calories", sortable: false },
      { text: "Pais", value: "fat", sortable: false },
      { text: "Actions", value: "actions", sortable: false },
    ],
  }),

  created() {
    this.initialize();
  },

  methods: {
    initialize() {
      this.desserts = [
        {
          name: "OAX",
        },
      ];
    },
    getDataApi() {
      axios
        .get("http://localhost:8081/Pais")
        .then((response) => {
          console.log(response.data.cpais);
          for (let i = 0; i < response.data.length; i++) {
            console.log(response.data[i].cpais);
          }
        })

        .catch((err) => {
          console.log(err);
        });
    },
  },
  /* methods: {
    getDataApi() {
      axios
        .get("http://localhost:8081/Pais")
        .then((response) => {
          console.log(response.data.cpais);
          for (let i = 0; i < response.data.length; i++) {
            console.log(response.data[i].cpais);
          }
        })

        .catch((err) => {
          console.log(err);
        });
    },
  }, */
};
</script>

<style></style>

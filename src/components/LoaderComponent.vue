<template>
  <v-container>
    <v-sheet :color="`grey ${theme.isDark ? 'darken-2' : 'lighten-4'}`" class="pa-3">
      <v-skeleton-loader class="mx-auto" type="table"></v-skeleton-loader>
    </v-sheet>
  </v-container>
</template>

<script>
export default {
  name: "LoaderComponent",
  data() {
    return {};
  },
  inject: {
    theme: {
      default: { isDark: false },
    },
  },
  methods: {},
};
</script>

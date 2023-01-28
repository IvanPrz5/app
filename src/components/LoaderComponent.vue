<template>
  <v-container>
    <v-sheet :color="`grey ${theme.isDark ? 'darken-2' : 'lighten-4'}`" class="pa-3">
      <v-skeleton-loader class="mx-auto" type="table"></v-skeleton-loader>
    </v-sheet>
    <TablaCodigoP/>
  </v-container>
</template>

<script>
import TablaCodigoP from './TablaCodigoP.vue';

export default {
  name: "LoaderComponent",
  components: {
    TablaCodigoP,
  },
  inject: {
    theme: {
      default: { isDark: false },
    },
  },
  methods:{
  }
};
</script>

<template>
  <div>
    <v-toolbar class="grey lighten-3" light flat v-if="user.authenticated">
      <v-toolbar-title>Data Customer</v-toolbar-title>
    </v-toolbar>
  </div>
</template>

<script>
import auth from "./../../utils/auth"
export default {
  data: () => ({
    user: auth.user
  }),
  methods: {},
  created() {}
};
</script>

<style lang="css">
.carousel__item {
  background-size: inherit;
  background-position: center top;
}
</style>

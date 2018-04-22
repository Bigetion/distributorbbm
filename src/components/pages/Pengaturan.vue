<template>
  <div>
    <v-toolbar class="grey lighten-3" light flat>
      <v-toolbar-title>Pengaturan</v-toolbar-title>
    </v-toolbar>
    <v-tabs dark :scrollable="false">
      <v-tabs-bar class="green">
        <v-tabs-slider class="orange"></v-tabs-slider>
        <v-tabs-item key="pengaturanUser" href="#pengaturanUser">Pengaturan User</v-tabs-item>
        <v-tabs-item key="pengaturanKuitansi" href="#pengaturanKuitansi">Pengaturan Kuitansi</v-tabs-item>
      </v-tabs-bar>
      <v-tabs-items>
        <v-tabs-content key="pengaturanUser" id="pengaturanUser">
          <pengaturan-user></pengaturan-user>
        </v-tabs-content>
        <v-tabs-content key="pengaturanKuitansi" id="pengaturanKuitansi">
          <pengaturan-kuitansi></pengaturan-kuitansi>
        </v-tabs-content>
      </v-tabs-items>
    </v-tabs>
  </div>
</template>

<script>
import PengaturanUser from "./PengaturanUser.vue"
import PengaturanKuitansi from "./PengaturanKuitansi.vue"
export default {
  components: { PengaturanUser, PengaturanKuitansi },
  data: () => ({
    activeTab: 'pengaturanUser'
  }),
  methods: {
    onSelect(row) {
      this.selectedRow = row;
    }
  },
  created() {}
};
</script>

<style lang="css">
  
</style>

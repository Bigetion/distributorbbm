<template>
  <v-layout justify-center class="modal-content white">
    <v-card align-center class="konfirmasi-input-gudang-modal mt-5 elevation-10">
      <v-card-text class="mb-4">
        <p>Apakah anda yakin ingin menyimpan data dengan detail berikut ?</p>
        <v-layout row>
          <v-flex md4>Tanggal</v-flex>
          <v-flex md8 class="body-2">: <span class="ml-2">{{data["tanggal"]}}</span></v-flex>
        </v-layout>
        <v-layout row>
          <v-flex md4>Nomor Referensi</v-flex>
          <v-flex md8 class="body-2">: <span class="ml-2">{{data["nomorReferensi"] || "-"}}</span></v-flex>
        </v-layout>
        <v-layout row>
          <v-flex md4>Jumlah</v-flex>
          <v-flex md8 class="body-2">: <span class="ml-2">{{data["qty"]}}</span></v-flex>
        </v-layout>
        <v-layout row>
          <v-flex md4>Keterangan</v-flex>
          <v-flex md8 class="body-2">: <span class="ml-2">{{data["keterangan"] || "-"}}</span></v-flex>
        </v-layout>
      </v-card-text>
      <v-divider></v-divider>
      <v-card-actions>
        <v-btn class="green--text darken-1" flat="flat" @click="ok">Ya</v-btn>
        <v-btn class="red--text darken-1" flat="flat" @click="cancel">Batal</v-btn>
      </v-card-actions>
    </v-card>
  </v-layout>
</template>


<script>
export default {
  props: {
    data: {
      type: Object
    }
  },
  computed: {},
  methods: {
    ok() {
      this.$vuedals.close(true);
    },
    cancel() {
      this.$vuedals.close(false);
    }
  }
};
</script>

<style lang="css">
.konfirmasi-input-gudang-modal {
  top: 100px;
  width: 400px;
  margin: 0 auto;
  background-color: #ffffff;
}
</style>

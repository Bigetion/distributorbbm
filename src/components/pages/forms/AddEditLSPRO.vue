<template>
  <v-layout>
    <v-toolbar class="indigo" dark fixed>
      <v-toolbar-title>{{type=='edit' ? 'Ubah': 'Tambah'}} LSPRO</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn icon @click.native="cancel()" dark>
        <v-icon>close</v-icon>
      </v-btn>
    </v-toolbar>
    <v-flex class="mt-5">
      <v-form v-model="valid" ref="form">
        <v-card flat class="pa-4">
          <v-text-field label="ID LSPRO" name="ID LSPRO" v-model="input.idLSPRO" :error-messages="errors.collect('ID LSPRO')" v-validate="'required'"></v-text-field>
          <v-text-field label="Nama" name="Nama" v-model="input.nama" :error-messages="errors.collect('Nama')" v-validate="'required'"></v-text-field>
          <v-text-field label="Alamat" name="Alamat" v-model="input.alamat" :error-messages="errors.collect('Alamat')" v-validate="'required'"></v-text-field>
          <v-text-field label="Nomor Telpon" name="Nomor Telpon" v-model="input.nomorTelepon" :error-messages="errors.collect('Nomor Telpon')" v-validate="'required'"></v-text-field>
          <v-text-field label="Email" name="Email" v-model="input.email" :error-messages="errors.collect('Email')" v-validate="'required|email'"></v-text-field>
          <div class="mb-5"></div>
        </v-card>
        <v-divider></v-divider>
        <v-card flat class="pa-3">
          <v-btn success @click="submit()">Simpan</v-btn>
          <v-btn error @click="cancel()">Batal</v-btn>
        </v-card>
      </v-form>
    </v-flex>
  </v-layout>
</template>

<script>
export default {
  props: {
    type: {
      type: String
    },
    data: {
      type: Object
    }
  },
  data() {
    return {
      input: {
        idLSPRO: "",
        nama: "",
        alamat: "",
        nomorTelepon: "",
        email: ""
      }
    };
  },
  created() {
    this.selectedRow = Object.assign({}, this.data);
    if (this.type == "edit") {
      this.input = {
        idLSPRO: this.data["id_lspro"],
        nama: this.data["nama_lspro"],
        alamat: this.data["alamat"],
        nomorTelepon: this.data["telepon"],
        email: this.data["email"]
      };
    }
  },
  methods: {
    cancel() {
      this.$vuedals.close({
        submitted: false,
        success: false
      });
    },
    submit() {
      this.$validator.validateAll();
      if (!this.errors.any()) {
        this.$http
          .post("base/service/executeMutation", this.lsproParams)
          .then(response => {
            if (response.data.success_message) {
              this.$vuedals.close({
                submitted: true,
                success: true,
                message:
                  this.type == "add"
                    ? "Berhasil menambahkan data LSPRO"
                    : "Berhasil mengubah data LSPRO"
              });
            }
          });
      }
    }
  },
  computed: {
    mutationType() {
      let mutationType = this.type == "edit" ? "update" : "insert";
      return mutationType;
    },
    lsproData() {
      let data = {
        id_lspro: this.input.idLSPRO,
        nama_lspro: this.input.nama,
        alamat: this.input.alamat,
        telepon: this.input.nomorTelepon,
        email: this.input.email
      };
      return data;
    },
    lsproParams() {
      let params = {
        id: this.selectedRow["id_lspro"],
        type: this.mutationType,
        name: "lspro",
        data: this.lsproData
      };
      return params;
    }
  }
};
</script>

<style lang="css">

</style>

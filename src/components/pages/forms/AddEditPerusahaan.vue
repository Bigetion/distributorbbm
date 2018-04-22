<template>
  <v-layout>
    <v-toolbar class="indigo" dark fixed>
      <v-toolbar-title>{{type=='edit' ? 'Ubah': 'Tambah'}} Perusahaan</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn icon @click.native="cancel()" dark>
        <v-icon>close</v-icon>
      </v-btn>
    </v-toolbar>
    <v-flex class="mt-5">
      <v-form v-model="valid" ref="form">
        <v-card flat class="pa-4">
          <v-text-field label="Nama" name="Nama" v-model="input.nama" :error-messages="errors.collect('Nama')" v-validate="'required'"></v-text-field>
          <v-text-field label="Alamat" name="Alamat" v-model="input.alamat" :error-messages="errors.collect('Alamat')" v-validate="'required'"></v-text-field>
          <select-view
            searchable
            :class="{'select-error': errors.has('Provinsi')}" 
            placeholder="Provinsi" 
            v-model="input.provinsi" 
            from-file="provinsi" 
            name="Provinsi" 
            v-validate="'required'"
          ></select-view>
          <div class="input-group__details">
            <span v-show="errors.has('Provinsi')" class="input-error">{{ errors.first('Provinsi') }}</span>
          </div>
          <select-view 
            searchable
            :class="{'select-error': errors.has('Kota Madya')}" 
            placeholder="Kota Madya / Kabupaten" 
            v-model="input.kota" 
            from-file="kabupaten" 
            name="Kota Madya" 
            v-validate="'required'"
            :disabled="input.provinsi==null"
            :extra-query-options="kabupatenExtraQueryOptions"
          ></select-view>
          <div class="input-group__details">
            <span v-show="errors.has('Kota Madya')" class="input-error">{{ errors.first('Kota Madya') }}</span>
          </div>
          <select-view
            :class="{'select-error': errors.has('Status')}" 
            placeholder="Status" 
            v-model="input.status"
            :options="statusOptions"
            name="Status" 
            v-validate="'required'"
            track-by="id"
            label="value"
          ></select-view>
          <div class="input-group__details">
            <span v-show="errors.has('Status')" class="input-error">{{ errors.first('Status') }}</span>
          </div>
          <v-text-field label="Nomor Telpon" name="Nomor Telpon" v-model="input.nomorTelepon" :error-messages="errors.collect('Nomor Telpon')" v-validate="'required'"></v-text-field>
          <v-text-field label="Website" name="Website" v-model="input.website" :error-messages="errors.collect('Website')" v-validate="'required'"></v-text-field>
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
    },
    idLSPRO: {}
  },
  data() {
    return {
      statusOptions: [
        { id: "Produsen", value: "Produsen" },
        { id: "Pemilik Merk", value: "Pemilik Merk" },
        { id: "Importir Pemilik Merk", value: "Importir Pemilik Merk" },
        { id: "Distributor Resmi", value: "Distributor Resmi" },
        { id: "Perwakilan Resmi Produsen", value: "Perwakilan Resmi Produsen" },
        {
          id: "Pabrikan lokal yang memproduksi untuk merk lokal/asing",
          value: "Pabrikan lokal yang memproduksi untuk merk lokal/asing"
        }
      ],
      input: {
        nama: "",
        alamat: "",
        provinsi: "",
        kota: "",
        kodePos: "",
        status: "",
        nomorTelepon: "",
        website: "",
        email: ""
      }
    };
  },
  created() {
    this.selectedRow = Object.assign({}, this.data);
    if (this.type == "edit") {
      this.input = {
        nama: this.data["nama_penanggung_jawab"],
        alamat: this.data["alamat_penanggung_jawab"],
        provinsi: this.data["provinsi"],
        kota: this.data["kota"],
        kodePos: this.data["kode_pos"],
        status: this.data["status"],
        nomorTelepon: this.data["telp"],
        website: this.data["website"],
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
          .post("base/service/executeMutation", this.perusahaanParams)
          .then(response => {
            if (response.data.success_message) {
              this.$vuedals.close({
                submitted: true,
                success: true,
                message:
                  this.type == "add"
                    ? "Berhasil menambahkan data Perusahaan"
                    : "Berhasil mengubah data Perusahaan"
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
    perusahaanData() {
      let data = {
        nama_penanggung_jawab: this.input.nama,
        alamat_penanggung_jawab: this.input.alamat,
        provinsi: this.input.provinsi,
        kota: this.input.kota,
        kode_pos: this.input.kodePos,
        status: this.input.status,
        telp: this.input.nomorTelepon,
        website: this.input.website,
        email: this.input.email,
        id_lspro: this.idLSPRO
      };
      return data;
    },
    perusahaanParams() {
      let params = {
        id: this.selectedRow["id_perusahaan"],
        type: this.mutationType,
        name: "perusahaan",
        data: this.perusahaanData
      };
      return params;
    },
    kabupatenExtraQueryOptions() {
      let extraQueryOptions = false;

      extraQueryOptions = {
        id_provinsi: this.input.provinsi
      };

      return extraQueryOptions;
    }
  }
};
</script>

<style lang="css">

</style>

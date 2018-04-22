<template>
  <v-layout class="white">
    <v-toolbar class="indigo" dark fixed>
      <v-toolbar-title>Form Pelaporan</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn icon @click.native="cancel()" dark>
        <v-icon>close</v-icon>
      </v-btn>
    </v-toolbar>
    <v-layout row wrap>
      <v-flex md6 class="mt-5">
        <v-card flat class="pa-4 detail">
          <v-text-field label="Nama Produk" :value="selectedRow.nama_produk" :disabled="true"></v-text-field>
          <v-text-field label="Jenis Produk" :value="selectedRow.jenis_produk" :disabled="true"></v-text-field>
          <v-text-field label="Merk" :value="selectedRow.merk" :disabled="true"></v-text-field>
          <v-text-field label="No. Lisensi" :value="selectedRow.no_lisensi" :disabled="true"></v-text-field>
          <span class="caption text-xs-center">No. SNI</span>
          <v-divider></v-divider>
          <div class="mt-2 pb-2">
            <v-layout row wrap v-for="(item, index) in sni[0]" :key="item.no_SNI">
              <v-flex d-flex xs1 class="pa-2">
                <p class="text-xs-left pl-2 bold">{{index+1}}.</p>
              </v-flex>
              <v-flex d-flex xs11 class="pa-2">
                <v-layout row wrap>
                  <v-flex xs12><span class="body-1 bold">{{item.no_SNI}}</span></v-flex>
                  <v-flex xs12><span class="subheading">{{item.judul_SNI}}</span></v-flex>
                </v-layout>
              </v-flex>
            </v-layout>
          </div>
          <v-divider></v-divider>
        </v-card>
      </v-flex>
      <v-flex md6 class="mt-5">
        <v-form v-model="valid" ref="form">
          <v-card flat class="pa-4">
            <v-text-field label="Email Pelapor" name="Email" v-model="input.emailPelapor" :error-messages="errors.collect('Email')" v-validate="'required|email'"></v-text-field>
            <v-text-field label="Lokasi Temuan" name="Lokasi Temuan" v-model="input.lokasiTemuan" :error-messages="errors.collect('Lokasi Temuan')" v-validate="'required'"></v-text-field>
            <v-text-field label="Isi Laporan" name="Isi Laporan" v-model="input.isiLaporan" :error-messages="errors.collect('Isi Laporan')" v-validate="'required'" multi-line></v-text-field>
          </v-card>
          <v-card flat class="pa-3">
            <v-btn primary @click="submit()">Laporkan Produk SNI Bermasalah</v-btn>
            <v-btn error @click="cancel()">Batal</v-btn>
          </v-card>
        </v-form>
      </v-flex>
    </v-layout>
    <query-service v-model="sni" from-file="sni" :extra-query-options="queryServiceExtraQuerySNI"></query-service>
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
        emailPelapor: "",
        lokasiTemuan: "",
        isiLaporan: ""
      },
      sni: [[]]
    };
  },
  created() {
    this.selectedRow = Object.assign({}, this.data);
  },
  methods: {
    cancel() {
      this.$vuedals.close(false);
    },
    submit() {
      this.$validator.validateAll();
      if (!this.errors.any()) {
        this.$http
          .post("base/service/executeMutation", this.pelaporanParams)
          .then(response => {
            if (response.data.success_message) {
              this.$vuedals.close(true);
            }
            this.$vuedals.close(false);
          });
      }
    }
  },
  computed: {
    selectedSNI() {
      let SNI = [];
      const SNIArray = this.selectedRow["no_SNI"].split(";");
      SNIArray.forEach(item => {
        SNI.push(item);
      });
      return SNI;
    },
    queryServiceExtraQuerySNI() {
      let where = [
        {
          no_SNI: this.selectedSNI
        }
      ];
      return where;
    },
    pelaporanData() {
      let data = {
        no_lisensi: this.selectedRow.no_lisensi,
        email_pelapor: this.input.emailPelapor,
        lokasi_temuan: this.input.lokasiTemuan,
        isi_laporan: this.input.isiLaporan
      };
      return data;
    },
    pelaporanParams() {
      let params = {
        type: "insert",
        name: "pelaporan",
        data: this.pelaporanData
      };
      return params;
    }
  }
};
</script>

<style lang="css">

</style>

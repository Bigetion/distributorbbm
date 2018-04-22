<template>
  <div class="white">
    <v-toolbar class="indigo" dark fixed>
      <v-toolbar-title>{{type=='edit' ? 'Ubah': 'Tambah'}} Sertifikat</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn icon @click.native="cancel()" dark>
        <v-icon>close</v-icon>
      </v-btn>
    </v-toolbar>
    <v-flex class="mt-5">
      <v-form v-model="valid" ref="form">
        <v-layout row wrap>
          <v-flex md6>
            <v-card flat class="pa-4">
              <select-view
                searchable
                :class="{'select-error': errors.has('Nama Produk')}" 
                placeholder="Nama Produk" 
                v-model="input.namaProduk" 
                from-file="lingkup_produk" 
                name="Nama Produk" 
                v-validate="'required'"
                :limitable="true"
              ></select-view>
              <div class="input-group__details">
                <span v-show="errors.has('Nama Produk')" class="input-error">{{ errors.first('Nama Produk') }}</span>
              </div>
              <v-text-field label="Jenis Produk" name="Jenis Produk" v-model="input.jenisProduk" :error-messages="errors.collect('Jenis Produk')" v-validate="'required'"></v-text-field>
              <small :class="{'keterangan': !errors.has('Jenis Produk')}">
                <span>Keterangan : Diisi dengan jenis produk sesuai regulasi atau SNI</span>
              </small>
              <div class="mb-4"></div>
              <v-text-field label="Merk" name="Merk" v-model="input.merk" :error-messages="errors.collect('Merk')" v-validate="'required'"></v-text-field>
              <small :class="{'keterangan': !errors.has('Merk')}">
                <span>Keterangan : Hanya untuk 1 merk</span>
              </small>
              <div class="mb-4"></div>
              <select-view
                searchable
                :class="{'select-error': errors.has('Penanggung Jawab Produk')}" 
                placeholder="Penanggung Jawab Produk" 
                v-model="input.penanggungJawab" 
                from-file="perusahaan" 
                name="Penanggung Jawab Produk" 
                v-validate="'required'"
                :extra-query-options="perusahaanExtraQueryOptions"
              ></select-view>
              <div class="input-group__details">
                <span v-show="errors.has('Penanggung Jawab Produk')" class="input-error">{{ errors.first('Penanggung Jawab Produk') }}</span>
              </div>
              <select-view
                searchable
                multiple
                :class="{'select-error': errors.has('Nomor SNI')}" 
                placeholder="Nomor SNI" 
                v-model="input.nomorSNI" 
                from-file="sni" 
                name="Nomor SNI" 
                v-validate="'required'"
                :limitable="true"
              ></select-view>
              <div class="input-group__details">
                <span v-show="errors.has('Nomor SNI')" class="input-error">{{ errors.first('Nomor SNI') }}</span>
              </div>
              <select-view 
                placeholder="Status Penerapan"
                :class="{'select-error': errors.has('Status Penerapan')}" 
                v-model="input.statusPenerapan" 
                :options="statusPenerapanOptions" 
                track-by="id" 
                label="value"
                name="Status Penerapan"
                v-validate="'required'">
              </select-view>
              <div class="input-group__details">
                <span v-show="errors.has('Status Penerapan')" class="input-error">{{ errors.first('Status Penerapan') }}</span>
              </div>
              <small :class="{'keterangan': !errors.has('Status Penerapan')}">
                <span>Keterangan : "voluntary" untuk sukarela, dan "mandatory" untuk yang diberlakukan wajib melalui regulasi</span>
              </small>
              <div class="mb-4"></div>
              <select-view 
                placeholder="Skema Sertifikasi" 
                :class="{'select-error': errors.has('Skema Sertifikasi')}" 
                v-model="input.skemaSertifikasi" 
                :options="skemaSertifikasiOptions" 
                track-by="id" 
                label="value"
                name="Skema Sertifikasi"
                v-validate="'required'">
              </select-view>
              <div class="input-group__details">
                <span v-show="errors.has('Skema Sertifikasi')" class="input-error">{{ errors.first('Skema Sertifikasi') }}</span>
              </div>
              <v-text-field label="Nomor Sertifikat Kesesuaian" name="Nomor Sertifikat Kesesuaian" v-model="input.nomorSertifikat" :error-messages="errors.collect('Nomor Sertifikat Kesesuaian')" v-validate="'required'"></v-text-field>
              <select-view 
                placeholder="Status Sertifikat" 
                v-model="input.statusSertifikat" 
                :options="statusSertifikatOptions" 
                track-by="id" 
                label="value"
                name="Status Sertifikat"
                v-validate="'required'">
              </select-view>
              <div class="input-group__details">
                <span v-show="errors.has('Status Sertifikat')" class="input-error">{{ errors.first('Status Sertifikat') }}</span>
              </div>
              <vdatepicker 
                :editable="true" 
                label="Masa Berlaku Sertifikat" 
                v-model="input.masaBerlakuSertifikat" 
                :range="!(input.skemaSertifikasi == '1a' || input.skemaSertifikasi == '1b')" 
                name="Masa Berlaku Sertifikat" 
                :error-messages="errors.collect('Masa Berlaku Sertifikat')" 
                v-validate="'required'">
              </vdatepicker>
              <v-text-field label="Nomor Lisensi Tanda SNI (SPPT SNI)" name="Nomor Lisensi Tanda SNI" v-model="input.nomorLisensi" :error-messages="errors.collect('Nomor Lisensi Tanda SNI')" v-validate="'required'"></v-text-field>
              <small :class="{'keterangan': !errors.has('Nomor Lisensi Tanda SNI')}">
                <span>Keterangan : </span><br>
                <span>1. Jika diberlakukan wajib oleh regulasi</span><br>
                <span>2. Dapat sama dengan nomor sertifikat kesesuaian</span><br>
                <span>3. Untuk sukarela selama lisensi tanda SNI belum dari BSN wajib diisi</span>
              </small>
              <div :style="{marginBottom: '70px'}"></div>
              <vdatepicker 
                :editable="true" 
                label="Masa Berlaku Lisensi" 
                v-model="input.masaBerlakuLisensi" 
                :range="!(input.skemaSertifikasi == '1a' || input.skemaSertifikasi == '1b')" 
                name="Masa Berlaku Lisensi" 
                :error-messages="errors.collect('Masa Berlaku Lisensi')" 
                v-validate="'required'">
              </vdatepicker>
            </v-card>
          </v-flex>
          <v-flex md6>
            <v-card flat class="pa-4">
              <v-text-field label="Tipe Produk" name="Tipe Produk" v-model="tipeProdukInput.nama" :error-messages="errors.collect('Tipe Produk')" v-validate="{required: tipeProdukArray.length==0}"></v-text-field>
              <v-btn small :disabled="tipeProdukInput.nama==''" primary class="absolute-submit-button" @click.stop="addTipeProduk()">Tambah Tipe Produk</v-btn>
            </v-card>
            <div class="pa-4">
              <v-data-table
                v-bind:headers="[
                  {
                    text: 'Data Tipe Produk',
                    align: 'left',
                    sortable: false,
                    value: 'nama'
                  },
                  {
                    text: '-',
                    align: 'right',
                    sortable: false,
                    value: 'aksi'
                  }
                ]"
                :items="tipeProdukArray"
                hide-actions
                class="elevation-1"
              >
                <template slot="headers">
                  <tr>
                    <th :style="{textAlign: 'left'}">Data Tipe Produk</th>
                  </tr>
                </template>
                <template slot="items" scope="props">
                  <td>{{ props.item.nama }}</td>
                  <td :style="{textAlign: 'right'}">
                    <v-btn icon ripple @click.stop="removeTipeProduk(props.index)">
                      <v-icon class="subheading red--text text--lighten-1">close</v-icon>
                    </v-btn>
                  </td>
                </template>
              </v-data-table>
            </div>
            <v-card flat class="pa-4">
              <v-text-field label="Nama Pabrik" name="Nama Pabrik" v-model="pabrikInput.nama" :error-messages="errors.collect('Nama Pabrik')" v-validate="{required: pabrikArray.length==0}"></v-text-field>
              <v-text-field label="Alamat Pabrik" name="Alamat Pabrik" v-model="pabrikInput.alamat" :error-messages="errors.collect('Alamat Pabrik')" v-validate="{required: pabrikArray.length==0}"></v-text-field>
              <v-btn small :disabled="pabrikInput.nama=='' || pabrikInput.alamat==''" primary class="absolute-submit-button" @click.stop="addPabrik()">Tambah Pabrik</v-btn>
            </v-card>
            <div class="pa-4">
              <v-data-table
                v-bind:headers="[
                  {
                    text: 'Data Pabrik',
                    align: 'left',
                    sortable: false,
                    value: 'nama'
                  },
                  {
                    text: '',
                    align: 'left',
                    sortable: false,
                    value: 'alamat'
                  },
                  {
                    text: '',
                    align: 'right',
                    sortable: false,
                    value: 'aksi'
                  }
                ]"
                :items="pabrikArray"
                hide-actions
                class="elevation-1"
              >
                <template slot="headers">
                  <tr>
                    <th :style="{textAlign: 'left'}">Data Pabrik</th>
                  </tr>
                </template>
                <template slot="items" scope="props">
                  <td>{{ props.item.nama }}</td>
                  <td>{{ props.item.alamat }}</td>
                  <td :style="{textAlign: 'right'}">
                    <v-btn icon ripple @click.stop="removePabrik(props.index)">
                      <v-icon class="subheading red--text text--lighten-1">close</v-icon>
                    </v-btn>
                  </td>
                </template>
              </v-data-table>
            </div>
          </v-flex>
        </v-layout>
        <div class="mb-5"></div>
        <v-divider></v-divider>
        <v-card flat class="pa-3">
          <v-btn success @click="submit()">Simpan</v-btn>
          <v-btn error @click="cancel()">Batal</v-btn>
        </v-card>
      </v-form>
    </v-flex>
  </div>
</template>

<script>
import moment from "moment";
export default {
  props: {
    type: {
      type: String
    },
    data: {
      type: Object
    },
    detail: {},
    idLSPRO: {}
  },
  data() {
    return {
      input: {
        namaProduk: "",
        jenisProduk: "",
        merk: "",
        penanggungJawab: "",
        nomorSNI: [],
        statusPenerapan: "",
        skemaSertifikasi: "",
        nomorSertifikat: "",
        statusSertifikat: "berlaku",
        masaBerlakuSertifikat: "",
        nomorLisensi: "",
        masaBerlakuLisensi: ""
      },
      idMerk: "-1",
      tipeProdukInput: {
        nama: "",
        images: []
      },
      tipeProdukArray: [],
      pabrikInput: {
        nama: "",
        alamat: ""
      },
      pabrikArray: [],
      statusPenerapanOptions: [
        {
          id: "mandatory",
          value: "Mandatory"
        },
        {
          id: "voluntary",
          value: "Voluntary"
        }
      ],
      skemaSertifikasiOptions: [
        {
          id: "1a",
          value: "1a"
        },
        {
          id: "1b",
          value: "1b"
        },
        {
          id: "2",
          value: "2"
        },
        {
          id: "3",
          value: "3"
        },
        {
          id: "4",
          value: "4"
        },
        {
          id: "5",
          value: "5"
        },
        {
          id: "6",
          value: "6"
        },
        {
          id: "lainnya",
          value: "Lainnya"
        }
      ],
      statusSertifikatOptions: [
        {
          id: "berlaku",
          value: "Berlaku"
        },
        {
          id: "dibekukan",
          value: "Dibekukan"
        },
        {
          id: "dicabut",
          value: "Dicabut"
        }
      ]
    };
  },
  created() {
    this.selectedRow = Object.assign({}, this.data);
    if (this.type == "edit") {
      this.input = {
        namaProduk: this.data["nama_produk"],
        jenisProduk: this.data["jenis_produk"],
        merk: this.data["merk"],
        penanggungJawab: this.data["id_perusahaan"],
        nomorSNI: this.data["no_SNI"].split(";"),
        statusPenerapan: this.data["status_penerapan"],
        skemaSertifikasi: this.data["skema_sertifikasi"],
        nomorSertifikat: this.data["no_sertifikat"],
        statusSertifikat: this.data["status"],
        nomorLisensi: this.data["no_lisensi"],
        masaBerlakuSertifikat: [
          moment(this.data["tgl_terbit_sertifikat"]),
          moment(this.data["tgl_berakhir_sertifikat"])
        ],
        masaBerlakuLisensi: [
          moment(
            this.detail[2].length > 0
              ? this.detail[2][0]["tgl_terbit_lisensi"]
              : new Date()
          ),
          moment(
            this.detail[2].length > 0
              ? this.detail[2][0]["tgl_berakhir_lisensi"]
              : new Date()
          )
        ]
      };
      this.detail[0].forEach(item => {
        this.tipeProdukArray.push({
          nama: item.tipe_produk,
          images: item.gambar_produk
        });
      });
      this.detail[1].forEach(item => {
        this.pabrikArray.push({
          nama: item.nama_pabrik,
          alamat: item.alamat_pabrik
        });
      });
    }
  },
  methods: {
    cancel() {
      this.$vuedals.close();
    },
    replaceLisensi() {
      this.$http
        .post("base/service/executeMutation", this.deleteLisensiParams)
        .then(() => {
          this.$http.post("base/service/executeMutation", this.lisensiParams);
        });
    },
    replaceTipeProdukPabrik() {
      this.$http
        .post("base/service/executeMutation", this.deleteTipeProdukParams)
        .then(() => {
          this.$http.post(
            "base/service/executeMutation",
            this.tipeProdukParams
          );
        });

      this.$http
        .post("base/service/executeMutation", this.deletePabrikParams)
        .then(() => {
          this.$http.post("base/service/executeMutation", this.pabrikParams);
        });
    },
    submit() {
      this.$validator.validateAll();
      if (!this.errors.any()) {
        this.$http
          .post("base/service/executeMutation", this.sertifikatParams)
          .then(response => {
            if (response.data.success_message) {
              if (this.type == "add") this.idMerk = response.data.id;
              else this.idMerk = this.selectedRow["id_merk"];
              this.replaceLisensi();
              this.replaceTipeProdukPabrik();
              this.$vuedals.close(true);
            }
            this.$vuedals.close(false);
          });
      }
    },
    addTipeProduk() {
      this.tipeProdukArray.push(this.tipeProdukInput);
      this.tipeProdukInput = {
        nama: "",
        images: []
      };
    },
    removeTipeProduk(index) {
      this.tipeProdukArray.splice(index, 1);
    },
    addPabrik() {
      this.pabrikArray.push(this.pabrikInput);
      this.pabrikInput = {
        nama: "",
        alamat: ""
      };
    },
    removePabrik(index) {
      this.pabrikArray.splice(index, 1);
    }
  },
  computed: {
    mutationType() {
      let mutationType = this.type == "edit" ? "update" : "insert";
      return mutationType;
    },
    perusahaanExtraQueryOptions() {
      let extraQueryOptions = false;

      extraQueryOptions = {
        id_lspro: this.idLSPRO
      };

      return extraQueryOptions;
    },
    sertifikatData() {
      let data = {
        jenis_produk: this.input.jenisProduk,
        nama_produk: this.input.namaProduk,
        merk: this.input.merk,
        id_perusahaan: this.input.penanggungJawab,
        no_SNI: "",
        status_penerapan: this.input.statusPenerapan,
        skema_sertifikasi: this.input.skemaSertifikasi,
        no_lisensi: this.input.nomorLisensi,
        no_sertifikat: this.input.nomorSertifikat,
        tgl_terbit_sertifikat: "",
        tgl_berakhir_sertifikat: "",
        status: this.input.statusSertifikat,
        keterangan: ""
      };

      data.no_SNI = this.input.nomorSNI.join(";");

      const numberOfDaysToAdd = 180;
      if (
        this.input.skemaSertifikasi == "1a" ||
        this.input.skemaSertifikasi == "1b"
      ) {
        data.tgl_terbit_sertifikat = moment(
          this.input.masaBerlakuSertifikat
        ).format("YYYY-MM-DD");
        data.tgl_berakhir_sertifikat = moment(this.input.masaBerlakuSertifikat)
          .add(numberOfDaysToAdd, "days")
          .format("YYYY-MM-DD");
      } else {
        data.tgl_terbit_sertifikat = moment(
          this.input.masaBerlakuSertifikat[0]
        ).format("YYYY-MM-DD");
        data.tgl_berakhir_sertifikat = moment(
          this.input.masaBerlakuSertifikat[1]
        ).format("YYYY-MM-DD");
      }

      return data;
    },
    sertifikatParams() {
      let params = {
        id: this.selectedRow["id_merk"],
        type: this.mutationType,
        name: "sertifikat",
        data: this.sertifikatData
      };
      return params;
    },
    lisensiData() {
      let data = {
        no_lisensi: this.input.nomorLisensi,
        tgl_terbit_lisensi: "",
        tgl_berakhir_lisensi: ""
      };

      const numberOfDaysToAdd = 180;
      if (
        this.input.skemaSertifikasi == "1a" ||
        this.input.skemaSertifikasi == "1b"
      ) {
        data.tgl_terbit_lisensi = moment(this.input.masaBerlakuLisensi).format(
          "YYYY-MM-DD"
        );
        data.tgl_berakhir_lisensi = moment(this.input.masaBerlakuLisensi)
          .add(numberOfDaysToAdd, "days")
          .format("YYYY-MM-DD");
      } else {
        data.tgl_terbit_lisensi = moment(
          this.input.masaBerlakuLisensi[0]
        ).format("YYYY-MM-DD");
        data.tgl_berakhir_sertifikat = moment(
          this.input.masaBerlakuLisensi[1]
        ).format("YYYY-MM-DD");
      }

      return data;
    },
    deleteLisensiParams() {
      let params = {
        id: this.input.nomorLisensi,
        type: "delete",
        name: "lisensi"
      };
      return params;
    },
    lisensiParams() {
      let params = {
        type: "insert",
        name: "lisensi",
        data: this.lisensiData
      };
      return params;
    },
    tipeProdukData() {
      let tipeProdukData = [];
      this.tipeProdukArray.forEach(item => {
        tipeProdukData.push({
          id_merk: this.idMerk,
          tipe_produk: item.nama
        });
      });
      return tipeProdukData;
    },
    deleteTipeProdukParams() {
      let params = {
        id: this.idMerk,
        type: "delete",
        name: "tipe_produk"
      };
      return params;
    },
    tipeProdukParams() {
      let params = {
        type: "insert",
        name: "tipe_produk",
        data: this.tipeProdukData
      };
      return params;
    },
    pabrikData() {
      let pabrikData = [];
      this.pabrikArray.forEach(item => {
        pabrikData.push({
          id_merk: this.idMerk,
          nama_pabrik: item.nama,
          alamat_pabrik: item.alamat
        });
      });
      return pabrikData;
    },
    deletePabrikParams() {
      let params = {
        id: this.idMerk,
        type: "delete",
        name: "pabrik"
      };
      return params;
    },
    pabrikParams() {
      let params = {
        type: "insert",
        name: "pabrik",
        data: this.pabrikData
      };
      return params;
    }
  }
};
</script>

<style lang="css">
.absolute-submit-button {
  position: absolute;
  margin: 0px 0 0 -2px;
}
</style>

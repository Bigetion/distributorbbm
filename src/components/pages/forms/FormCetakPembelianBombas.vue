<template>
  <v-layout justify-center class="white pb-3">
    <v-toolbar class="indigo" dark fixed>
      <v-toolbar-title>Cetak</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn icon @click.native="cancel()" dark>
        <v-icon>close</v-icon>
      </v-btn>
    </v-toolbar>
    <v-flex class="mt-5">
      <v-form v-model="valid" ref="form">
        <v-card flat class="pa-4 detail" v-show="step==1">
          <v-text-field label="Nomor PO" name="Nomor PO" v-model="input.nomorSuratJalan" :error-messages="errors.collect('Nomor PO')" v-validate="{required: step==1}"></v-text-field>
          <v-text-field label="Nama Penyalur" name="Nama Penyalur" v-model="input.namaPenyalur" :error-messages="errors.collect('Nama Penyalur')" v-validate="{required: step==1}"></v-text-field>
          <v-text-field label="Nomor SKP Migas" name="Nomor SKP Migas" v-model="input.nomorSKPMigas" :error-messages="errors.collect('Nomor SKP Migas')" v-validate="{required: step==1}"></v-text-field>
          <v-text-field label="Alamat Penyalur" name="Alamat Penyalur" v-model="input.alamatPenyalur" :error-messages="errors.collect('Alamat Penyalur')" v-validate="{required: step==1}"></v-text-field>
          <v-text-field label="Nomor Sold To Penyalur" name="Nomor Sold To Penyalur" v-model="input.nomorSoldToPenyalur" :error-messages="errors.collect('Nomor Sold To Penyalur')" v-validate="{required: step==1}"></v-text-field>
          <v-text-field label="NPWP Penyalur" name="NPWP Penyalur" v-model="input.NPWPPenyalur" :error-messages="errors.collect('NPWP Penyalur')" v-validate="{required: step==1}"></v-text-field>
        </v-card>
        <v-card flat class="pa-4 detail" v-show="step==2">
          <v-select
            :items="['Industri','Perkebunan','Pertambangan','Perkapalan']"
            v-model="input.jenisCustomer"
            label="Jenis Customer"
            name="Jenis Customer"
            :error-messages="errors.collect('Jenis Customer')" 
          ></v-select>
          <v-text-field label="Diserahkan Kepada" name="Diserahkan Kepada" v-model="input.diserahkanKepada" :error-messages="errors.collect('Diserahkan Kepada')" v-validate="{required: step==2}"></v-text-field>
          <v-text-field label="Alamat Customer" name="Alamat Customer" v-model="input.alamatCustomer" :error-messages="errors.collect('Alamat Customer')" v-validate="{required: step==2}"></v-text-field>
          <v-text-field label="Sales District Customer" name="Sales District Customer" v-model="input.salesDistrictCustomer" :error-messages="errors.collect('Sales District Customer')" v-validate="{required: step==2}"></v-text-field>
          <v-text-field label="Nomor Ship To Customer" name="Nomor Ship To Customer" v-model="input.nomorShipToCustomer" :error-messages="errors.collect('Nomor Ship To Customer')" v-validate="{required: step==2}"></v-text-field>
          <v-text-field label="Jenis Usaha Customer" name="Jenis Usaha Customer" v-model="input.jenisUsahaCustomer" :error-messages="errors.collect('Jenis Usaha Customer')" v-validate="{required: step==2}"></v-text-field>
        </v-card>
        <v-card flat class="pa-4 detail" v-show="step==3">
          <v-select
            :items="[
              'Patra Diesel / HSD',
              'Patra Fuel / HSFO 310 / MFO 180',
              'Patra Fuel / HSFO 380 / MFO 380',
              'Patra Diesel Plus / IDO / MDF / MDO',
              'Patra Power / Gasoline 88 / Premium',
              'Patra Extra / Gasoline 92 / Pertamax',
              'Patra Bio Diesel',
              'Patra Bio Kerosene',
              'Patra Bio Avtur'
            ]"
            v-model="input.jenisBBM"
            label="Jenis BBM"
            name="Jenis BBM"
            :error-messages="errors.collect('Jenis BBM')"
            v-validate="{required: step==3}"
          ></v-select>
          <v-text-field label="Jumlah BBM (Liter)" name="Jumlah BBM" v-model="input.jumlahBBM" :error-messages="errors.collect('Jumlah BBM')" v-validate="{required: step==3}"></v-text-field>
          <v-select
            :items="[
              {value:1.1128, text:'17.17% dari 7.5%'},
              {value:1.1675, text:'90% dari 7.5%'},
              {value:1.175, text:'100% dari 7.5%'},
              {value:1.115, text:'20% dari 7.5%'},
              {value:1.1, text:'0% dari 7.5%'}
            ]"
            v-model="input.PBBKB"
            label="PBBKB"
            name="PBBKB"
            :error-messages="errors.collect('PBBKB')"
            v-validate="{required: step==3}"
          ></v-select>
          <v-text-field label="PPH" name="PPH" v-model="input.PPH" :error-messages="errors.collect('PPH')" v-validate="{required: step==3}"></v-text-field>
          <v-text-field label="Harga Tebus Penyalur" name="Harga Tebus Penyalur" v-model="input.hargaTebusPenyalur" :error-messages="errors.collect('Harga Tebus Penyalur')" v-validate="{required: step==3}"></v-text-field>
          <!-- <v-text-field label="Harga Jual End User" name="Harga Jual End User" v-model="hargaJualEndUser" :error-messages="errors.collect('Harga Jual End User')" v-validate="{required: step==3}" :disabled="true"></v-text-field>
          <v-text-field label="Harga Dasar End User" name="Harga Dasar End User" v-model="hargaDasarEndUser" :error-messages="errors.collect('Harga Dasar End User')" v-validate="{required: step==3}" :disabled="true"></v-text-field>
          <v-text-field label="Harga Dasar Penyalur" name="Harga Dasar Penyalur" v-model="hargaDasarPenyalur" :error-messages="errors.collect('Harga Dasar Penyalur')" v-validate="{required: step==3}" :disabled="true"></v-text-field>
          <v-text-field label="Dasar Pengenaan PPN dan PPH" name="Dasar Pengenaan PPN dan PPH" v-model="dasarPengenaanPPNPPH" :error-messages="errors.collect('Dasar Pengenaan PPN dan PPH')" v-validate="{required: step==3}" :disabled="true"></v-text-field>
          <v-text-field label="PPN" name="PPN" v-model="PPN" :error-messages="errors.collect('PPN')" v-validate="{required: step==3}" :disabled="true"></v-text-field>
          <v-text-field label="PBBKB" name="PBBKB" v-model="PBBKB" :error-messages="errors.collect('PBBKB')" v-validate="{required: step==3}" :disabled="true"></v-text-field>
          <v-text-field label="Total" name="Total" v-model="total" :error-messages="errors.collect('Total')" v-validate="{required: step==3}" :disabled="true"></v-text-field> -->
          <v-select
            :items="['Tunai','Kredit - ASKRINDO','Kredit - SKBDN','Kredit - TUGU','Kredit - Bank Garansi','Kredit - Others *)']"
            v-model="input.caraPembayaran"
            label="Cara Pembayaran"
            name="Cara Pembayaran"
            :error-messages="errors.collect('Cara Pembayaran')" 
            v-validate="{required: step==3}"
          ></v-select>
          <v-text-field label="Bukti Setor Bank" name="Bukti Setor Bank" v-model="input.buktiSetorBank" :error-messages="errors.collect('Bukti Setor Bank')" v-validate="{required: step==3}"></v-text-field>
          <datepicker 
            label="Tanggal Pengisian" 
            name="Tanggal Pengisian" 
            v-model="input.tanggalPengisian" 
            :error-messages="errors.collect('Tanggal Pengisian')"
            value-format="DD MMMM YYYY"
            :z-index="1099"
            v-validate="{required: step==3}"
          ></datepicker>
          <v-text-field label="Nomor Polisi Truk Tanki" name="Nomor Polisi Truk Tanki" v-model="input.nomorPolisiTrukTanki" :error-messages="errors.collect('Nomor Polisi Truk Tanki')"></v-text-field>
          <v-text-field label="Volume BBM Per-alat Angkut" name="Volume BBM Per-alat Angkut" v-model="input.volumeBBMPerAlatAngkut" :error-messages="errors.collect('Volume BBM Per-alat Angkut')" v-validate="{required: step==3}"></v-text-field>
          <v-text-field label="Nama Sopir" name="Nama Sopir" v-model="input.namaSopir" :error-messages="errors.collect('Nama Sopir')"></v-text-field>
          <v-text-field label="Supply Point" name="Supply Point" v-model="input.supplyPoint" :error-messages="errors.collect('Supply Point')" v-validate="{required: step==3}"></v-text-field>
          <v-text-field label="Tempat" name="Tempat" v-model="input.tempat" :error-messages="errors.collect('Tempat')" v-validate="{required: step==3}"></v-text-field>
          <datepicker 
            label="Tanggal Cetak" 
            name="Tanggal Cetak" 
            v-model="input.tanggal" 
            :error-messages="errors.collect('Tanggal Cetak')"
            value-format="DD MMMM YYYY"
            :z-index="1099"
            v-validate="{required: step==3}"
          ></datepicker>
          <v-text-field label="Oleh" name="Oleh" v-model="input.oleh" :error-messages="errors.collect('Oleh')" v-validate="{required: step==3}"></v-text-field>
        </v-card>
        <v-divider></v-divider>
        <v-card flat class="pa-3" v-if="step==3">
          <v-btn dark class="deep-orange float-right" @click="cek_cetak()">Cetak</v-btn>
          <v-btn primary class="float-right" @click="submit()">Simpan</v-btn>
        </v-card>
        <v-card flat class="pa-3" v-else>
          <v-btn primary @click="submit()">Simpan</v-btn>
          <v-btn error @click="next()">Next</v-btn>
        </v-card>
      </v-form>
    </v-flex>
    <query-service v-model="pembelian" from-file="pembelian_cetak" :extra-query-options="extraQueryOptions" :is-refresh="state.isRefresh"></query-service>
  </v-layout>
</template>

<script>
import _ from "lodash";
import moment from "moment";
import { print } from "./../../../utils/exportDownload";
export default {
  props: {
    data: {}
  },
  data() {
    return {
      state: {
        isRefresh: false
      },
      input: {
        nomorSuratJalan: "",
        namaPenyalur: "",
        nomorSKPMigas: "",
        alamatPenyalur: "",
        nomorSoldToPenyalur: "",
        NPWPPenyalur: "",
        jenisCustomer: "",
        diserahkanKepada: "",
        alamatCustomer: "",
        salesDistrictCustomer: "",
        nomorShipToCustomer: "",
        jenisUsahaCustomer: "",
        jenisBBM: "",
        jumlahBBM: "",
        PBBKB: "",
        PPH: "",
        hargaJualEndUser: "",
        hargaDasarEndUser: "",
        hargaTebusPenyalur: "",
        hargaDasarPenyalur: "",
        marginPenyalur: "",
        caraPembayaran: "",
        jumlahHariPembayaran: "",
        buktiSetorBank: "",
        tanggalPengisian: "",
        nomorPolisiTrukTanki: "",
        volumeBBMPerAlatAngkut: "",
        namaSopir: "",
        supplyPoint: "",
        tempat: "",
        tanggal: "",
        oleh: ""
      },
      inputBarang: {
        namaBarang: "",
        qty: "",
        harga: "",
        diskon: 0
      },
      barang: [],
      step: 1,
      pembelian: [],
      lambangBase64: "",
      settings: {}
    };
  },
  created() {
    this.$http.post("image/getbase64/pertamina", {}).then(response => {
      this.lambangBase64 = response.data.base64;
    });
    this.input.nomorSuratJalan = this.data["nomor_po"];
  },
  methods: {
    submit() {
      this.$validator.validateAll().then(() => {
        if (!this.errors.any()) {
          if (this.step == 1) {
            const data = {
              id_pembelian: this.data["id"],
              nomor_po: this.input.nomorSuratJalan,
              nama_penyalur: this.input.namaPenyalur,
              nomor_skp_migas: this.input.nomorSKPMigas,
              alamat_penyalur: this.input.alamatPenyalur,
              nomor_sold_penyalur: this.input.nomorSoldToPenyalur,
              npwp_penyalur: this.input.NPWPPenyalur
            };
            if (this.pembelian[3].length == 0) {
              this.$http
                .post("base/service/executeMutation", {
                  type: "insert",
                  name: "pembelian_detail_bombas",
                  data: data
                })
                .then(response => {
                  this.state.isRefresh = !this.state.isRefresh;
                });
            } else {
              this.$http.post("base/service/executeMutation", {
                id: this.pembelian[3][0]["id"],
                type: "update",
                name: "pembelian_detail_bombas",
                data: data
              });
            }
          }
          if (this.step == 2) {
            const data = {
              id_pembelian: this.data["id"],
              jenis_customer: this.input["jenisCustomer"],
              diserahkan_kepada: this.input["diserahkanKepada"],
              alamat_customer: this.input["alamatCustomer"],
              sales_district_customer: this.input["salesDistrictCustomer"],
              nomor_ship_customer: this.input["nomorShipToCustomer"],
              jenis_usaha_customer: this.input["jenisUsahaCustomer"]
            };
            if (this.pembelian[3].length == 0) {
              this.$http
                .post("base/service/executeMutation", {
                  type: "insert",
                  name: "pembelian_detail_bombas",
                  data: data
                })
                .then(response => {
                  this.state.isRefresh = !this.state.isRefresh;
                });
            } else {
              this.$http.post("base/service/executeMutation", {
                id: this.pembelian[3][0]["id"],
                type: "update",
                name: "pembelian_detail_bombas",
                data: data
              });
            }
          }
          if (this.step == 3) {
            const data = {
              id_pembelian: this.data["id"],
              jenis_bbm: this.input.jenisBBM,
              jumlah_bbm: this.input.jumlahBBM,
              pbbkb:this.input.PBBKB,
              pph:this.input.PPH,
              harga_tebus_penyalur:this.input.hargaTebusPenyalur,
              cara_pembayaran:this.input.caraPembayaran,
              bukti_setor_bank:this.input.buktiSetorBank,
              tanggal_pengisian:this.input.tanggalPengisian,
              nomor_polisi_truk_tanki:this.input.nomorPolisiTrukTanki,
              volume_bbm_per_alat_angkut:this.input.volumeBBMPerAlatAngkut,
              nama_sopir:this.input.namaSopir,
              supply_point:this.input.supplyPoint,
              tempat:this.input.tempat,
              tanggal:this.input.tanggal,
              oleh:this.input.oleh
            };
            if (this.pembelian[3].length == 0) {
              this.$http
                .post("base/service/executeMutation", {
                  type: "insert",
                  name: "pembelian_detail_bombas",
                  data: data
                })
                .then(response => {
                  this.state.isRefresh = !this.state.isRefresh;
                });
            } else {
              this.$http.post("base/service/executeMutation", {
                id: this.pembelian[3][0]["id"],
                type: "update",
                name: "pembelian_detail_bombas",
                data: data
              });
            }
          }
        } else {
          $(`[name="${this.errors.items[0].field}"]`).focus();
        }
      });
    },
    next() {
      this.$validator.validateAll().then(() => {
        if (!this.errors.any()) {
          this.step += 1;
          this.$validator.reset();
        } else {
          $(`[name="${this.errors.items[0].field}"]`).focus();
        }
      });
    },
    cek_cetak() {
      this.$validator.validateAll().then(() => {
        if (!this.errors.any()) {
          this.cetak();
        } else {
          $(`[name="${this.errors.items[0].field}"]`).focus();
        }
      });
    },
    cetak() {
      var printInput = {
        lambang: this.lambangBase64,
        namaPT: this.settings.nama_pt,
        alamatPT: this.settings.alamat,
        NPWP: this.settings.npwp,
        INU: this.settings.inu,
        aliasPT: this.settings.nama_alias,
        nomorSuratJalan: this.input.nomorSuratJalan,
        tanggal: moment(this.input.tanggal).format("DD MMMM YYYY"),
        jenisPembayaran: this.data["jenis_bayar"],
        TOP: this.data["top"],
        tanggalJatuhTempo: moment(this.data["jatuh_tempo"]).format(
          "DD MMMM YYYY"
        ),
        statusBayar: this.data["status_bayar"],
        namaPenyalur: "",
        nomorSKPMigas: "",
        alamatPenyalur: "",
        nomorSoldToPenyalur: "",
        NPWPPenyalur: ""
      };

      var renderRow = function(key, value, color = "#FFFFFF") {
        return [
          {
            border: [false, false, false, false],
            text: key,
            fontSize: 9
          },
          {
            border: [false, false, false, false],
            text: ":"
          },
          {
            border: [false, false, false, false],
            fillColor: color,
            text: value,
            fontSize: 9
          }
        ];
      };
      var renderDivider = function() {
        return {
          cTable: {
            widths: ["*"],
            headerRows: 1,
            body: [
              [
                {
                  border: [false, true, false, false],
                  text: ""
                }
              ]
            ]
          }
        };
      };

      var row1 = [];
      row1.push(
        renderRow("1    Nama Penyalur", this.input.namaPenyalur, "#FCDD06")
      );
      row1.push(renderRow("2    No. SKP Migas", this.input.nomorSKPMigas));
      row1.push(renderRow("3    Alamat Penyalur", this.input.alamatPenyalur));
      row1.push(
        renderRow("4    No. Sold-to Penyalur", this.input.nomorSoldToPenyalur)
      );
      row1.push(renderRow("5    NPWP Penyalur", this.input.NPWPPenyalur));

      var row2 = [];
      row2.push(renderRow("6    Jenis Customer", this.input.jenisCustomer));
      row2.push(
        renderRow("7    Diserahkan Kepada", this.input.diserahkanKepada)
      );
      row2.push(renderRow("8    Alamat Customer", this.input.alamatCustomer));
      row2.push(
        renderRow(
          "9    Sales District Customer",
          this.input.salesDistrictCustomer
        )
      );
      row2.push(
        renderRow("10   No. Ship-to Customer", this.input.nomorShipToCustomer)
      );
      row2.push(
        renderRow("11   Jenis Usaha Customer", this.input.jenisUsahaCustomer)
      );

      var exportedData = [
        {
          colGroups: [
            [
              {
                colGroups: [[]],
                colMd: 9,
                colClass: "mb5"
              },
              {
                colGroups: [
                  [
                    {
                      image: printInput.lambang,
                      imageWidth: 80,
                      imageHeight: 60
                    }
                  ]
                ],
                colMd: 3,
                colClass: "mb5"
              }
            ],
            [
              {
                text: "FORMULIR PEMESANAN BBM PENYALUR",
                align: "center",
                colClass: "h5,bold,mt10",
                decoration: "underline"
              }
            ],
            [
              {
                cTable: {
                  widths: [185, 5, "*"],
                  body: [
                    [
                      {
                        border: [false, false, false, false],
                        text: "Nomor",
                        fontSize: 9,
                        margin: [100, 0, 0, 0]
                      },
                      {
                        border: [false, false, false, false],
                        text: ":"
                      },
                      {
                        border: [false, false, false, true],
                        fillColor: "#FCDD06",
                        fontSize: 9,
                        text: this.input.nomorSuratJalan
                      }
                    ]
                  ]
                },
                colMd: 12,
                colClass: "mt5"
              },
              {
                cTable: {
                  widths: [185, 5, "*"],
                  body: row1
                },
                colMd: 12,
                colClass: "mt5"
              },
              renderDivider(),
              {
                cTable: {
                  widths: [185, 5, "*"],
                  body: row2
                },
                colMd: 12,
                colClass: "mt5"
              },
              renderDivider(),
              {
                cTable: {
                  widths: [185, 5, 20, "*", "*", 30],
                  body: [
                    [
                      {
                        border: [false, false, false, false],
                        text: "12   Jenis BBM",
                        fontSize: 9
                      },
                      {
                        border: [false, false, false, false],
                        text: ":"
                      },
                      {
                        border: [false, false, false, false],
                        text: this.input.jenisBBM,
                        fontSize: 9,
                        colSpan: 4
                      },
                      {},
                      {},
                      {}
                    ],
                    [
                      {
                        border: [false, false, false, false],
                        text: "13   Jumlah BBM (Liter)",
                        fontSize: 9
                      },
                      {
                        border: [false, false, false, false],
                        text: ":"
                      },
                      {
                        border: [false, false, false, false],
                        text: `${this.formatCurrencyWithComma(this.input.jumlahBBM)} Liter      * PBBKB ${this.PBBKBValue}        * PPH ${this.input.PPH}`,
                        fontSize: 9,
                        colSpan: 4
                      },
                      {},
                      {},
                      {}
                    ],
                    [
                      {
                        border: [false, false, false, false],
                        text: "14   Harga Jual ke end user / Liter",
                        fontSize: 9
                      },
                      {
                        border: [false, false, false, false],
                        text: ":"
                      },
                      {
                        border: [false, false, false, false],
                        text: "Rp.",
                        fontSize: 9,
                        fillColor: "#CCF0F4"
                      },
                      {
                        border: [false, false, false, false],
                        text: this.formatCurrencyWithComma(this.hargaJualEndUser),
                        alignment: "right",
                        fontSize: 9
                      },
                      {
                        border: [false, false, false, false],
                        text: "",
                        fontSize: 9,
                        fillColor: "#CCF0F4",
                        style: "bold"
                      },
                      {
                        border: [false, false, false, false],
                        text: "/ Liter",
                        fontSize: 9
                      }
                    ],
                    [
                      {
                        border: [false, false, false, false],
                        text: "15   Harga Dasar end user / Liter (tanpa pajak)",
                        fontSize: 9
                      },
                      {
                        border: [false, false, false, false],
                        text: ":"
                      },
                      {
                        border: [false, false, false, false],
                        text: "Rp.",
                        fontSize: 9
                      },
                      {
                        border: [false, false, false, false],
                        text: this.formatCurrencyWithComma(this.hargaDasarEndUser),
                        fontSize: 9,
                        alignment: "right"
                      },
                      {
                        border: [false, false, false, false],
                        text: "",
                        fontSize: 9
                      },
                      {
                        border: [false, false, false, false],
                        text: "/ Liter",
                        fontSize: 9
                      }
                    ],
                    [
                      {
                        border: [false, false, false, false],
                        text: "16   Harga Tebus Penyalur / Liter ",
                        fontSize: 9
                      },
                      {
                        border: [false, false, false, false],
                        text: ":"
                      },
                      {
                        border: [false, false, false, false],
                        text: "Rp.",
                        fontSize: 9,
                        fillColor: "#F6DDB7"
                      },
                      {
                        border: [false, false, false, false],
                        text: this.formatCurrencyWithComma(
                          this.input.hargaTebusPenyalur
                        ),
                        fontSize: 9,
                        alignment: "right",
                        fillColor: "#FDE00B"
                      },
                      {
                        border: [false, false, false, false],
                        text: "",
                        fontSize: 9,
                        fillColor: "#F6DDB7"
                      },
                      {
                        border: [false, false, false, false],
                        text: "/ Liter",
                        fontSize: 9
                      }
                    ],
                    [
                      {
                        border: [false, false, false, false],
                        text: "17   Harga Dasar Penyalur / Liter (tanpa pajak)",
                        fontSize: 9
                      },
                      {
                        border: [false, false, false, false],
                        text: ":"
                      },
                      {
                        border: [false, false, false, false],
                        text: "Rp.",
                        fontSize: 9
                      },
                      {
                        border: [false, false, false, false],
                        text: this.formatCurrencyWithComma(this.hargaDasarPenyalur),
                        fontSize: 9,
                        alignment: "right"
                      },
                      {
                        border: [false, false, false, false],
                        text: "",
                        fontSize: 9
                      },
                      {
                        border: [false, false, false, false],
                        text: "/ Liter",
                        fontSize: 9
                      }
                    ],
                    [
                      {
                        border: [false, false, false, false],
                        text: "18   Margin/ltr Penyalur (15-17)",
                        fontSize: 9
                      },
                      {
                        border: [false, false, false, false],
                        text: ":"
                      },
                      {
                        border: [false, false, false, false],
                        text: "Rp.",
                        fontSize: 9
                      },
                      {
                        border: [false, false, false, false],
                        text: this.formatCurrencyWithComma(this.marginPerLiter),
                        fontSize: 9,
                        alignment: "right"
                      },
                      {
                        border: [false, false, false, false],
                        text: "",
                        fontSize: 9
                      },
                      {
                        border: [false, false, false, false],
                        text: "/ Liter",
                        fontSize: 9
                      }
                    ],
                    [
                      {
                        border: [false, false, false, false],
                        text: "19   Cara Pembayaran",
                        fontSize: 9
                      },
                      {
                        border: [false, false, false, false],
                        text: ":"
                      },
                      {
                        border: [false, false, false, false],
                        text: this.input.caraPembayaran,
                        fontSize: 10,
                        alignment: "center",
                        colSpan: 2,
                        fillColor: "#D1E9C8",
                        style: ["bold"]
                      },
                      {},
                      {
                        border: [false, false, false, false],
                        text: "",
                        fontSize: 9
                      },
                      {
                        border: [false, false, false, false],
                        text: "Hari",
                        fontSize: 9
                      }
                    ],
                    [
                      {
                        border: [false, false, false, false],
                        text: "20   Dasar Pengenaan PPN dan PPH",
                        fontSize: 9
                      },
                      {
                        border: [false, false, false, false],
                        text: ":"
                      },
                      {
                        border: [false, false, false, false],
                        text: "Rp.",
                        fontSize: 9
                      },
                      {
                        border: [false, false, false, false],
                        text: this.formatCurrencyWithComma(this.dasarPengenaanPPNPPH),
                        fontSize: 9,
                        alignment: "right"
                      },
                      {
                        border: [false, false, false, false],
                        text: "",
                        fontSize: 9
                      },
                      {
                        border: [false, false, false, false],
                        text: "",
                        fontSize: 9
                      }
                    ],
                    [
                      {
                        border: [false, false, false, false],
                        text: "21   PPN",
                        fontSize: 9
                      },
                      {
                        border: [false, false, false, false],
                        text: ":"
                      },
                      {
                        border: [false, false, false, false],
                        text: "Rp.",
                        fontSize: 9
                      },
                      {
                        border: [false, false, false, false],
                        text: this.formatCurrencyWithComma(this.PPN),
                        fontSize: 9,
                        alignment: "right"
                      },
                      {
                        border: [false, false, false, false],
                        text: "",
                        fontSize: 9
                      },
                      {
                        border: [false, false, false, false],
                        text: "",
                        fontSize: 9
                      }
                    ],
                    [
                      {
                        border: [false, false, false, false],
                        text: "22   PBBKB (DPP end user x tarif PBBKB)",
                        fontSize: 9
                      },
                      {
                        border: [false, false, false, false],
                        text: ":"
                      },
                      {
                        border: [false, false, false, false],
                        text: "Rp.",
                        fontSize: 9
                      },
                      {
                        border: [false, false, false, false],
                        text: this.formatCurrencyWithComma(this.PBBKB),
                        fontSize: 9,
                        alignment: "right"
                      },
                      {
                        border: [false, false, false, false],
                        text: "",
                        fontSize: 9
                      },
                      {
                        border: [false, false, false, false],
                        text: "",
                        fontSize: 9
                      }
                    ],
                    [
                      {
                        border: [false, false, false, false],
                        text: "23   PPH",
                        fontSize: 9
                      },
                      {
                        border: [false, false, false, false],
                        text: ":"
                      },
                      {
                        border: [false, false, false, false],
                        text: "Rp.",
                        fontSize: 9
                      },
                      {
                        border: [false, false, false, false],
                        text: this.input.PPH,
                        fontSize: 9,
                        alignment: "right"
                      },
                      {
                        border: [false, false, false, false],
                        text: "",
                        fontSize: 9
                      },
                      {
                        border: [false, false, false, false],
                        text: "",
                        fontSize: 9
                      }
                    ],
                    [
                      {
                        border: [false, false, false, false],
                        text: "24   Total Nilai Transaksi termasuk pajak",
                        fontSize: 9
                      },
                      {
                        border: [false, false, false, false],
                        text: ":"
                      },
                      {
                        border: [false, false, false, false],
                        text: "Rp.",
                        fontSize: 9
                      },
                      {
                        border: [false, false, false, false],
                        text: this.formatCurrencyWithComma(this.total),
                        fontSize: 11,
                        alignment: "right",
                        style: ["bold"]
                      },
                      {
                        border: [false, false, false, false],
                        text: "",
                        fontSize: 9
                      },
                      {
                        border: [false, false, false, false],
                        text: "",
                        fontSize: 9
                      }
                    ],
                    [
                      {
                        border: [false, false, false, false],
                        text: "25   Bukti Setor Bank",
                        fontSize: 9
                      },
                      {
                        border: [false, false, false, false],
                        text: ":"
                      },
                      {
                        border: [false, false, false, false],
                        text: this.input.buktiSetorBank,
                        fontSize: 9,
                        colSpan: 4
                      },
                      {},
                      {},
                      {}
                    ],
                    [
                      {
                        border: [false, false, false, false],
                        text: "26   Alat angkut BBM Penyalur & tgl Pengisian",
                        fontSize: 9
                      },
                      {
                        border: [false, false, false, false],
                        text: ":"
                      },
                      {
                        border: [false, false, false, false],
                        text:
                          "(apabila kolom dibawah ini tidak mencukupi, harap membuat lampiran sendiri)",
                        fontSize: 9,
                        fillColor: "#D7E7C2",
                        italics: true,
                        colSpan: 4
                      },
                      {},
                      {},
                      {}
                    ],
                    [
                      {
                        border: [true, true, true, false],
                        text: "Tanggal Pengisian",
                        fontSize: 9
                      },
                      {
                        border: [false, false, false, false],
                        text: ":"
                      },
                      {
                        border: [true, true, true, false],
                        text: moment(this.input.tanggalPengisian).format(
                          "DD MMMM YYYY"
                        ),
                        fontSize: 10,
                        alignment: "center",
                        colSpan: 4
                      },
                      {},
                      {},
                      {}
                    ],
                    [
                      {
                        border: [true, true, true, false],
                        text: "No. Pol truk tanki / nama tongkang",
                        fontSize: 9
                      },
                      {
                        border: [false, false, false, false],
                        text: ":"
                      },
                      {
                        border: [true, true, true, false],
                        text: this.input.nomorPolisiTrukTanki,
                        fontSize: 10,
                        alignment: "center",
                        colSpan: 4
                      },
                      {},
                      {},
                      {}
                    ],
                    [
                      {
                        border: [true, true, true, false],
                        text: "Volume BBM per alat angkut (Liter)",
                        fontSize: 9
                      },
                      {
                        border: [false, false, false, false],
                        text: ":"
                      },
                      {
                        border: [true, true, true, false],
                        text: this.input.volumeBBMPerAlatAngkut,
                        fontSize: 10,
                        alignment: "center",
                        colSpan: 4
                      },
                      {},
                      {},
                      {}
                    ],
                    [
                      {
                        border: [true, true, true, true],
                        text: "Nama Supir/Nahkoda per alat angkut",
                        fontSize: 9
                      },
                      {
                        border: [false, false, false, false],
                        text: ":"
                      },
                      {
                        border: [true, true, true, true],
                        text: this.input.namaSopir,
                        fontSize: 10,
                        alignment: "center",
                        colSpan: 4
                      },
                      {},
                      {},
                      {}
                    ],
                    [
                      {
                        border: [false, false, false, false],
                        text: "27   Supply Point",
                        fontSize: 9
                      },
                      {
                        border: [false, false, false, false],
                        text: ":"
                      },
                      {
                        border: [false, false, false, false],
                        text: this.input.supplyPoint,
                        fontSize: 10,
                        style: ["bold"],
                        colSpan: 4
                      },
                      {},
                      {},
                      {}
                    ]
                  ]
                },
                colMd: 12,
                colClass: "mt5"
              },
              {
                cTable: {
                  heights: ["*", 30, "*"],
                  widths: ["*", "*", "*"],
                  body: [
                    [
                      {
                        border: [false, false, false, false],
                        text:
                          "Disetujui / Ditolak Oleh,\nPT. Pertamina Patra Niaga",
                        alignment: "center",
                        fontSize: 9
                      },
                      {
                        border: [false, false, false, false],
                        text: "",
                        alignment: "center",
                        fontSize: 9
                      },
                      {
                        border: [false, false, false, false],
                        text: `${this.input.tempat}, ${moment(
                          this.input.tanggal
                        ).format("DD/MM/YYYY")}`,
                        alignment: "center",
                        fontSize: 9
                      }
                    ],
                    [
                      {
                        border: [false, false, false, false],
                        text: "",
                        alignment: "center",
                        style: "span"
                      },
                      {
                        border: [false, false, false, false],
                        text: "",
                        alignment: "center",
                        style: "span"
                      },
                      {
                        border: [false, false, false, false],
                        text: "",
                        alignment: "center",
                        style: "span"
                      }
                    ],
                    [
                      {
                        border: [false, false, false, false],
                        text:
                          "(                                                          )",
                        alignment: "center",
                        fontSize: 9
                      },
                      {
                        border: [false, false, false, false],
                        text: "",
                        alignment: "center",
                        fontSize: 9
                      },
                      {
                        border: [false, false, false, false],
                        text: `(${this.input.oleh})`,
                        alignment: "center",
                        fillColor: "#FCDD06",
                        fontSize: 9
                      }
                    ]
                  ]
                },
                colClass: "mt5"
              }
            ]
          ]
        }
      ];
      print(exportedData, this.input.nomorSuratJalan, "potrait", "A4");
      this.cancel();
    },
    cancel() {
      this.$vuedals.close();
    },
    pad(n, width, z) {
      z = z || "0";
      n = n + "";
      return n.length >= width
        ? n
        : new Array(width - n.length + 1).join(z) + n;
    },
    formatCurrency(value) {
      let val = (value / 1).toFixed(0).replace(".", ",");
      return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    },
    formatCurrencyWithComma(x) {
      return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }
  },
  watch: {
    pembelian: {
      handler() {
        this.input = {
          nomorSuratJalan: this.data["nomor_po"],
          namaPenyalur: "PT. Borneo Mitra Bersama Sejati",
          nomorSKPMigas: "58/1/SKP/2017",
          alamatPenyalur: "Jln. Pasir Panjang No. 9 Pangkalan Bun",
          nomorSoldToPenyalur: "875440",
          NPWPPenyalur: "74.308.489.9*713.000",
          jenisCustomer: "",
          diserahkanKepada: "",
          alamatCustomer: "",
          salesDistrictCustomer: "",
          nomorShipToCustomer: "",
          jenisUsahaCustomer: "",
          jenisBBM: "",
          jumlahBBM: "",
          PBBKB: "",
          PPH: "",
          hargaJualEndUser: "",
          hargaDasarEndUser: "",
          hargaTebusPenyalur: "",
          hargaDasarPenyalur: "",
          marginPenyalur: "",
          jumlahHariPembayaran: "",
          buktiSetorBank: "",
          tanggalPengisian: "",
          nomorPolisiTrukTanki: "",
          volumeBBMPerAlatAngkut: "",
          namaSopir: "",
          supplyPoint: "",
          tempat: "Pangkalan Bun",
          tanggal: new Date(),
          oleh: "ALFIAN RIVAI"
        };
        if (this.pembelian[3].length > 0) {
          this.input = Object.assign(this.input, {
            jenisCustomer: this.pembelian[3][0]["jenis_customer"],
            diserahkanKepada: this.pembelian[3][0]["diserahkan_kepada"],
            alamatCustomer: this.pembelian[3][0]["alamat_customer"],
            salesDistrictCustomer: this.pembelian[3][0][
              "sales_district_customer"
            ],
            nomorShipToCustomer: this.pembelian[3][0]["nomor_ship_customer"],
            jenisUsahaCustomer: this.pembelian[3][0]["jenis_usaha_customer"],
            jenisBBM: this.pembelian[3][0]["jenis_bbm"],
            jumlahBBM: this.pembelian[3][0]["jumlah_bbm"],
            PBBKB: parseFloat(this.pembelian[3][0]["pbbkb"]),
            PPH: this.pembelian[3][0]["pph"],
            hargaTebusPenyalur: this.pembelian[3][0]["harga_tebus_penyalur"],
            caraPembayaran: this.pembelian[3][0]["cara_pembayaran"],
            buktiSetorBank: this.pembelian[3][0]["bukti_setor_bank"],
            nomorPolisiTrukTanki: this.pembelian[3][0]["nomor_polisi_truk_tanki"],
            volumeBBMPerAlatAngkut: this.pembelian[3][0]["volume_bbm_per_alat_angkut"],
            namaSopir: this.pembelian[3][0]["nama_sopir"],
            supplyPoint: this.pembelian[3][0]["supply_point"],
            // tempat: this.pembelian[3][0]["tempat"],
            // tanggal: moment(this.pembelian[3][0]["tanggal"]),
            // oleh: this.pembelian[3][0]["oleh"]
          });
          if(this.pembelian[3][0]["nomor_po"] !== "") 
            this.input.nomorSuratJalan = this.pembelian[3][0]["nomor_po"];
          if(this.pembelian[3][0]["nama_penyalur"] !== "") 
            this.input.namaPenyalur = this.pembelian[3][0]["nama_penyalur"];
          if(this.pembelian[3][0]["nomor_skp_migas"] !== "") 
            this.input.nomorSKPMigas = this.pembelian[3][0]["nomor_skp_migas"];
          if(this.pembelian[3][0]["alamat_penyalur"] !== "") 
            this.input.alamatPenyalur = this.pembelian[3][0]["alamat_penyalur"];
          if(this.pembelian[3][0]["nomor_sold_penyalur"] !== "") 
            this.input.nomorSoldToPenyalur = this.pembelian[3][0]["nomor_sold_penyalur"];
          if(this.pembelian[3][0]["npwp_penyalur"] !== "") 
            this.input.NPWPPenyalur = this.pembelian[3][0]["npwp_penyalur"];
          
          if(this.pembelian[3][0]["tanggal_pengisian"]!="" && this.pembelian[3][0]["tanggal_pengisian"]!="0000-00-00")
            this.input.tanggalPengisian = moment(this.pembelian[3][0]["tanggal_pengisian"])
          
        }
      },
      deep: true
    }
  },
  computed: {
    PBBKBValue() {
      let PBBKBVal = "";
      let value = this.input.PBBKB;
      if(value==1.1128) PBBKBVal = "17.17% dari 7.5%";
      if(value==1.1675) PBBKBVal = "90% dari 7.5%";
      if(value==1.175) PBBKBVal = "100% dari 7.5%";
      if(value==1.115) PBBKBVal = "20% dari 7.5%";
      if(value==1.1) PBBKBVal = "0% dari 7.5%";
      return PBBKBVal;
    },
    hargaJualEndUser() {
      let hargaJualEndUser = 0;
      if (this.input.hargaTebusPenyalur != "") {
        hargaJualEndUser = parseFloat(this.input.hargaTebusPenyalur) + 50;
      }
      return hargaJualEndUser.toFixed(3);
    },
    hargaDasarEndUser() {
      let hargaDasarEndUser = 0;
      if (this.input.PBBKB != "") {
        hargaDasarEndUser =
          parseFloat(this.hargaJualEndUser) / parseFloat(this.input.PBBKB);
      }
      return hargaDasarEndUser.toFixed(3);
    },
    hargaDasarPenyalur() {
      let hargaDasarPenyalur = 0;
      if (this.input.PBBKB != "" && this.input.hargaTebusPenyalur != "") {
        hargaDasarPenyalur =
          parseFloat(this.input.hargaTebusPenyalur) /
          parseFloat(this.input.PBBKB);
      }
      return hargaDasarPenyalur.toFixed(3);
    },
    marginPerLiter() {
      let margin = 0;
      if (this.input.PBBKB != "" && this.input.hargaTebusPenyalur != "") {
        margin = parseFloat(this.hargaDasarEndUser) - parseFloat(this.hargaDasarPenyalur);
      }
      return margin.toFixed(3);
    },
    dasarPengenaanPPNPPH() {
      let dasarPengenaanPPNPPH = 0;
      if(this.input.jumlahBBM && this.hargaDasarPenyalur != 0) {
        dasarPengenaanPPNPPH = parseFloat(this.hargaDasarPenyalur) * parseFloat(this.input.jumlahBBM);
      }
      return dasarPengenaanPPNPPH;
    },
    PPN() {
      let PPN = 0;
      if(this.dasarPengenaanPPNPPH!=0) {
        PPN = 0.1 * this.dasarPengenaanPPNPPH;
      }
      return PPN;
    },
    PBBKB() {
      let PBBKB = 0;
      if (this.input.PBBKB != "" && this.hargaDasarEndUser != 0) {
        let pengali = 0;
        let value = this.input.PBBKB;
        if(value==1.1128) pengali = 0.01288;
        if(value==1.1675) pengali = 0.0675;
        if(value==1.175) pengali = 0.075;
        if(value==1.115) pengali = 0.015;
        if(value==1.1) pengali = 1;
        PBBKB = parseFloat(this.hargaDasarEndUser * pengali) * parseFloat(this.input.jumlahBBM);
      }
      return PBBKB.toFixed(0);
    },
    PPH() {
      let PPH = 0;
      return PPH;
    },
    total() {
      let total = parseFloat(this.dasarPengenaanPPNPPH) + parseFloat(this.PPN) + parseFloat(this.PBBKB);
      return total;
    },
    extraQueryOptions() {
      let where = [
        {
          id_pembelian: this.data["id"]
        },
        {
          id_pembelian: this.data["id"]
        },
        {
          "id[!]": "-1"
        },
        {
          id_pembelian: this.data["id"]
        }
      ];
      return where;
    }
  }
};
</script>

<style lang="css">
.menu__content {
  z-index: 1100 !important;
}
</style>

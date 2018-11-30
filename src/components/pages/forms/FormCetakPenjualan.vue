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
          <v-text-field label="Nomor Surat Jalan" name="Nomor Surat Jalan" :value="input.nomorSuratJalan" :disabled="true"></v-text-field>
          <datepicker 
            label="Tanggal" 
            name="Tanggal" 
            v-model="input.tanggal" 
            :error-messages="errors.collect('Tanggal')" 
            v-validate="'required'" 
            value-format="DD MMMM YYYY"
            :z-index="1099"
          ></datepicker>
          <v-text-field label="Contact" name="Contact" v-model="input.nomorContact" :error-messages="errors.collect('Contact')" v-validate="'required'"></v-text-field>
          <v-text-field label="Mengetahui" name="Mengetahui" v-model="input.mengetahui" :error-messages="errors.collect('Mengetahui')" v-validate="'required'"></v-text-field>
        </v-card>
        <v-card flat class="pa-4" v-show="step==2">
          <v-text-field label="Driver" name="Driver" v-model="input.driver" :error-messages="errors.collect('Driver')" v-validate="{required: step==2}"></v-text-field>
          <v-text-field label="Nomor Kendaraan" name="Nomor Kendaraan" v-model="input.nomorKendaraan" :error-messages="errors.collect('Nomor Kendaraan')" v-validate="{required: step==2}"></v-text-field>
          <v-text-field label="Nomor Segel Atas" name="Nomor Segel Atas" v-model="input.nomorSegelAtas" :error-messages="errors.collect('Nomor Segel Atas')" v-validate="{required: step==2}"></v-text-field>
          <v-text-field label="Nomor Segel Bawah" name="Nomor Segel Bawah" v-model="input.nomorSegelBawah" :error-messages="errors.collect('Nomor Segel Bawah')" v-validate="{required: step==2}"></v-text-field>
          <v-text-field label="Nama Transportir" name="Nama Transportir" v-model="input.namaTransportir" :error-messages="errors.collect('Nama Transportir')" v-validate="{required: step==2}"></v-text-field>
          <v-text-field label="Warna Segel" name="Warna Segel" v-model="input.warnaSegel" :error-messages="errors.collect('Warna Segel')" v-validate="{required: step==2}"></v-text-field>
        </v-card>
        <v-card flat v-if="step==3">
          <v-layout row wrap>
            <v-flex md6>
              <div class="pa-4">
                <v-text-field label="QTY" name="QTY" v-model="inputBarang.qty" :error-messages="errors.collect('QTY')" v-validate="{required: step==3}"></v-text-field>
                <v-text-field label="Nama Barang" name="Nama Barang" v-model="inputBarang.namaBarang" :error-messages="errors.collect('Nama Barang')" v-validate="{required: step==3}"></v-text-field>
                <v-text-field label="SG" name="SG" v-model="inputBarang.sg" :error-messages="errors.collect('SG')" v-validate="{required: step==3}"></v-text-field>
                <v-text-field label="Temperatur" name="Temperatur" v-model="inputBarang.temperatur" :error-messages="errors.collect('Temperatur')" v-validate="{required: step==3}"></v-text-field>
                <v-text-field label="Tinggi Cairan" name="Tinggi Cairan" v-model="inputBarang.tinggiCairan" :error-messages="errors.collect('Tinggi Cairan')" v-validate="{required: step==3}"></v-text-field>
              </div>
              <div class="px-3 mb-4">
                <v-btn success @click="addBarang()">Tambah Barang</v-btn>
              </div>
            </v-flex>
            <v-flex md6 class="pa-4">
              <v-data-table
                v-bind:headers="[
                  { text: 'QTY', value: 'qty', sortable: false, align: 'center' },
                  { text: 'Nama Barang', value: 'nama_barang', sortable: false, align: 'center' },
                  { text: 'SG', value: 'sq', sortable: false, align: 'center' },
                  { text: 'Temperatur', value: 'temperatur', sortable: false, align: 'center' },
                  { text: 'Tinggi cairan', value: 'tinggi_cairan', sortable: false, align: 'center' },
                  { text: 'Aksi', value: 'aksi', sortable: false, align: 'center' }
                ]"
                :items="barang"
                hide-actions
                class="mt-4 elevation-1"
              >
              <template slot="items" scope="props">
                <td class="text-xs-center">{{ formatCurrency(props.item.qty) }}</td>
                <td class="text-xs-center">{{ props.item.nama_barang }}</td>
                <td class="text-xs-center">{{ props.item.sg }}</td>
                <td class="text-xs-center">{{ props.item.temperatur }}</td>
                <td class="text-xs-center">{{ props.item.tinggi_cairan }}</td>
                <td class="text-xs-center">
                  <v-btn icon ripple @click.stop="removeBarang(props.index)">
                    <v-icon class="subheading red--text text--lighten-1">close</v-icon>
                  </v-btn>
                </td>
              </template>
            </v-data-table>
            </v-flex>
          </v-layout>
        </v-card>
        <v-divider></v-divider>
        <v-card flat class="pa-3" v-if="step==3">
          <v-btn v-if="barang.length>0" dark class="deep-orange float-right" @click="cetak()">Cetak</v-btn>
          <v-btn v-if="barang.length>0" primary class="float-right" @click="saveBarang()">Simpan</v-btn>
        </v-card>
        <v-card flat class="pa-3" v-else>
          <v-btn primary @click="submit()">Simpan</v-btn>
          <v-btn error @click="next()">Next</v-btn>
        </v-card>
      </v-form>
    </v-flex>
    <query-service v-model="penjualan" from-file="penjualan_cetak" :extra-query-options="extraQueryOptions" :is-refresh="state.isRefresh"></query-service>
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
        tanggal: new Date(),
        nomorContact: "",
        mengetahui: "",
        driver: "",
        nomorKendaraan: "",
        nomorSegelAtas: "",
        nomorSegelBawah: "",
        namaTransportir: "",
        warnaSegel: ""
      },
      inputBarang: {
        qty: "",
        namaBarang: "",
        sg: "",
        temperatur: "",
        tinggiCairan: ""
      },
      barang: [],
      step: 1,
      penjualan: [],
      lambangBase64: "",
      settings: {}
    };
  },
  created() {
    this.$http.post("image/getbase64/lambang", {}).then(response => {
      this.lambangBase64 = response.data.base64;
    });
    this.input.nomorSuratJalan = this.data["nomor_do"];
  },
  methods: {
    submit() {
      this.$validator.validateAll().then(() => {
        if (!this.errors.any()) {
          if (this.step == 1) {
            const data = {
              id_penjualan: this.data["id"],
              tanggal: moment(this.input.tanggal).format("YYYY-MM-DD"),
              nomor_surat_jalan: this.input.nomorSuratJalan,
              contact: this.input.nomorContact,
              mengetahui: this.input.mengetahui
            };
            if (this.penjualan[0].length == 0) {
              this.$http
                .post("base/service/executeMutation", {
                  type: "insert",
                  name: "penjualan_detail",
                  data: data
                })
                .then(response => {
                  this.state.isRefresh = !this.state.isRefresh;
                });
            } else {
              this.$http.post("base/service/executeMutation", {
                id: this.penjualan[0][0]["id"],
                type: "update",
                name: "penjualan_detail",
                data: data
              });
            }
          }

          if (this.step == 2) {
            const data = {
              driver: this.input.driver,
              nomor_kendaraan: this.input.nomorKendaraan,
              nomor_segel_atas: this.input.nomorSegelAtas,
              nomor_segel_bawah: this.input.nomorSegelBawah,
              nama_transportir: this.input.namaTransportir,
              warna_segel: this.input.warnaSegel
            };
            this.$http.post("base/service/executeMutation", {
              id: this.penjualan[0][0]["id"],
              type: "update",
              name: "penjualan_detail",
              data: data
            });
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
    addBarang() {
      this.$validator.validateAll().then(() => {
        if (!this.errors.any()) {
          this.barang.push({
            id_penjualan: this.data["id"],
            qty: this.inputBarang.qty,
            nama_barang: this.inputBarang.namaBarang,
            sg: this.inputBarang.sg,
            temperatur: this.inputBarang.temperatur,
            tinggi_cairan: this.inputBarang.tinggiCairan
          });
          this.$validator.reset();
          this.inputBarang = {
            qty: "",
            namaBarang: "",
            sg: "",
            temperatur: "",
            tinggiCairan: ""
          };
        } else {
          $(`[name="${this.errors.items[0].field}"]`).focus();
        }
      });
    },
    removeBarang(index) {
      this.barang.splice(index, 1);
    },
    saveBarang() {
      this.$http
        .post("base/service/executeMutation", {
          id: this.data["id"],
          type: "delete",
          name: "penjualan_barang"
        })
        .then(() => {
          this.$http.post("base/service/executeMutation", {
            type: "insert",
            name: "penjualan_barang",
            data: this.barang
          });
        });
    },
    cetak() {
      var printInput = {
        lambang: this.lambangBase64,
        namaPT: this.settings.nama_pt,
        alamatPT: this.settings.alamat,
        // nomorTeleponPT: "0532-2031746",
        NPWP: this.settings.npwp,
        INU: this.settings.inu,
        aliasPT: this.settings.nama_alias,
        nomorSuratJalan: this.input.nomorSuratJalan,
        tanggal: moment(this.input.tanggal).format("DD MMMM YYYY"),
        customerName: this.data["nama"],
        contactPerson: this.input.nomorContact,
        nomorKendaraan: this.input.nomorKendaraan,
        nomorSegelAtas: this.input.nomorSegelAtas,
        nomorSegelBawah: this.input.nomorSegelBawah,
        namaTransportasi: this.input.namaTransportir,
        warnaSegel: this.input.warnaSegel,
        mengetahui: this.input.mengetahui,
        driver: this.input.driver
      };

      let header = [
        {
          text: printInput.namaPT,
          align: "center",
          colClass: "mt5,h6"
        }
      ];

      let alamatSplit = printInput.alamatPT.split(/\r?\n/);

      alamatSplit.forEach(item => {
        header.push({
          text: item,
          align: "center",
          colClass: "small"
        });
      });

      let tabelBarang = [
        [
          {
            text: "No",
            alignment: "center",
            style: ""
          },
          {
            text: "Nama Barang",
            alignment: "center",
            style: ""
          },
          {
            text: "Kwantitas/Satuan (LTR)",
            alignment: "center",
            style: ""
          },
          {
            text: "SG",
            alignment: "center",
            style: ""
          },
          {
            text: "Temperatur",
            alignment: "center",
            style: ""
          },
          {
            text: "Tinggi Cairan",
            alignment: "center",
            style: ""
          }
        ]
      ];
      this.barang.forEach((item, index) => {
        tabelBarang.push([
          {
            text: index + 1,
            alignment: "center",
            style: ""
          },
          {
            text: item.nama_barang,
            alignment: "center",
            style: ""
          },
          {
            text: this.formatCurrency(item.qty),
            alignment: "center",
            style: ""
          },
          {
            text: item.sg,
            alignment: "center",
            style: ""
          },
          {
            text: item.temperatur,
            alignment: "center",
            style: ""
          },
          {
            text: item.tinggi_cairan,
            alignment: "center",
            style: ""
          }
        ]);
      });
      var exportedData = [
        {
          colGroups: [
            [
              {
                colGroups: [
                  [
                    {
                      image: printInput.lambang,
                      imageWidth: 60,
                      imageHeight: 40
                    }
                  ]
                ],
                colMd: 2,
                colClass: "mb5"
              },
              {
                colGroups: [header],
                colMd: 7,
                colClass: "mb5"
              },
              {
                colGroups: [
                  [
                    {
                      text: `NPWP ${printInput.aliasPT} : ${printInput.NPWP}`,
                      colMd: 12,
                      colClass: "mt10,f8",
                      align: "right"
                    },
                    {
                      text: `INU NO : ${printInput.INU}`,
                      colMd: 12,
                      colClass: "mt5,f8",
                      align: "right"
                    }
                  ]
                ],
                colMd: 3,
                colClass: "mb5"
              },
              {
                cTable: {
                  widths: ["*"],
                  headerRows: 1,
                  body: [
                    [
                      {
                        border: [false, true, false, true],
                        text: "",
                        fillColor: "#999999"
                      }
                    ]
                  ]
                }
              }
            ],
            [
              {
                colGroups: [
                  [
                    {
                      text: "SURAT JALAN",
                      align: "center",
                      colClass: "f11,mt5",
                      decoration: "underline"
                    },
                    {
                      text: "DELIVERY ORDER (DO)",
                      align: "center",
                      colClass: "small"
                    }
                  ]
                ],
                colMd: 12
              }
            ],
            [
              {
                colGroups: [
                  [
                    {
                      formGroups: [
                        [
                          {
                            label: "Nomor Surat Jalan",
                            labelWidth: 90,
                            value: `: ${printInput.nomorSuratJalan}`,
                            style: "f9"
                          },
                          {
                            label: "Tanggal",
                            labelWidth: 90,
                            value: `: ${printInput.tanggal}`,
                            style: "f9"
                          },
                          {
                            label: "Kepada Yth./ To",
                            labelWidth: 90,
                            value: `: ${printInput.customerName}`,
                            style: "f9"
                          },
                          {
                            label: " ",
                            labelWidth: 90,
                            value: " "
                          },
                          {
                            label: "Contact Person",
                            labelWidth: 90,
                            value: `: ${printInput.contactPerson}`,
                            style: "f9"
                          }
                        ]
                      ]
                    }
                  ]
                ],
                colMd: 6
              },
              {
                colGroups: [
                  [
                    {
                      formGroups: [
                        [
                          {
                            label: "Nomor Kendaraan",
                            labelWidth: 90,
                            value: `: ${printInput.nomorKendaraan}`,
                            style: "f9"
                          },
                          {
                            label: "Nomor Segel Atas",
                            labelWidth: 90,
                            value: `: ${printInput.nomorSegelAtas}`,
                            style: "f9"
                          },
                          {
                            label: "Nomor Segel Bawah",
                            labelWidth: 90,
                            value: `: ${printInput.nomorSegelBawah}`,
                            style: "f9"
                          },
                          {
                            label: "Nama Transportasi",
                            labelWidth: 90,
                            value: `: ${printInput.namaTransportasi}`,
                            style: "f9"
                          },
                          {
                            label: "Warna Segel",
                            labelWidth: 90,
                            value: `: ${printInput.warnaSegel}`,
                            style: "f9"
                          }
                        ]
                      ]
                    }
                  ]
                ],
                colMd: 6
              }
            ],
            [
              {
                colGroups: [
                  [
                    {
                      cTable: {
                        widths: [20, 145, 120, 45, "*", "*"],
                        body: tabelBarang
                      }
                    }
                  ]
                ],
                colClass: "mt10"
              }
            ],
            [
              {
                colGroups: [
                  [
                    {
                      cTable: {
                        heights: [40, "*", "*"],
                        widths: ["*", "*", "*"],
                        body: [
                          [
                            {
                              border: [true, true, false, false],
                              text: "",
                              alignment: "center",
                              style: "span"
                            },
                            {
                              border: [true, true, false, false],
                              text: printInput.mengetahui,
                              alignment: "center",
                              style: "span"
                            },
                            {
                              border: [true, true, true, false],
                              text: printInput.driver,
                              alignment: "center",
                              style: "span"
                            }
                          ],
                          [
                            {
                              border: [true, false, false, false],
                              text: "Yang Menerima",
                              alignment: "center",
                              style: "small"
                            },
                            {
                              border: [true, false, false, false],
                              text: "Mengetahui",
                              alignment: "center",
                              style: "small"
                            },
                            {
                              border: [true, false, true, false],
                              text: "DRIVER",
                              alignment: "center",
                              style: "small"
                            }
                          ],
                          [
                            {
                              border: [true, false, false, true],
                              text: "Accepted by",
                              alignment: "center",
                              style: "small"
                            },
                            {
                              border: [true, false, false, true],
                              text: "Alknowledge",
                              alignment: "center",
                              style: "small"
                            },
                            {
                              border: [true, false, true, true],
                              text: "Delivered by",
                              alignment: "center",
                              style: "small"
                            }
                          ]
                        ]
                      }
                    }
                  ]
                ],
                colClass: ""
              }
            ],
            [
              {
                colGroups: [
                  [
                    {
                      text: "Perhatian :",
                      colClass: "f8"
                    },
                    {
                      text:
                        "Sebelum barang diterima dan dibongkar harap BBM HSD diperiksa dengan teliti dan seksama",
                      colClass: "f8"
                    },
                    {
                      text:
                        "barang yang sudah diterima tidak dapat dikembalikan/dikomplain",
                      colClass: "f8"
                    },
                    {
                      text: "Diterima dalam keadaan cukup dan murni",
                      colClass: "f8"
                    },
                    {
                      text: "Accept",
                      colClass: "f8"
                    }
                  ]
                ],
                colClass: "mt10,mb10"
              },
              {
                colGroups: [
                  [
                    {
                      text: "Keterangan :",
                      colClass: "f8"
                    },
                    {
                      text: `1. Lembar pertama warna putih / asli untuk ${
                        printInput.aliasPT
                      }`,
                      colClass: "f8"
                    },
                    {
                      text: "2. Lembar kedua warna merah untuk Customer",
                      colClass: "f8"
                    },
                    {
                      text: "3. Lembar ketiga warna kuning untuk Driver",
                      colClass: "f8"
                    },
                    {
                      text: "4. Lembar keempat warna hijau untuk Pengawas",
                      colClass: "f8"
                    }
                  ]
                ],
                colClass: ""
              }
            ]
          ]
        }
      ];
      print(exportedData, this.input.nomorSuratJalan, "landscape", "A5");
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
    }
  },
  watch: {
    penjualan: {
      handler() {
        if (this.penjualan[0].length > 0) {
          this.input = Object.assign(this.input, {
            tanggal: moment(this.penjualan[0][0]["tanggal"]),
            nomorContact: this.penjualan[0][0]["contact"],
            mengetahui: this.penjualan[0][0]["mengetahui"],
            driver: this.penjualan[0][0]["driver"],
            nomorKendaraan: this.penjualan[0][0]["nomor_kendaraan"],
            nomorSegelAtas: this.penjualan[0][0]["nomor_segel_atas"],
            nomorSegelBawah: this.penjualan[0][0]["nomor_segel_bawah"],
            namaTransportir: this.penjualan[0][0]["nama_transportir"],
            warnaSegel: this.penjualan[0][0]["warna_segel"]
          });
        }

        if (this.penjualan[1].length > 0) {
          this.barang = this.penjualan[1];
        }

        if (this.penjualan[2].length > 0) {
          // const alias = _.filter(this.penjualan[2], function(o) {
          //   return o.id == "nama_alias";
          // });
          this.settings = {};
          this.penjualan[2].forEach(item => {
            this.settings[item.id] = item.value;
          });
          // this.input.nomorSuratJalan = `${
          //   this.settings["nama_alias"]
          // } - ${this.pad(this.data["id"], 6)}`;
        }
      },
      deep: true
    }
  },
  computed: {
    extraQueryOptions() {
      let where = [
        {
          id_penjualan: this.data["id"]
        },
        {
          id_penjualan: this.data["id"]
        },
        {
          "id[!]": "-1"
        }
      ];
      return where;
    }
  }
};
</script>

<style lang="css"></style>

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
          <v-text-field label="Nomor PO" name="Nomor PO" :value="input.nomorSuratJalan" :disabled="true"></v-text-field>
          <datepicker 
            label="Tanggal" 
            name="Tanggal" 
            v-model="input.tanggal" 
            :error-messages="errors.collect('Tanggal')" 
            v-validate="'required'" 
            value-format="DD MMMM YYYY"
            :z-index="1099"
          ></datepicker>
          <v-text-field label="Mengetahui" name="Mengetahui" v-model="input.mengetahui" :error-messages="errors.collect('Mengetahui')" v-validate="'required'"></v-text-field>
          <v-text-field label="Approve Oleh" name="Approve Oleh" v-model="input.approveOleh" :error-messages="errors.collect('ApproveOleh')" v-validate="'required'"></v-text-field>
        </v-card>
        <v-card flat v-if="step==2">
          <v-layout row wrap>
            <v-flex md6>
              <div class="pa-4 detail">
                <v-text-field label="Nama Barang" name="Nama Barang" v-model="inputBarang.namaBarang" :error-messages="errors.collect('Nama Barang')" v-validate="{required: step==2}"></v-text-field>
                <v-text-field label="QTY" name="QTY" v-model="inputBarang.qty" :error-messages="errors.collect('QTY')" v-validate="{required: step==2}"></v-text-field>
                <v-text-field label="Harga / Liter" name="Harga" v-model="inputBarang.harga" :error-messages="errors.collect('Harga')" v-validate="{required: step==2}"></v-text-field>
                <v-text-field label="Total" name="Total" v-model="jumlahBayarFormat" :error-messages="errors.collect('Total')" v-validate="{required: step==2}" :disabled="true"></v-text-field>
              </div>
              <div class="px-3 mb-4">
                <v-btn success @click="addBarang()">Tambah Barang</v-btn>
              </div>
            </v-flex>
            <v-flex md6 class="pa-4">
              <v-data-table
                v-bind:headers="[
                  { text: 'Nama Barang', value: 'nama_barang', sortable: false, align: 'center' },
                  { text: 'QTY', value: 'qty', sortable: false, align: 'center' },
                  { text: 'Harga / Liter', value: 'harga', sortable: false, align: 'center' },
                  { text: 'Total', value: 'total', sortable: false, align: 'center' },
                  { text: 'Aksi', value: 'aksi', sortable: false, align: 'center' }
                ]"
                :items="barang"
                hide-actions
                class="mt-4 elevation-1"
              >
              <template slot="items" scope="props">
                <td class="text-xs-center">{{ props.item.nama_barang }}</td>
                <td class="text-xs-center">{{ props.item.qty }}</td>
                <td class="text-xs-center">{{ formatCurrency(props.item.harga) }}</td>
                <td class="text-xs-center">{{ formatCurrency(props.item.total) }}</td>
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
        <v-card flat class="pa-3" v-if="step==2">
          <v-btn v-if="barang.length>0" dark class="deep-orange float-right" @click="cetak()">Cetak</v-btn>
          <v-btn v-if="barang.length>0" primary class="float-right" @click="saveBarang()">Simpan</v-btn>
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
        tanggal: new Date(),
        mengetahui: "",
        approveOleh: ""
      },
      inputBarang: {
        namaBarang: "",
        qty: "",
        harga: ""
      },
      barang: [],
      step: 1,
      pembelian: [],
      lambangBase64: "",
      settings: {}
    };
  },
  created() {
    this.$http.post("image/getbase64/lambang", {}).then(response => {
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
              tanggal: moment(this.input.tanggal).format("YYYY-MM-DD"),
              mengetahui: this.input.mengetahui,
              approve_oleh: this.input.approveOleh
            };
            if (this.pembelian[0].length == 0) {
              this.$http
                .post("base/service/executeMutation", {
                  type: "insert",
                  name: "pembelian_detail",
                  data: data
                })
                .then(response => {
                  this.state.isRefresh = !this.state.isRefresh;
                });
            } else {
              this.$http.post("base/service/executeMutation", {
                id: this.pembelian[0][0]["id"],
                type: "update",
                name: "pembelian_detail",
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
    addBarang() {
      this.$validator.validateAll().then(() => {
        if (!this.errors.any()) {
          this.barang.push({
            id_pembelian: this.data["id"],
            qty: this.inputBarang.qty,
            nama_barang: this.inputBarang.namaBarang,
            harga: this.inputBarang.harga,
            total: this.jumlahBayar
          });
          this.$validator.reset();
          this.inputBarang = {
            qty: "",
            namaBarang: "",
            harga: ""
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
          name: "pembelian_barang"
        })
        .then(() => {
          this.$http.post("base/service/executeMutation", {
            type: "insert",
            name: "pembelian_barang",
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
        jenisPembayaran: this.data["jenis_bayar"],
        TOP: this.data["top"],
        tanggalJatuhTempo: moment(this.data["jatuh_tempo"]).format("DD MMMM YYYY"),
        statusBayar: this.data["status_bayar"],
        mengetahui: this.input.mengetahui,
        approveOleh: this.input.approveOleh
      };

      let tabelBarang = [
        [
          {
            text: "No",
            alignment: "center",
            style: "small"
          },
          {
            text: "Nama Barang",
            alignment: "center",
            style: "small"
          },
          {
            text: "QTY",
            alignment: "center",
            style: "small"
          },
          {
            text: "Harga",
            alignment: "center",
            style: "small"
          },
          {
            text: "Total",
            alignment: "center",
            style: "small"
          }
        ]
      ];
      this.barang.forEach((item, index) => {
        tabelBarang.push([
          {
            text: index + 1,
            alignment: "center",
            style: "small"
          },
          {
            text: item.nama_barang,
            alignment: "center",
            style: "small"
          },
          {
            text: item.qty,
            alignment: "center",
            style: "small"
          },
          {
            text: this.formatCurrency(item.harga),
            alignment: "center",
            style: "small"
          },
          {
            text: this.formatCurrency(item.total),
            alignment: "center",
            style: "small"
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
                colGroups: [
                  [
                    {
                      text: printInput.namaPT,
                      align: "center",
                      colClass: "h6"
                    },
                    {
                      text: printInput.alamatPT,
                      align: "center",
                      colClass: "small"
                    }
                    // {
                    //   text: printInput.nomorTeleponPT,
                    //   align: "center",
                    //   colClass: "small"
                    // }
                  ]
                ],
                colMd: 7,
                colClass: "mb5"
              },
              {
                colGroups: [
                  [
                    {
                      text: `NPWP ${printInput.aliasPT} : ${printInput.NPWP}`,
                      colMd: 12,
                      colClass: "mt10,small",
                      align: "right"
                    },
                    {
                      text: `INU NO : ${printInput.INU}`,
                      colMd: 12,
                      colClass: "mt5,small",
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
                      text: "PURCHASE ORDER (PO)",
                      align: "center",
                      colClass: "mb5,small"
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
                            label: "Nomor PO",
                            labelWidth: 60,
                            value: `: ${printInput.nomorSuratJalan}`,
                            style: "small"
                          },
                          {
                            label: "Tanggal Beli",
                            labelWidth: 60,
                            value: `: ${printInput.tanggal}`,
                            style: "small"
                          },
                          {
                            label: "Cash / Kredit",
                            labelWidth: 60,
                            value: `: ${printInput.jenisPembayaran}`,
                            style: "small"
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
                            label: "TOP",
                            labelWidth: 70,
                            value: `: ${printInput.TOP}`,
                            style: "small"
                          },
                          {
                            label: "Tanggal Jatuh Tempo",
                            labelWidth: 70,
                            value: `: ${printInput.tanggalJatuhTempo}`,
                            style: "small"
                          },
                          {
                            label: "Status Bayar",
                            labelWidth: 70,
                            value: `: ${printInput.statusBayar}`,
                            style: "small"
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
                        widths: [20, 200, "*", "*", "*"],
                        body: tabelBarang
                      }
                    }
                  ]
                ],
                colClass: "mt5"
              }
            ],
            [
              {
                colGroups: [
                  [
                    {
                      cTable: {
                        heights: [50, "*"],
                        widths: ["*", "*"],
                        body: [
                          [
                            {
                              border: [true, true, false, false],
                              text: "Mengetahui",
                              alignment: "center",
                              style: "small"
                            },
                            {
                              border: [true, true, true, false],
                              text: "Approve Oleh",
                              alignment: "center",
                              style: "small"
                            }
                          ],
                          [
                            {
                              border: [true, false, false, true],
                              text: printInput.mengetahui,
                              alignment: "center",
                              style: "span"
                            },
                            {
                              border: [true, false, true, true],
                              text: printInput.approveOleh,
                              alignment: "center",
                              style: "span"
                            }
                          ]
                        ]
                      }
                    }
                  ]
                ],
                colClass: "mt20"
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
    pembelian: {
      handler() {
        if (this.pembelian[0].length > 0) {
          this.input = Object.assign(this.input, {
            tanggal: moment(this.pembelian[0][0]["tanggal"]),
            mengetahui: this.pembelian[0][0]["mengetahui"],
            approveOleh: this.pembelian[0][0]["approve_oleh"]
          });
        }

        if (this.pembelian[1].length > 0) {
          this.barang = this.pembelian[1];
        }

        if (this.pembelian[2].length > 0) {
          // const alias = _.filter(this.pembelian[2], function(o) {
          //   return o.id == "nama_alias";
          // });
          this.settings = {};
          this.pembelian[2].forEach(item => {
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
    jumlahBayar() {
      let jumlahBayar = 0;
      if (this.inputBarang.qty != "" && this.inputBarang.harga != "") {
        jumlahBayar = this.inputBarang.qty * this.inputBarang.harga;
      }
      return jumlahBayar;
    },
    jumlahBayarFormat() {
      return this.formatCurrency(this.jumlahBayar);
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
        }
      ];
      return where;
    }
  }
};
</script>

<style lang="css"></style>

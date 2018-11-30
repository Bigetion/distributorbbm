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
          <v-text-field label="PbbKB" name="PbbKB" v-model="input.pbbkb" :error-messages="errors.collect('PbbKB')" v-validate="'required|decimal'"></v-text-field>
          <v-text-field label="Kepada Yth." name="Kepada" v-model="input.kepada" :error-messages="errors.collect('Kepada')" v-validate="'required'" multi-line></v-text-field>
          <v-text-field label="Note" name="Note" v-model="input.note" :error-messages="errors.collect('Note')" v-validate="'required'" multi-line :rows="8"></v-text-field>
        </v-card>
        <v-card flat v-if="step==2">
          <v-layout row wrap>
            <v-flex md6>
              <div class="pa-4 detail">
                <v-text-field label="Jenis BBM" name="Jenis BBM" v-model="inputBarang.namaBarang" :error-messages="errors.collect('Jenis BBM')" v-validate="{required: step==2}"></v-text-field>
                <v-text-field label="QTY" name="QTY" v-model="inputBarang.qty" :error-messages="errors.collect('QTY')" v-validate="{required: step==2}"></v-text-field>
                <v-text-field label="Harga Satuan" name="Harga Satuan" v-model="inputBarang.harga" :error-messages="errors.collect('Harga Satuan')" v-validate="{required: step==2}"></v-text-field>
                <v-text-field label="Diskon" name="Diskon" v-model="inputBarang.diskon" :error-messages="errors.collect('Diskon')" v-validate="{required: step==2}"></v-text-field>
                <v-text-field label="Jumlah" name="Jumlah" v-model="jumlahBayarFormat" :error-messages="errors.collect('Jumlah')" v-validate="{required: step==2}" :disabled="true"></v-text-field>
              </div>
              <div class="px-3 mb-4">
                <v-btn success @click="addBarang()">Tambah Barang</v-btn>
              </div>
            </v-flex>
            <v-flex md6 class="pa-4">
              <v-data-table
                v-bind:headers="[
                  { text: 'Jenis BBM', value: 'nama_barang', sortable: false, align: 'center' },
                  { text: 'QTY', value: 'qty', sortable: false, align: 'center' },
                  { text: 'Harga Satuan', value: 'harga', sortable: false, align: 'center' },
                  { text: 'Discount', value: 'diskon', sortable: false, align: 'center' },
                  { text: 'Jumlah', value: 'total', sortable: false, align: 'center' },
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
                <td class="text-xs-center">{{ props.item.diskon }}%</td>
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
        kepada:
          "PT. PERTAMINA PATRA NIAGA\nGedung Wisma Tugu II, 2nd Floor, Jl. HR. Rasuna Said\nKav C7-9, Kuningan - Daerah Khusu Ibukota Jakarta\nUp. Bp. Zuhdy Munthaha",
        note:
          "1. Customer          : PT. Kalimantan Sumber Energi\n2. Pembayaran     : Bank Garansi\n3. Suplly Point      : TBBM SAMPIT\n4. TOP                    : 45 Hari\n5. LO                       : 5 KL\n6. SP                       : 896814\n7. SH                       : 906292 ",
        pbbkb: 0
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
              kepada: this.input.kepada,
              note: this.input.note,
              pbbkb: this.input.pbbkb
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
            diskon: this.inputBarang.diskon,
            total: this.jumlahBayar
          });
          this.$validator.reset();
          this.inputBarang = {
            qty: "",
            namaBarang: "",
            harga: "",
            diskon: 0
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
        kepada: this.input.kepada,
        note: this.input.note,
        pbbkb: this.input.pbbkb,
        ttd: this.ttdBase64
      };

      let header = [
        {
          text: printInput.namaPT,
          align: "center",
          colClass: "h5"
        }
      ];

      let alamatSplit = printInput.alamatPT.split(/\r?\n/);

      alamatSplit.forEach(item => {
        header.push({
          text: item,
          align: "center",
          colClass: "small,mt5,f11"
        });
      });

      let kepadaYth = [
        {
          text: `Nomor PO : ${printInput.nomorSuratJalan}`,
          colMd: 12,
          colClass: "f11"
        },
        {
          text: "Kepada Yth.",
          colMd: 12,
          colClass: "mt15,f11"
        }
      ];
      let kepadaSplit = printInput.kepada.split(/\r?\n/);

      kepadaSplit.forEach(item => {
        kepadaYth.push({
          text: item,
          align: "left",
          colClass: "f11"
        });
      });

      let note = [
        {
          text: "NOTE :",
          colMd: 12,
          colClass: "bold,f11"
        }
      ];
      let noteSplit = printInput.note.split(/\r?\n/);

      noteSplit.forEach(item => {
        note.push({
          text: item,
          colClass: "bold,f11"
        });
      });

      let tabelBarang = [
        [
          {
            text: "No",
            alignment: "center",
            style: "bold"
          },
          {
            text: "Jenis BBM",
            alignment: "center",
            style: "bold"
          },
          {
            text: "QTY",
            alignment: "center",
            style: "bold"
          },
          {
            text: "Harga",
            alignment: "center",
            style: "bold"
          },
          {
            text: "Discount",
            alignment: "center",
            style: "bold"
          },
          {
            text: "Jumlah",
            alignment: "center",
            style: "bold"
          }
        ]
      ];
      let total = 0;
      let totalBayar = 0;
      this.barang.forEach((item, index) => {
        total += parseFloat(item.total);
        totalBayar += parseFloat(item.total);
        const totalPPN = parseFloat(item.total) * 0.1;
        totalBayar += parseFloat(totalPPN);
        tabelBarang.push([
          {
            text: index + 1,
            alignment: "center",
            style: "f9"
          },
          {
            text: item.nama_barang,
            alignment: "left",
            style: "f9"
          },
          {
            text: item.qty,
            alignment: "center",
            style: "f9"
          },
          {
            text: this.formatCurrency(item.harga),
            alignment: "center",
            style: "f9"
          },
          {
            text: `${item.diskon}%`,
            alignment: "center",
            style: "f9"
          },
          {
            text: this.formatCurrency(item.total),
            alignment: "right",
            style: "f9"
          }
        ]);
        tabelBarang.push([
          {
            text: "",
            alignment: "center",
            style: "f9"
          },
          {
            text: "PPN 10%",
            alignment: "left",
            style: "f9"
          },
          {
            text: "",
            alignment: "center",
            style: "f9"
          },
          {
            text: "",
            alignment: "center",
            style: "f9"
          },
          {
            text: "",
            alignment: "center",
            style: "f9"
          },
          {
            text: this.formatCurrency(totalPPN),
            alignment: "right",
            style: "f9"
          }
        ]);
      });

      const totalPbbKB = parseFloat(total) * parseFloat(parseFloat(printInput.pbbkb)/100);
      totalBayar += parseFloat(totalPbbKB);
      tabelBarang.push([
        {
          text: `PbbKB ${printInput.pbbkb}%`,
          alignment: "left",
          style: "f9",
          colSpan: 5
        },
        {},
        {},
        {},
        {},
        {
          text: this.formatCurrency(totalPbbKB),
          alignment: "right",
          style: "f9"
        }
      ]);
      
      tabelBarang.push([
        {
          text: "Total",
          alignment: "left",
          style: ["f9", "bold"],
          colSpan: 5
        },
        {},
        {},
        {},
        {},
        {
          text: this.formatCurrency(totalBayar),
          alignment: "right",
          style: ["f10", "bold"]
        }
      ]);

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
                text: "",
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
              },
              {
                colGroups: [
                  [
                    {
                      text: `Pangkalan Bun, ${printInput.tanggal}`,
                      colMd: 12,
                      colClass: "mt10,f10",
                      align: "right"
                    }
                  ]
                ],
                colClass: "mb5"
              },
              {
                colGroups: [kepadaYth]
              },
              {
                colGroups: [
                  [
                    {
                      text: `NPWP ${printInput.namaPT} : ${printInput.NPWP}`,
                      colMd: 12,
                      colClass: "mt10,bold,f11"
                    },
                    {
                      text: `IZIN NIAGA UMUM : ${printInput.INU}`,
                      colMd: 12,
                      colClass: "f11,bold"
                    },
                    {
                      text: "Dengan Hormat,",
                      colMd: 12,
                      colClass: "mt10,f11"
                    },
                    {
                      text: `Bersama ini kami order BBM Solar untuk kebutuhan ${
                        printInput.namaPT
                      } : `,
                      colMd: 12,
                      colClass: "mt10,f11"
                    },
                    {
                      cTable: {
                        widths: [20, 200, "*", "*", "*", "*"],
                        body: tabelBarang
                      },
                      colMd: 12,
                      colClass: "mt10"
                    },
                    {
                      colGroups: [note],
                      colMd: 12,
                      colClass: "mt10"
                    },
                    {
                      text:
                        "Demikian PO dari kami, atas bantuan dan kerjasamanya kami ucapkan terimakasih.",
                      colMd: 12,
                      colClass: "mt40,f11"
                    },
                    {
                      text: "Hormat Kami,",
                      colMd: 12,
                      colClass: "mt30,f11"
                    },
                    {
                      text: "Alfian Rivai",
                      colMd: 12,
                      colClass: "bold,mt50,f11",
                      decoration: "underline"
                    },
                    {
                      text: "Direktur",
                      colMd: 12,
                      colClass: "f11"
                    }
                  ]
                ]
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
    }
  },
  watch: {
    pembelian: {
      handler() {
        if (this.pembelian[0].length > 0) {
          this.input = Object.assign(this.input, {
            tanggal: moment(this.pembelian[0][0]["tanggal"])
          });

          if (this.pembelian[0][0]["kepada"] != "")
            this.input.kepada = this.pembelian[0][0]["kepada"];
          if (this.pembelian[0][0]["note"] != "")
            this.input.note = this.pembelian[0][0]["note"];
          if (this.pembelian[0][0]["pbbkb"] != 0)
            this.input.pbbkb = this.pembelian[0][0]["pbbkb"];
        }

        if (this.pembelian[1].length > 0) {
          this.barang = this.pembelian[1];
        }

        if (this.pembelian[2].length > 0) {
          this.settings = {};
          this.pembelian[2].forEach(item => {
            this.settings[item.id] = item.value;
          });
        }
      },
      deep: true
    }
  },
  computed: {
    jumlahBayar() {
      let jumlahBayar = 0;
      if (this.inputBarang.qty != "" && this.inputBarang.harga != "") {
        jumlahBayar = this.inputBarang.qty * this.inputBarang.harga * 1000;
      }
      if (this.inputBarang.diskon != 0) {
        jumlahBayar =
          jumlahBayar - jumlahBayar * (this.inputBarang.diskon / 100);
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

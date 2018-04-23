<template>
  <div>
    <v-form v-model="valid" ref="form">
      <v-card flat class="pa-3">
        <v-layout row wrap class="detail">
          <v-flex md6 class="pa-2">
            <v-text-field label="Nama PT" name="Nama PT" v-model="input.namaPT" :error-messages="errors.collect('Nama PT')" v-validate="'required'" :disabled="!state.isEdit"></v-text-field>
          </v-flex>
          <v-flex md6 class="pa-2">
            <v-text-field label="NPWP" name="NPWP" v-model="input.NPWP" :error-messages="errors.collect('NPWP')" v-validate="'required'" :disabled="!state.isEdit"></v-text-field>
          </v-flex>
          <v-flex md6 class="pa-2">
            <v-text-field label="No. Surat Jalan" name="No. Surat Jalan" v-model="input.noSuratJalan" :error-messages="errors.collect('No. Surat Jalan')" v-validate="'required'" :disabled="!state.isEdit"></v-text-field>
          </v-flex>
          <v-flex md6 class="pa-2">
            <v-text-field label="Alamat" name="Alamat" v-model="input.alamat" :error-messages="errors.collect('Alamat')" v-validate="'required'" :disabled="!state.isEdit"></v-text-field>
          </v-flex>
          <v-flex md6 class="pa-2">
            <v-text-field label="Nama Alias" name="Nama Alias" v-model="input.namaAlias" :error-messages="errors.collect('Nama Alias')" v-validate="'required'" :disabled="!state.isEdit"></v-text-field>
          </v-flex>
          <v-flex md6>
            <div class="pa-2">
              <span class="picture-preview-label">Lambang</span><br>
              <picture-input
                v-if="state.isEdit"
                @change="onChangeLambang" 
                width="250" 
                height="250"
                accept="image/jpeg,image/png" 
                size="5"
                :crop="false"
                :hideChangeButton="true"
                :customStrings="{
                  drag: 'Upload Lambang'
                }"
                class="preview-container"
              ></picture-input>
              <div class="preview-container" v-if="!state.isEdit">
                <img v-if="state.isViewImage" class="picture-preview" :src="lambangURL" width="250" height="250">
              </div>
            </div>
          </v-flex>
        </v-layout>
      </v-card>
      <v-divider></v-divider>
      <v-card flat class="pa-3" v-if="state.isEdit">
        <v-btn success @click="submit()">Simpan</v-btn>
        <v-btn error @click="setIsEdit(false)">Batal</v-btn>
      </v-card>
      <v-card flat class="pa-3" v-else>
        <v-btn primary @click="setIsEdit(true)">Edit</v-btn>
        <v-btn success @click="tesPdf()">Tes Print</v-btn>
      </v-card>
    </v-form>
    <query-service v-model="settings" from-file="settings" :extra-query-options="queryServiceExtraQuery" :is-refresh="state.isRefresh"></query-service>
  </div>
</template>

<script>
import { print } from "./../../utils/exportDownload";
export default {
  data: () => ({
    lambangURL: process.env.API_URL + "image/get/lambang",
    lambangBase64: "",
    state: {
      isEdit: false,
      isRefresh: false,
      isViewImage: true
    },
    input: {
      namaPT: "",
      NPWP: "",
      noSuratJalan: "",
      alamat: "",
      namaAlias: "",
      lambang: {}
    },
    settings: [],
    settingInput: {},
    isLoading: false
  }),
  created() {
    this.getLambang();
  },
  methods: {
    getLambang() {
      this.$http.post("image/getbase64/lambang", {}).then(response => {
        this.lambangBase64 = response.data.base64;
      });
    },
    onChangeLambang(a) {
      this.input.lambang = a;
    },
    setDefaultData(name, value) {
      this.$http.post("base/service/executeMutation", {
        type: "insert",
        name: "settings",
        data: {
          id: name,
          value: value
        }
      });
    },
    updateDefaultData(name, value) {
      this.$http.post("base/service/executeMutation", {
        id: name,
        type: "update",
        name: "settings",
        data: {
          value: value
        }
      });
    },
    updateLambang() {
      this.$http.post("base/upload/image", {
        images: [
          {
            base64: this.input.lambang,
            name: "lambang"
          }
        ]
      });
    },
    setIsEdit(condition) {
      this.state.isEdit = condition;
      if (condition) {
        this.input.lambang = "";
      } else {
        this.state.isRefresh = !this.state.isRefresh;
        this.$validator.clean();
      }
    },
    submit() {
      this.$validator.validateAll().then(() => {
        if (!this.errors.any()) {
          if (this.input.namaPT != this.settingInput.namaPT)
            this.updateDefaultData("nama_pt", this.input.namaPT);
          if (this.input.NPWP != this.settingInput.NPWP)
            this.updateDefaultData("npwp", this.input.NPWP);
          if (this.input.noSuratJalan != this.settingInput.noSuratJalan)
            this.updateDefaultData(
              "nomor_surat_jalan",
              this.input.noSuratJalan
            );
          if (this.input.alamat != this.settingInput.alamat)
            this.updateDefaultData("alamat", this.input.alamat);
          if (this.input.namaAlias != this.settingInput.namaAlias)
            this.updateDefaultData("nama_alias", this.input.namaAlias);
          this.state.isEdit = false;

          if (this.input.lambang != "") {
            this.updateLambang();
            this.state.isViewImage = false;
            setTimeout(() => {
              this.state.isViewImage = true;
              this.getLambang();
            }, 200);
          }
        } else {
          $(`[name="${this.errors.items[0].field}"]`).focus();
        }
      });
    },
    tesPdf() {
      var exportedData = [
        {
          colGroups: [
            [
              {
                colGroups: [
                  [
                    {
                      image: this.lambangBase64,
                      imageWidth: 100,
                      imageHeight: 60
                    }
                  ]
                ],
                colMd: 2
              },
              {
                colGroups: [
                  [
                    {
                      text: this.input.namaPT,
                      align: "center",
                      colClass: "h4"
                    },
                    {
                      text: this.input.alamat,
                      align: "center"
                    }
                  ]
                ],
                colMd: 7
              },
              {
                colGroups: [
                  [
                    {
                      text: `NPWP KSE : ${this.input.NPWP}`,
                      colMd: 12,
                      colClass: "mt10"
                    },
                    {
                      text: `INU NO : -`,
                      colMd: 12
                    }
                  ]
                ],
                colMd: 3
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
                      colClass: "h5,mt10,mb5"
                    },
                    {
                      text: "DELIVERY ORDER (DO)",
                      align: "center",
                      colClass: "mb10"
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
                            value: ": -"
                          },
                          {
                            label: "Tanggal",
                            value: ": -"
                          },
                          {
                            label: "Kepada Yth./ To",
                            value: ": -"
                          },
                          {
                            label: " ",
                            value: " "
                          },
                          {
                            label: "Contact Person",
                            value: ": -"
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
                            value: ": -"
                          },
                          {
                            label: "Nomor Segel Atas",
                            value: ": -"
                          },
                          {
                            label: "Nomor Segel Bawah",
                            value: ": -"
                          },
                          {
                            label: "Nama Transportasi",
                            value: ": -"
                          },
                          {
                            label: "Warna Segel",
                            value: ": -"
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
                      table: {
                        fields: [
                          {
                            title: "No.",
                            id: "no"
                          },
                          {
                            title: "Nama Barang",
                            id: "nama_barang"
                          },
                          {
                            title: "Kwantitas",
                            id: "qty"
                          },
                          {
                            title: "SG",
                            id: "sg"
                          },
                          {
                            title: "Temperatur",
                            id: "temperatur"
                          },
                          {
                            title: "Cairan",
                            id: "cairan"
                          }
                        ],
                        data: [
                          {
                            no: 1,
                            nama_barang: "HSD INDUSTRI",
                            qty: "10.000",
                            sg: "0,387",
                            temperatur: "-",
                            cairan: "-"
                          }
                        ]
                      }
                    }
                  ]
                ],
                colMd: 12,
                colClass: "mt20"
              }
            ],
            [
              {
                colGroups: [
                  [
                    {
                      cTable: {
                        heights: [50, "*", "*"],
                        widths: ["*", "*", "*"],
                        body: [
                          [
                            {
                              border: [true, true, false, false],
                              text: "",
                              alignment: "center"
                            },
                            {
                              border: [true, true, false, false],
                              text: "",
                              alignment: "center"
                            },
                            {
                              border: [true, true, true, false],
                              text: "",
                              alignment: "center"
                            }
                          ],
                          [
                            {
                              border: [true, false, false, false],
                              text: "Yang Menerima",
                              alignment: "center",
                              style: "span"
                            },
                            {
                              border: [true, false, false, false],
                              text: "Mengetahui",
                              alignment: "center",
                              style: "span"
                            },
                            {
                              border: [true, false, true, false],
                              text: "DRIVER",
                              alignment: "center",
                              style: "span"
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
                colClass: "mt5"
              }
            ],
            [
              {
                colGroups: [
                  [
                    {
                      text: "Perhatian :",
                      colClass: "small"
                    },
                    {
                      text:
                        "Sebelum barang diterima dan dibongkar harap BBM HSD diperiksa dengan teliti dan seksama",
                      colClass: "small"
                    },
                    {
                      text:
                        "barang yang sudah diterima tidak dapat dikembalikan/dikomplain",
                      colClass: "small"
                    },
                    {
                      text: "Diterima dalam keadaan cukup dan murni",
                      colClass: "small"
                    },
                    {
                      text: "Accept",
                      colClass: "small"
                    }
                  ]
                ],
                colClass: "mt5"
              },
              {
                colGroups: [
                  [
                    {
                      text: "Keterangan :",
                      colClass: "small"
                    },
                    {
                      text: "1. Lembar pertama warna putih / asli untuk KSE",
                      colClass: "small"
                    },
                    {
                      text: "2. Lembar kedua warna merah untuk Customer",
                      colClass: "small"
                    },
                    {
                      text: "3. Lembar ketiga warna kuning untuk Driver",
                      colClass: "small"
                    },
                    {
                      text: "4. Lembar keempat warna hijau untuk Pengawas",
                      colClass: "small"
                    }
                  ]
                ],
                colClass: "mt10"
              }
            ]
          ]
        }
      ];
      print(exportedData, "tes", "landscape");
    }
  },
  computed: {
    queryServiceExtraQuery() {
      let where = undefined;
      where = [
        {
          id: "nama_pt"
        },
        {
          id: "npwp"
        },
        {
          id: "nomor_surat_jalan"
        },
        {
          id: "alamat"
        },
        {
          id: "nama_alias"
        }
      ];
      return where;
    }
  },
  watch: {
    settings: {
      handler() {
        this.settingInput = {
          namaPT: "",
          NPWP: "",
          noSuratJalan: "",
          alamat: "",
          namaAlias: "",
          lambang: {}
        };

        let isRefresh = false;

        if (this.settings.length > 0) {
          if (this.settings[0].length > 0) {
            this.settingInput.namaPT = this.settings[0][0]["value"];
          } else {
            this.setDefaultData("nama_pt", "");
            if (!isRefresh) isRefresh = true;
          }

          if (this.settings[1].length > 0) {
            this.settingInput.NPWP = this.settings[1][0]["value"];
          } else {
            this.setDefaultData("npwp", "");
            if (!isRefresh) isRefresh = true;
          }

          if (this.settings[2].length > 0) {
            this.settingInput.noSuratJalan = this.settings[2][0]["value"];
          } else {
            this.setDefaultData("nomor_surat_jalan", "");
            if (!isRefresh) isRefresh = true;
          }

          if (this.settings[3].length > 0) {
            this.settingInput.alamat = this.settings[3][0]["value"];
          } else {
            this.setDefaultData("alamat", "");
            if (!isRefresh) isRefresh = true;
          }

          if (this.settings[4].length > 0) {
            this.settingInput.namaAlias = this.settings[4][0]["value"];
          } else {
            this.setDefaultData("nama_alias", "");
            if (!isRefresh) isRefresh = true;
          }
          if (isRefresh) {
            this.state.isRefresh = !this.state.isRefresh;
          }
          this.input = Object.assign({}, this.settingInput);
        }
      },
      deep: true
    }
  }
};
</script>

<style lang="css">
.picture-preview-label {
  font-size: 12px !important;
}
.preview-container {
  margin: 3px 0 0 0 !important;
}
.preview-container .picture-preview {
  z-index: 1 !important;
  border: 4px solid slategrey !important;
}
</style>

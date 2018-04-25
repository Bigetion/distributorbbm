<template>
  <div>
    <v-form v-model="valid" ref="form">
      <v-card flat class="pa-3">
        <v-layout row wrap class="detail">
          <v-flex md6 class="px-2">
            <v-text-field label="Nama PT" name="Nama PT" v-model="input.namaPT" :error-messages="errors.collect('Nama PT')" v-validate="'required'" :disabled="!state.isEdit"></v-text-field>
          </v-flex>
          <v-flex md6 class="px-2">
            <v-text-field label="NPWP" name="NPWP" v-model="input.NPWP" :error-messages="errors.collect('NPWP')" v-validate="'required'" :disabled="!state.isEdit"></v-text-field>
          </v-flex>
          <v-flex md6 class="px-2">
            <v-text-field label="INU" name="INU" v-model="input.inu" :error-messages="errors.collect('INU')" v-validate="'required'" :disabled="!state.isEdit"></v-text-field>
          </v-flex>
          <v-flex md6 class="px-2">
            <v-text-field label="Alamat" name="Alamat" v-model="input.alamat" :error-messages="errors.collect('Alamat')" v-validate="'required'" :disabled="!state.isEdit"></v-text-field>
          </v-flex>
          <v-flex md6 class="px-2">
            <v-text-field label="Nama Alias" name="Nama Alias" v-model="input.namaAlias" :error-messages="errors.collect('Nama Alias')" v-validate="'required'" :disabled="!state.isEdit"></v-text-field>
          </v-flex>
          <v-flex md6>
            <div class="px-2">
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
      inu: "",
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
          if (this.input.inu != this.settingInput.inu)
            this.updateDefaultData(
              "inu",
              this.input.inu
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
      var printInput = {
        lambang: this.lambangBase64,
        namaPT: this.input.namaPT,
        alamatPT: this.input.alamat,
        nomorTeleponPT: "0532-2031746",
        NPWP: this.input.NPWP,
        INU: this.input.inu,
        aliasPT: this.input.namaAlias
      }
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
                      colClass: "p"
                    },
                    {
                      text: printInput.alamatPT,
                      align: "center",
                      colClass: "small"
                    },
                    {
                      text: printInput.nomorTeleponPT,
                      align: "center",
                      colClass: "small"
                    }
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
                      colClass: "mt10,small"
                    },
                    {
                      text: `INU NO : ${printInput.INU}`,
                      colMd: 12,
                      colClass: "small"
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
                      colClass: "h5,mt10,mb5,p"
                    },
                    {
                      text: "DELIVERY ORDER (DO)",
                      align: "center",
                      colClass: "mb10,small"
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
                            labelWidth: 60,
                            value: `: ${printInput.aliasPT} - `,
                            style: "small"
                          },
                          {
                            label: "Tanggal",
                            labelWidth: 60,
                            value: ": -",
                            style: "small"
                          },
                          {
                            label: "Kepada Yth./ To",
                            labelWidth: 60,
                            value: ": -",
                            style: "small"
                          },
                          {
                            label: " ",
                            labelWidth: 60,
                            value: " "
                          },
                          {
                            label: "Contact Person",
                            labelWidth: 60,
                            value: ": -",
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
                            label: "Nomor Kendaraan",
                            labelWidth: 70,
                            value: ": -",
                            style: "small"
                          },
                          {
                            label: "Nomor Segel Atas",
                            labelWidth: 70,
                            value: ": -",
                            style: "small"
                          },
                          {
                            label: "Nomor Segel Bawah",
                            labelWidth: 70,
                            value: ": -",
                            style: "small"
                          },
                          {
                            label: "Nama Transportasi",
                            labelWidth: 70,
                            value: ": -",
                            style: "small"
                          },
                          {
                            label: "Warna Segel",
                            labelWidth: 70,
                            value: ": -",
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
                        widths: [15, 92, 87, 20, "*", "*"],
                        body: [
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
                              text: "Kwantitas/Satuan (LTR",
                              alignment: "center",
                              style: "small"
                            },
                            {
                              text: "SG",
                              alignment: "center",
                              style: "small"
                            },
                            {
                              text: "Temperatur",
                              alignment: "center",
                              style: "small"
                            },
                            {
                              text: "Tinggi Cairan",
                              alignment: "center",
                              style: "small"
                            }
                          ],
                          [
                            {
                              text: "1",
                              alignment: "center",
                              style: "small",
                              margin: [0,5,0,5]
                            },
                            {
                              text: "HSD INDUSTRI",
                              alignment: "center",
                              style: "small",
                              margin: [0,5,0,5]
                            },
                            {
                              text: "10.000",
                              alignment: "center",
                              style: "small",
                              margin: [0,5,0,5]
                            },
                            {
                              text: "0.837",
                              alignment: "center",
                              style: "small",
                              margin: [0,5,0,5]
                            },
                            {
                              text: "",
                              alignment: "center",
                              style: "small",
                              margin: [0,5,0,5]
                            },
                            {
                              text: "",
                              alignment: "center",
                              style: "small",
                              margin: [0,5,0,5]
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
                      text: `1. Lembar pertama warna putih / asli untuk ${printInput.aliasPT}`,
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
      print(exportedData, "tes", "potrait", "A5");
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
          id: "inu"
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
          inu: "",
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
            this.settingInput.inu = this.settings[2][0]["value"];
          } else {
            this.setDefaultData("inu", "");
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

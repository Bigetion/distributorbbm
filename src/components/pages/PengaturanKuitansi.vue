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
      </v-card>
    </v-form>
    <query-service v-model="settings" from-file="settings" :extra-query-options="queryServiceExtraQuery" :is-refresh="state.isRefresh"></query-service>
  </div>
</template>

<script>
export default {
  data: () => ({
    lambangURL: process.env.API_URL + "image/get/lambang",
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
  created() {},
  methods: {
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
            }, 200);
          }
        } else {
          $(`[name="${this.errors.items[0].field}"]`).focus();
        }
      });
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

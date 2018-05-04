<template>
  <div>
    <v-form v-model="valid" ref="form">
      <v-card flat class="pa-3">
        <v-layout row wrap class="detail">
          <v-flex md6 class="px-2">
            <v-text-field label="Nama PT" name="Nama PT" v-model="input.nama_pt" :error-messages="errors.collect('Nama PT')" v-validate="'required'" :disabled="!state.isEdit"></v-text-field>
          </v-flex>
          <v-flex md6 class="px-2">
            <v-text-field label="NPWP" name="NPWP" v-model="input.npwp" :error-messages="errors.collect('NPWP')" v-validate="'required'" :disabled="!state.isEdit"></v-text-field>
          </v-flex>
          <v-flex md6 class="px-2">
            <v-text-field label="INU" name="INU" v-model="input.inu" :error-messages="errors.collect('INU')" v-validate="'required'" :disabled="!state.isEdit"></v-text-field>
          </v-flex>
          <v-flex md6 class="px-2">
            <v-text-field label="Nama Alias" name="Nama Alias" v-model="input.nama_alias" :error-messages="errors.collect('Nama Alias')" v-validate="'required'" :disabled="!state.isEdit"></v-text-field>
          </v-flex>
          <v-flex md12 class="px-2">
            <v-text-field label="Alamat" name="Alamat" v-model="input.alamat" :error-messages="errors.collect('Alamat')" v-validate="'required'" :disabled="!state.isEdit" multi-line></v-text-field>
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
      </v-card>
    </v-form>
    <query-service v-model="settings" from-file="settings" :extra-query-options="queryServiceExtraQuery" :is-refresh="state.isRefresh"></query-service>
  </div>
</template>

<script>
import _ from "lodash";
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
      nama_pt: "",
      npwp: "",
      inu: "",
      alamat: "",
      nama_alias: "",
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
    setDefaultData(idArray) {
      idArray.forEach(id => {
        const settings = _.filter(this.settings[0], o => {
          return o.id == id;
        });
        if (settings.length > 0) {
          this.settingInput[id] = settings[0]["value"];
        } else {
          this.$http.post("base/service/executeMutation", {
            type: "insert",
            name: "settings",
            data: {
              id: id,
              value: ""
            }
          });
        }
      });
    },
    updateDefaultData(idArray) {
      idArray.forEach(id => {
        if (this.input[id] != this.settingInput[id]) {
          this.$http.post("base/service/executeMutation", {
            id: id,
            type: "update",
            name: "settings",
            data: {
              value: this.input[id]
            }
          });
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
        this.$validator.reset();
      }
    },
    submit() {
      this.$validator.validateAll().then(() => {
        if (!this.errors.any()) {
          this.updateDefaultData([
            "nama_pt",
            "npwp",
            "inu",
            "alamat",
            "nama_alias"
          ]);

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
    }
  },
  computed: {
    queryServiceExtraQuery() {
      let where = undefined;
      where = [
        {
          "id[!]": "-1"
        }
      ];
      return where;
    }
  },
  watch: {
    settings: {
      handler() {
        this.settingInput = {
          nama_pt: "",
          npwp: "",
          inu: "",
          alamat: "",
          nama_alias: "",
          lambang: {}
        };

        let isRefresh = false;

        if (this.settings.length > 0) {
          this.setDefaultData([
            "nama_pt",
            "npwp",
            "inu",
            "alamat",
            "nama_alias"
          ]);
          this.input = Object.assign({}, this.settingInput);
        }
      },
      deep: true
    }
  }
};
</script>

<style lang="css">

</style>

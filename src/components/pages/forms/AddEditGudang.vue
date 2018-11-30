<template>
  <div>
    <v-form v-model="valid" ref="form">
      <v-card flat class="pa-4 detail">
        <v-layout row wrap>
          <v-flex md6 class="px-2">
            <datepicker 
              label="Tanggal" 
              name="Tanggal" 
              v-model="input.tanggal" 
              :error-messages="errors.collect('Tanggal')" 
              v-validate="'required'" 
              value-format="DD MMMM YYYY"
              :disabled="isEdit"
            ></datepicker>
          </v-flex>
          <v-flex md6 class="px-2">
            <v-select
              :items="[{id: 'in', value: 'Masuk'}, {id: 'out', value: 'Keluar'}]"
              v-model="input.tipe"
              label="Tipe"
              name="Tipe"
              :error-messages="errors.collect('Tipe')" 
              v-validate="'required'"
              item-text="value"
              item-value="id"
              :disabled="isEdit"
            ></v-select>
          </v-flex>
          <v-flex md6 class="px-2">
            <v-text-field label="Jumlah" name="Jumlah" v-model="input.qty" :error-messages="errors.collect('Jumlah')" v-validate="'required|numeric'" :disabled="isEdit"></v-text-field>
          </v-flex>
          <v-flex md6 class="px-2">
            <!-- <v-select
              autocomplete
              :items="nomorReferensiOptions"
              v-model="input.nomorReferensi"
              label="Nomor Referensi"
              name="Nomor Referensi"
            ></v-select> -->
            <!-- <select-view 
              placeholder="Nomor Referensi" 
              :options="nomorReferensiOptions"
              v-model="input.nomorReferensi" 
              name="Nomor Referensi"
              :searchable="true"
              track-by="id"
              label="value"
            ></select-view> -->
            <v-text-field label="Nomor Referensi" name="Nomor Referensi" v-model="input.nomorReferensi" :error-messages="errors.collect('Nomor Referensi')" v-validate="''"></v-text-field>
          </v-flex>
          <v-flex md12 class="px-2">
            <v-text-field label="Keterangan" name="Keterangan" v-model="input.keterangan" :error-messages="errors.collect('Keterangan')" v-validate="''" multi-line></v-text-field>
          </v-flex>
        </v-layout>
      </v-card>
      <v-divider></v-divider>
      <v-card flat class="pa-4">
        <v-btn success @click="submit()">Simpan</v-btn>
        <v-btn error @click="cancel()">Batal</v-btn>
      </v-card>
    </v-form>
  </div>
</template>

<script>
import moment from "moment";
import auth from "./../../../utils/auth";
import { modal } from "./../../../utils/modal";
import KonfirmasiInputGudang from "./KonfirmasiInputGudang.vue";
export default {
  props: {
    data: {},
    nomorReferensiOptions: {},
    stokOpname: {},
    isEdit: {
      type: Boolean,
      default: function() {
        return false;
      }
    },
    onSubmitted: {},
    onCancel: {}
  },
  data: () => ({
    input: {
      tanggal: new Date(),
      tipe: "in",
      qty: "",
      nomorReferensi: "",
      keterangan: ""
    },
    filePO: ""
  }),
  created() {
    if (this.isEdit) {
      this.input = {
        tanggal: this.data["tanggal"],
        tipe: this.data["tipe"],
        qty: this.data["qty"],
        nomorReferensi: this.data["nomor_referensi"],
        keterangan: this.data["keterangan"]
      };
    }
  },
  methods: {
    submit() {
      this.$validator.validateAll().then(() => {
        if (!this.errors.any()) {
          modal(this, {
            name: "konfirmasi-input-gudang-modal",
            props: {
              data: {
                tanggal: moment(this.input["tanggal"]).format("DD MMMM YYYY"),
                qty: this.input["qty"],
                nomorReferensi: this.input["nomorReferensi"],
                keterangan: this.input["keterangan"]
              }
            },
            dismissable: false,
            component: KonfirmasiInputGudang
          }).then(response => {
            if (response) {
              this.$http
                .post("base/service/executeMutation", this.gudangParams)
                .then(response => {
                  if (response.data.success_message) {
                    if (this.onSubmitted) this.onSubmitted();
                  }
                });
            }
          });
        } else {
          $(`[name="${this.errors.items[0].field}"]`).focus();
        }
      });
    },
    cancel() {
      if (this.onCancel) this.onCancel();
    }
  },
  computed: {
    mutationType() {
      let mutationType = this.isEdit ? "update" : "insert";
      return mutationType;
    },
    gudangData() {
      let data = {
        id_user: auth.user.idUser,
        tanggal: moment(this.input["tanggal"]).format("YYYY-MM-DD"),
        tipe: this.input["tipe"],
        qty: this.input["qty"],
        nomor_referensi: this.input["nomorReferensi"],
        keterangan: this.input["keterangan"],
        stok_opname:
          parseFloat(this.stokOpname) +
          parseFloat(this.input["qty"]) * (this.input["tipe"] == "in" ? 1 : -1)
      };
      return data;
    },
    gudangParams() {
      let params = {
        id: this.data["id"],
        type: this.mutationType,
        name: "inventory",
        data: this.gudangData
      };
      return params;
    }
  }
};
</script>

<style lang="css">

</style>

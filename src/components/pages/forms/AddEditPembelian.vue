<template>
  <div>
    <v-form v-model="valid" ref="form">
      <v-card flat class="pa-4">
        <v-layout row wrap>
          <v-flex md6 class="px-2">
            <v-text-field label="Nomor PO" name="Nomor PO" v-model="input.nomorPO" :error-messages="errors.collect('Nomor PO')" v-validate="'required'"></v-text-field>
          </v-flex>
          <v-flex md6 class="px-2">
            <datepicker 
              label="Tanggal" 
              name="Tanggal" 
              v-model="input.tanggal" 
              :error-messages="errors.collect('Tanggal')" 
              v-validate="'required'" 
              value-format="DD MMMM YYYY"
            ></datepicker>
          </v-flex>
          <v-flex md6 class="px-2">
            <v-text-field label="Status Bayar" name="Status Bayar" v-model="input.statusBayar" :error-messages="errors.collect('Status Bayar')" v-validate="'required'"></v-text-field>
          </v-flex>
          <v-flex md6 class="px-2">
            <v-text-field label="QTY (Kiloliter)" name="QTY" v-model="input.qty" :error-messages="errors.collect('QTY')" v-validate="'required'"></v-text-field>
          </v-flex>
          <v-flex md6 class="px-2">
            <v-text-field label="Harga / Liter" name="Harga" v-model="input.harga" :error-messages="errors.collect('Harga')" v-validate="'required'"></v-text-field>
          </v-flex>
          <v-flex md6 class="px-2">
            <v-select
              :items="['Cash','Kredit']"
              v-model="input.jenisPembayaran"
              label="Jenis Pembayaran"
              name="Jenis Pembayaran"
              :error-messages="errors.collect('Jenis Pembayaran')" 
              v-validate="'required'"
            ></v-select>
          </v-flex>
          <v-flex md6 class="px-2">
            <v-text-field label="TOP" name="TOP" v-model="input.top" :error-messages="errors.collect('TOP')" v-validate="'required'"></v-text-field>
          </v-flex>
          <v-flex md6 class="px-2 detail">
            <v-text-field label="Jatuh Tempo" :value="jatuhTempoFormat" :disabled="true"></v-text-field>
          </v-flex>
          <v-flex md6>
            <div class="px-2">
              <span class="picture-preview-label">File PO</span><br>
              <picture-input
                @change="onChangeFilePO" 
                width="400" 
                height="250"
                accept="image/jpeg,image/png" 
                size="5"
                :crop="false"
                :hideChangeButton="true"
                :customStrings="{
                  drag: 'Upload File PO'
                }"
                :prefill="`${baseUrl}${data['id']}`"
                :prefillOptions="{
                  fileType: 'jpg',
                  mediaType: 'image/png'
                }"
                class="preview-container"
              ></picture-input>
            </div>
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
export default {
  props: {
    baseUrl: {},
    data: {},
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
      nomorPO: "",
      tanggal: new Date(),
      statusBayar: "",
      qty: "",
      jenisPembayaran: "",
      harga: "",
      top: ""
    },
    filePO: ""
  }),
  created() {
    if (this.isEdit) {
      this.input = {
        nomorPO: this.data["nomor_po"],
        tanggal: moment(this.data["tanggal"]),
        statusBayar: this.data["status_bayar"],
        qty: this.data["qty"],
        jenisPembayaran: this.data["jenis_bayar"],
        harga: this.data["harga"],
        top: this.data["top"]
      };
    }
  },
  methods: {
    onChangeFilePO(a) {
      this.filePO = a;
    },
    submit() {
      this.$validator.validateAll().then(() => {
        if (!this.errors.any()) {
          this.$http
            .post("base/service/executeMutation", this.pembelianParams)
            .then(response => {
              if (response.data.success_message) {
                if (this.filePO != "") {
                  this.$http.post("base/upload/image", {
                    images: [
                      {
                        path: "filePO",
                        base64: this.filePO,
                        name: this.isEdit ? this.data["id"] : response.data.id
                      }
                    ]
                  });
                }
                if (this.onSubmitted) this.onSubmitted();
              }
            });
        } else {
          $(`[name="${this.errors.items[0].field}"]`).focus();
        }
      });
    },
    cancel() {
      if (this.onCancel) this.onCancel();
    },
    formatCurrency(value) {
      let val = (value / 1).toFixed(0).replace(".", ",");
      return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    }
  },
  computed: {
    jatuhTempoFormat() {
      return moment(this.jatuhTempo).format("DD MMMM YYYY");
    },
    jatuhTempo() {
      let jatuhTempo = this.input.tanggal;
      if (this.input.top) {
        jatuhTempo = moment(this.input.tanggal).add(this.input.top, "days");
      }
      return moment(jatuhTempo).format("YYYY-MM-DD");
    },
    mutationType() {
      let mutationType = this.isEdit ? "update" : "insert";
      return mutationType;
    },
    pembelianData() {
      let data = {
        nomor_po: this.input["nomorPO"],
        tanggal_pembelian: this.input["tanggal"],
        qty: this.input["qty"],
        harga: this.input["harga"],
        jenis_bayar: this.input["jenisPembayaran"],
        top: this.input["top"],
        jatuh_tempo: this["jatuhTempo"],
        status_bayar: this.input["statusBayar"]
      };
      return data;
    },
    pembelianParams() {
      let params = {
        id: this.isEdit ? this.data["id"] : undefined,
        type: this.mutationType,
        name: "pembelian",
        data: this.pembelianData
      };
      return params;
    }
  }
};
</script>

<style lang="css">

</style>

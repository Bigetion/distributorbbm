<template>
  <div>
    <v-form v-model="valid" ref="form">
      <v-card flat class="pa-4">
        <v-layout row wrap>
          <v-flex md12 class="px-2">
            <select-view 
              placeholder="Customer" 
              v-model="input.customer" 
              from-file="customer" 
              name="Customer" 
              :error-messages="errors.collect('Customer')" 
              v-validate="'required'"
              :on-selected="onSelectedCustomer"
              :searchable="true"
            ></select-view>
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
            <v-text-field label="QTY (Liter)" name="QTY" v-model="input.qty" :error-messages="errors.collect('QTY')" v-validate="'required'"></v-text-field>
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
            <v-text-field label="Jumlah Bayar" :value="jumlahBayarFormat" :disabled="true"></v-text-field>
          </v-flex>
          <v-flex md6 class="px-2 detail">
            <v-text-field label="Jatuh Tempo" :value="jatuhTempoFormat" :disabled="true"></v-text-field>
          </v-flex>
        </v-layout>
      </v-card>
      <v-divider></v-divider>
      <v-card flat class="pa-4">
        <v-btn success @click="submit()">Simpan</v-btn>
        <v-btn error @click="cancel()">Batal</v-btn>
      </v-card>
    </v-form>
    <query-service v-model="settings" from-file="settings" :extra-query-options="extraQueryOptions"></query-service>
  </div>
</template>

<script>
import moment from "moment";
export default {
  props: {
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
      customer: "",
      tanggal: new Date(),
      statusBayar: "",
      qty: "",
      jenisPembayaran: "",
      harga: "",
      top: ""
    },
    settings: [],
    namaAlias: ""
  }),
  created() {
    if (this.isEdit) {
      this.input = {
        customer: this.data["customer"],
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
    submit() {
      this.$validator.validateAll().then(() => {
        if (!this.errors.any()) {
          this.$http
            .post("base/service/executeMutation", this.penjualanParams)
            .then(response => {
              if (response.data.success_message) {
                this.$http.post("base/service/executeMutation", {
                  id: response.data.id,
                  type: "update",
                  name: "penjualan",
                  data: {
                    nomor_do: `${this.namaAlias}-${this.pad(
                      response.data.id,
                      6
                    )}`
                  }
                });
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
    },
    pad(n, width, z) {
      z = z || "0";
      n = n + "";
      return n.length >= width
        ? n
        : new Array(width - n.length + 1).join(z) + n;
    }
  },
  watch: {
    settings: {
      handler() {
        if (this.settings[0].length > 0) {
          this.namaAlias = this.settings[0][0]["value"];
        }
      },
      deep: true
    }
  },
  computed: {
    extraQueryOptions() {
      let where = [
        {
          id: "nama_alias"
        }
      ];
      return where;
    },
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
    jumlahBayar() {
      let jumlahBayar = 0;
      if (this.input.qty != "" && this.input.harga != "") {
        jumlahBayar = this.input.qty * this.input.harga * 1000;
      }
      return jumlahBayar;
    },
    jumlahBayarFormat() {
      return this.formatCurrency(this.jumlahBayar);
    },
    mutationType() {
      let mutationType = this.isEdit ? "update" : "insert";
      return mutationType;
    },
    penjualanData() {
      let data = {
        customer: this.input["customer"],
        tanggal_penjualan: this.input["tanggal"],
        status_bayar: this.input["statusBayar"],
        qty: this.input["qty"],
        jenis_bayar: this.input["jenisPembayaran"],
        harga: this.input["harga"],
        jumlah_bayar: this["jumlahBayar"],
        top: this.input["top"],
        jatuh_tempo: this["jatuhTempo"]
      };
      return data;
    },
    penjualanParams() {
      let params = {
        id: undefined,
        type: this.mutationType,
        name: "penjualan",
        data: this.penjualanData
      };
      if (this.isEdit) params.id = this.data["id"];
      return params;
    }
  }
};
</script>

<style lang="css">

</style>

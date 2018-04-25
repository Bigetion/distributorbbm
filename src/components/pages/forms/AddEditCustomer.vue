<template>
  <div>
    <v-form v-model="valid" ref="form">
      <v-card flat class="pa-4">
        <v-layout row wrap>
          <v-flex md6 class="px-2">
            <v-text-field label="Nama Customer" name="Nama Customer" v-model="input.nama" :error-messages="errors.collect('Nama Customer')" v-validate="'required'"></v-text-field>
          </v-flex>
          <v-flex md6 class="px-2">
            <v-text-field label="No. Telp / HP" name="No. Telp / HP" v-model="input.nomorTelepon" :error-messages="errors.collect('No. Telp / HP')" v-validate="'required'"></v-text-field>
          </v-flex>
          <v-flex md6 class="px-2">
            <v-text-field label="Bank" name="Bank" v-model="input.bank" :error-messages="errors.collect('Bank')" v-validate="'required'"></v-text-field>
          </v-flex>
          <v-flex md6 class="px-2">
            <v-text-field label="Nomor Rekening" name="Nomor Rekening" v-model="input.nomorRekening" :error-messages="errors.collect('Nomor Rekening')" v-validate="'required'"></v-text-field>
          </v-flex>
          <v-flex md12 class="px-2">
            <v-text-field label="Alamat" name="Alamat" v-model="input.alamat" :error-messages="errors.collect('Alamat')" v-validate="'required'"></v-text-field>
          </v-flex>
          <v-flex md12 class="px-2">
            <v-text-field label="Keterangan" name="Keterangan" v-model="input.keterangan" :error-messages="errors.collect('Keterangan')" v-validate="'required'" multi-line></v-text-field>
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
      nama: "",
      alamat: "",
      nomorTelepon: "",
      nomorRekening: "",
      bank: "",
      keterangan: ""
    }
  }),
  created() {
    if (this.isEdit) {
      this.input = {
        nama: this.data["nama"],
        alamat: this.data["alamat"],
        nomorTelepon: this.data["telepon"],
        nomorRekening: this.data["nomor_rekening"],
        bank: this.data["bank"],
        keterangan: this.data["keterangan"]
      };
    }
  },
  methods: {
    submit() {
      this.$validator.validateAll().then(() => {
        if (!this.errors.any()) {
          this.$http
            .post("base/service/executeMutation", this.customerParams)
            .then(response => {
              if (response.data.success_message) {
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
    }
  },
  computed: {
    mutationType() {
      let mutationType = this.isEdit ? "update" : "insert";
      return mutationType;
    },
    customerData() {
      let data = {
        nama: this.input.nama,
        alamat: this.input.alamat,
        telepon: this.input.nomorTelepon,
        nomor_rekening: this.input.nomorRekening,
        bank: this.input.bank,
        keterangan: this.input.keterangan
      };
      return data;
    },
    customerParams() {
      let params = {
        id: undefined,
        type: this.mutationType,
        name: "customer",
        data: this.customerData
      };
      if (this.isEdit) params.id = this.data["id"];
      return params;
    }
  }
};
</script>

<style lang="css">

</style>

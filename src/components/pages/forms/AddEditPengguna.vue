<template>
  <v-layout>
    <v-toolbar class="indigo" dark fixed>
      <v-toolbar-title>{{type=='edit' ? 'Ubah': 'Tambah'}} Pengguna</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn icon @click.native="cancel()" dark>
        <v-icon>close</v-icon>
      </v-btn>
    </v-toolbar>
    <v-flex class="mt-5">
      <v-form v-model="valid" ref="form">
        <v-card flat class="pa-4">
          <v-text-field label="Nama" name="Nama" v-model="input.nama" :error-messages="errors.collect('Nama')" v-validate="'required'"></v-text-field>
          <v-text-field label="Nama User" name="Nama User" v-model="input.username" :error-messages="errors.collect('Nama User')" v-validate="'required'"></v-text-field>
          <v-text-field label="Email" name="Email" v-model="input.email" :error-messages="errors.collect('Email')" v-validate="'required|email'"></v-text-field>
          <select-view :class="{'select-error': errors.has('Role'), 'input-select': true}" placeholder="Role" v-model="input.role" from-file="roles" name="Role" v-validate="'required'" :disabled="user.idUser==data.id_user"></select-view>
          <div class="input-group__details">
            <span v-show="errors.has('Role')" class="input-error">{{ errors.first('Role') }}</span>
          </div>
          <select-view searchable v-show="input.role=='4'" :class="{'select-error': errors.has('LSPRO'), 'input-select': true}" placeholder="LSPRO" v-model="input.lspro" from-file="lspro" name="LSPRO" v-validate="input.role=='4' ? 'required': ''" :is-refresh="lspro"></select-view>
          <div v-show="input.role=='4'" class="input-group__details">
            <span v-show="errors.has('LSPRO')" class="input-error">{{ errors.first('LSPRO') }}</span>
          </div>
          <v-text-field v-show="!(user.idUser==data.id_user || data.id_user=='2' || data.id_user=='1')" label="Password" name="Password" v-model="input.password" :error-messages="errors.collect('Password')" type="password" v-validate="type=='add' ? 'required': ''"></v-text-field>
          <v-text-field v-show="!(user.idUser==data.id_user || data.id_user=='2' || data.id_user=='1')" label="Konfirmasi Password" name="Konfirmasi Password" v-model="input.confirmPassword" :error-messages="errors.collect('Konfirmasi Password')" type="password" v-validate="type=='add' ? 'required|confirmed:Password': 'confirmed:Password'"></v-text-field>
          <div class="mb-5"></div>
        </v-card>
        <v-divider></v-divider>
        <v-card flat class="pa-3">
          <v-btn success @click="submit()">Simpan</v-btn>
          <v-btn error @click="cancel()">Batal</v-btn>
        </v-card>
      </v-form>
    </v-flex>
    <query-service v-if="type=='edit'" v-model="lspro" from-file="lspro" :extra-query-options="queryServiceExtraQueryLSPRO"></query-service>
  </v-layout>
</template>

<script>
export default {
  props: {
    type: {
      type: String
    },
    data: {
      type: Object
    },
    user: {}
  },
  data() {
    return {
      input: {
        nama: "",
        username: "",
        email: "",
        role: "",
        password: "",
        confirmPassword: "",
        lspro: ""
      },
      lspro: null,
      idUser: "-1"
    };
  },
  created() {
    this.selectedRow = Object.assign({}, this.data);
    if (this.type == "edit") {
      this.input = {
        nama: this.data["nama"],
        username: this.data["username"],
        email: this.data["email"],
        role: this.data["id_role"],
        password: "",
        confirmPassword: "",
        lspro: ""
      };
    }
  },
  methods: {
    cancel() {
      this.$vuedals.close({
        submitted: false,
        success: false
      });
    },
    submit() {
      this.$validator.validateAll();
      if (!this.errors.any()) {
        this.$http
          .post("base/service/executeMutation", this.penggunaInternalParams)
          .then(response => {
            if (response.data.success_message) {
              if (this.type == "add") {
                this.selectedRow["id_external"] = response.data.id;
              }
              this.$http
                .post("base/service/executeMutation", this.usersParams)
                .then(response => {
                  if (response.data.success_message) {
                    if (this.type == "add") {
                      this.idUser = response.data.id;
                    }
                    if(this.input["role"] == "4") {
                      this.$http
                      .post("base/service/executeMutation", this.lsproParams)
                      .then(response => {});
                    }
                    this.$vuedals.close({
                      submitted: true,
                      success: true,
                      message:
                        this.type == "add"
                          ? "Berhasil menambahkan data pengguna"
                          : "Berhasil mengubah data pengguna"
                    });
                  }
                });
            }
          });
      }
    }
  },
  watch: {
    lspro: {
      handler() {
        if (this.data.id_role == "4") {
          if (this.lspro.length > 0)
            this.input.lspro = this.lspro[0][0]["id_lspro"];
        }
      },
      deep: true
    }
  },
  computed: {
    mutationType() {
      let mutationType = this.type == "edit" ? "update" : "insert";
      return mutationType;
    },
    usersData() {
      let data = {
        username: this.input["username"],
        password: this.input["password"],
        id_role: this.input["role"],
        id_external: this.selectedRow["id_external"]
      };
      if (this.input["password"] == "") delete data["password"];
      return data;
    },
    usersParams() {
      let params = {
        id: this.selectedRow["id_user"],
        type: this.mutationType,
        name: "users",
        data: this.usersData
      };
      return params;
    },
    penggunaInternalData() {
      let data = {
        nama: this.input["nama"],
        email: this.input["email"]
      };
      return data;
    },
    penggunaInternalParams() {
      let params = {
        id: this.selectedRow["id_external"],
        type: this.mutationType,
        name: "pengguna_internal",
        data: this.penggunaInternalData
      };
      return params;
    },
    lsproData() {
      let idUser = this.selectedRow["id_user"];
      if(this.type == "add") {
        idUser = this.idUser;
      }
      let data = {
        id_user: idUser
      };
      return data;
    },
    lsproParams() {
      let params = {
        id: this.input["lspro"],
        type: "update",
        name: "lspro",
        data: this.lsproData
      };
      return params;
    },
    queryServiceExtraQueryLSPRO() {
      let where = [
        {
          id_user: this.data.id_user
        }
      ];
      return where;
    }
  }
};
</script>

<style lang="css">

</style>

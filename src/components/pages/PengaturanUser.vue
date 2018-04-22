<template>
  <div>
    <div v-if="state.isAdd || state.isEdit">
      <v-form v-model="valid" ref="form">
        <v-card flat class="pa-4">
          <v-text-field label="Username" name="Username" v-model="input.username" :error-messages="errors.collect('Username')" v-validate="'required'"></v-text-field>
          <select-view placeholder="Role" v-model="input.role" from-file="roles" name="Role" :error-messages="errors.collect('Role')" v-validate="'required'"></select-view>
          <v-text-field v-if="state.isAdd" label="Password" name="Password" v-model="input.password" :error-messages="errors.collect('Password')" type="password" v-validate="state.isAdd ? 'required': ''"></v-text-field>
          <v-text-field v-if="state.isAdd" label="Konfirmasi Password" name="Konfirmasi Password" v-model="input.confirmPassword" :error-messages="errors.collect('Konfirmasi Password')" type="password" v-validate="state.isAdd ? 'required|confirmed:Password': 'confirmed:Password'"></v-text-field>
        </v-card>
        <v-divider></v-divider>
        <v-card flat class="pa-3">
          <v-btn success @click="submit()">Simpan</v-btn>
          <v-btn error @click="cancel()">Batal</v-btn>
        </v-card>
      </v-form>
    </div>
    <div v-show="!(state.isAdd || state.isEdit)">
      <v-card flat class="pa-4">
        <table-view 
          from-file="pengguna" 
          :is-refresh="state.isRefresh"
          :is-delete="state.isDelete"
          :is-download="state.isDownload"
          :on-select="onSelect"
        ></table-view>
      </v-card>
      <v-divider></v-divider>
      <v-card flat class="pa-3">
        <v-btn success @click="setIsAdd(true)">Tambah</v-btn>
        <v-btn v-if="selectedRow.length==1" primary  @click="setIsEdit(true)">Edit</v-btn>
        <v-btn v-if="selectedRow.length > 0 && deletePermission" error @click.stop="state.isDelete = !state.isDelete">Hapus</v-btn>
      </v-card>
    </div>
  </div>
</template>

<script>
import _ from "lodash";
import auth from "./../../utils/auth";
export default {
  data: () => ({
    user: auth.user,
    state: {
      isAdd: false,
      isEdit: false,
      isRefresh: false,
      isDelete: false,
      isDownload: false
    },
    selectedRow: [],
    input: {
      username: "",
      role: "",
      password: "",
      confirmPassword: ""
    }
  }),
  methods: {
    onSelect(row) {
      this.selectedRow = row;
    },
    setIsAdd(condition) {
      this.state.isAdd = condition;
      if (condition) {
        this.input = {
          username: "",
          role: "",
          password: "",
          confirmPassword: ""
        };
      }
    },
    setIsEdit(condition) {
      this.state.isEdit = condition;
      if (condition) {
        this.input = {
          username: this.selectedRow[0].username,
          role: this.selectedRow[0].id_role,
          password: "",
          confirmPassword: ""
        };
      }
    },
    submit() {
      this.$validator.validateAll();
      if (!this.errors.any()) {
        this.$http
          .post("base/service/executeMutation", this.usersParams)
          .then(response => {
            if (response.data.success_message) {
              this.cancel();
              this.state.isRefresh = !this.state.isRefresh;
            }
          });
      } else {
        $(`[name="${this.errors.items[0].field}"]`).focus();
      }
    },
    cancel() {
      this.setIsAdd(false);
      this.setIsEdit(false);
    }
  },
  created() {},
  computed: {
    mutationType() {
      let mutationType = this.state.isEdit ? "update" : "insert";
      return mutationType;
    },
    usersData() {
      let data = {
        username: this.input["username"],
        password: this.input["password"],
        id_role: this.input["role"],
        id_external: "-1"
      };
      if (this.input["password"] == "") delete data["password"];
      return data;
    },
    usersParams() {
      let params = {
        id: this.state.isEdit ? this.selectedRow[0]["id_user"] : undefined,
        type: this.mutationType,
        name: "users",
        data: this.usersData
      };
      return params;
    },
    deletePermission() {
      let condition = false;
      if (this.selectedRow.length == 1) {
        if (
          this.selectedRow[0].id_user != "1" &&
          this.selectedRow[0].id_user != this.user.idUser
        ) {
          condition = true;
        }
      }
      if (this.selectedRow.length > 1) {
        condition = true;
        const a = _.filter(this.selectedRow, o => {
          return o.id_user == "1" || o.id_user == this.user.idUser;
        });
        if (a.length > 0) condition = false;
      }
      return condition;
    }
  }
};
</script>

<style lang="css">

</style>

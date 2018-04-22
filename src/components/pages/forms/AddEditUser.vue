<template>
  <div>
    <v-form v-model="valid" ref="form">
      <v-card flat class="pa-4">
        <v-text-field label="Username" name="Username" v-model="input.username" :error-messages="errors.collect('Username')" v-validate="'required'"></v-text-field>
        <select-view placeholder="Role" v-model="input.role" from-file="roles" name="Role" :error-messages="errors.collect('Role')" v-validate="'required'"></select-view>
        <v-text-field v-if="!isEdit" label="Password" name="Password" v-model="input.password" :error-messages="errors.collect('Password')" type="password" v-validate="!isEdit ? 'required': ''"></v-text-field>
        <v-text-field v-if="!isEdit" label="Konfirmasi Password" name="Konfirmasi Password" v-model="input.confirmPassword" :error-messages="errors.collect('Konfirmasi Password')" type="password" v-validate="!isEdit ? 'required|confirmed:Password': 'confirmed:Password'"></v-text-field>
      </v-card>
      <v-divider></v-divider>
      <v-card flat class="pa-3">
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
      username: "",
      role: "",
      password: "",
      confirmPassword: ""
    }
  }),
  created() {
    if (this.isEdit) {
      this.input = {
        username: this.data["username"],
        role: this.data["id_role"],
        password: "",
        confirmPassword: ""
      };
    }
  },
  methods: {
    submit() {
      this.$validator.validateAll().then(() => {
        if (!this.errors.any()) {
          this.$http
            .post("base/service/executeMutation", this.usersParams)
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
        id: undefined,
        type: this.mutationType,
        name: "users",
        data: this.usersData
      };
      if (this.isEdit) params.id = this.data["id_user"];
      return params;
    }
  }
};
</script>

<style lang="css">

</style>

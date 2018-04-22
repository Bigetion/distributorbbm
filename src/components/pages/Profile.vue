<template lang="html">
  <v-tabs id="mobile-tabs-5" fixed light centered>
    <v-toolbar class="grey lighten-3" light flat>
      <v-toolbar-title>Profil Saya</v-toolbar-title>
    </v-toolbar>
    <v-layout row wrap>
      <v-flex md4 xs12>
        <v-card class="mx-2 mt-2 px-2 pt-2 detail">
          <v-text-field label="Username" v-model="userInfo.username" :disabled="true"></v-text-field>
          <v-text-field label="Level" v-model="userInfo.rolename" :disabled="true"></v-text-field>
        </v-card>
      </v-flex>
      <v-flex md8 xs12>
        <div class="my-2 px-2">
          <v-alert success :value="message.success">
            {{message.success}}
          </v-alert>
          <v-alert error :value="message.error">
            {{message.error}}
          </v-alert>
        </div>
        <v-card class="mx-2 my-2">
          <v-toolbar flat class="white" dense>
            <v-toolbar-title class="text-xs-center">Ubah Password</v-toolbar-title>
          </v-toolbar>
          <v-divider></v-divider>
          <v-form v-model="valid" ref="form" class="pa-2">
            <div class="mx-2">
              <v-text-field label="Old Password" name="Old Password" v-model="input.passwordOld" :error-messages="errors.collect('Old Password')" type="password" v-validate="'required'"></v-text-field>
              <v-text-field label="New Password" name="New Password" v-model="input.passwordNew" :error-messages="errors.collect('New Password')" type="password" v-validate="'required'"></v-text-field>
              <v-text-field label="Confirm New Password" name="Confirm New Password" v-model="input.passwordNewConfirm" :error-messages="errors.collect('Confirm New Password')" type="password" v-validate="{required: true, confirmed:input.passwordNew}"></v-text-field>
            </div>
            <div class="mt-3">
              <v-btn primary @click="submit()">Save New Password</v-btn>
            </div>
          </v-form>
        </v-card>
      </v-flex>
    </v-layout>
  </v-tabs>
</template>

<script>
import auth from "./../../utils/auth";
export default {
  data() {
    return {
      error: null,
      input: {
        passwordOld: "",
        passwordNew: "",
        passwordNewConfirm: ""
      },
      message: {
        success: "",
        error: ""
      },
      userInfo: auth.user
    };
  },
  mounted() {
    window.eventBus.$emit("toggleDrawer", false);
  },
  methods: {
    submit() {
      this.$validator.validateAll().then(() => {
        this.message = {
          success: "",
          error: ""
        };
        if (!this.errors.any()) {
          this.$http
            .post("app/changePassword", {
              passwordOld: this.input.passwordOld,
              passwordNew: this.input.passwordNew
            })
            .then(response => {
              if (response.data.success_message) {
                this.input = {
                  passwordOld: "",
                  passwordNew: "",
                  passwordNewConfirm: ""
                };
                this.$validator.reset();
                this.errors.clear();
                this.message.success = "Password successfully changed";
              } else {
                this.message.error =
                  "The password that you entered is not valid";
              }
            })
            .catch(function(error) {
              console.log(error);
            });
        } else {
          $(`[name="${this.errors.items[0].field}"]`).focus();
        }
      });
    }
  }
};
</script>

<style lang="css">

</style>

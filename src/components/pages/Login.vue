<template id="login">
  <v-card align-center class="login mt-5 elevation-10">
    <div class="grey lighten-3 px-2" light flat>
      <p class="title text-xs-center pt-3">Aplikasi Distribusi BBM</p>
      <p class="subheading text-xs-center pb-3">{{appStore.namaPT}}</p>
    </div>
    <v-container class="login">
      <v-form v-model="valid" ref="form">
        <div class="mx-2">
          <v-text-field label="Username" name="Username" v-model="input.username" :error-messages="errors.collect('Username')" v-validate="'required'" @keyup.enter.native="submit()">
          </v-text-field>
          <v-text-field label="Password" name="Password" v-model="input.password" :error-messages="errors.collect('Password')" type="password" v-validate="'required'" @keyup.enter.native="submit()">
          </v-text-field>
          <v-alert error :value="message.error">
            {{message.error}}
          </v-alert>
        </div>
        <div class="mt-3">
          <v-btn primary @click="submit()">Masuk</v-btn>
        </div>
      </v-form>
    </v-container>
  </v-card>
</template>

<script>
import auth from "./../../utils/auth";
import loginImg from "./../../assets/logo_master.png";
export default {
  data() {
    return {
      appStore: {},
      error: null,
      input: {
        username: "",
        password: "",
        errorMessage: ""
      },
      message: {
        error: ""
      }
    };
  },
  created() {
    window.eventBus.$on("appStore", appStore => {
      this.appStore = appStore;
    });
  },
  methods: {
    cancel() {
      this.$router.push("/");
    },
    submit() {
      this.$validator.validateAll().then(() => {
        this.message.error = "";
        if (!this.errors.any()) {
          this.$http
            .post("login", {
              username: this.input.username,
              password: this.input.password
            })
            .then(response => {
              if (response.data.success_message) {
                localStorage.setItem("token", response.data.jwt);
                auth.user.authenticated = true;
                window.location.reload();
                this.$router.push("/");
              } else {
                this.message.error = "Invalid username and password";
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
  },
  computed: {}
};
</script>

<style lang="css">
.login {
  top: 0;
  max-width: 400px;
  margin: 0 auto;
}
</style>

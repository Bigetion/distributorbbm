<template>
<v-app toolbar v-resize="onResize">
  <v-navigation-drawer v-if="user.authenticated" class="pb-0" disable-resize-watcher persistent clipped v-model="drawer">
    <v-list dense>
      <v-list-group v-for="item in menus" v-if="item.roles.indexOf(parseInt(user.idRole)) != -1" :value="item.active" v-bind:key="item.title">
        <v-list-tile v-if="item.items" slot="item">
          <v-list-tile-action>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>{{ item.title }}</v-list-tile-title>
          </v-list-tile-content>
          <v-list-tile-action v-if="item.items">
            <v-icon>keyboard_arrow_down</v-icon>
          </v-list-tile-action>
        </v-list-tile>
        <v-list-tile v-else slot="item" :to="'/'+item.path" exact>
          <v-list-tile-action>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>{{ item.title }}</v-list-tile-title>
          </v-list-tile-content>
          <v-list-tile-action v-if="item.items">
            <v-icon>keyboard_arrow_down</v-icon>
          </v-list-tile-action>
        </v-list-tile>
        <v-list-tile v-for="subItem in item.items" v-bind:key="subItem.title" :to="'/'+subItem.path" exact>
          <v-list-tile-content>
            <v-list-tile-title>{{ subItem.title }}</v-list-tile-title>
          </v-list-tile-content>
          <v-list-tile-action>
            <v-icon>{{ subItem.action }}</v-icon>
          </v-list-tile-action>
        </v-list-tile>
      </v-list-group>
    </v-list>
  </v-navigation-drawer>
  <v-toolbar class="green" dark fixed v-if="user.authenticated">
    <v-toolbar-side-icon dark @click.stop="drawer = !drawer"></v-toolbar-side-icon>
    <span class="title">Aplikasi Distribusi BBM <span class="text">{{appStore.namaPT}}</span></span>
    <v-spacer></v-spacer>
    <v-menu offset-y>
      <v-btn icon dark slot="activator" class="cyan">
        <v-icon>person</v-icon>
      </v-btn>
      <v-card>
        <v-list>
          <v-list-tile to="profile">
            <v-list-tile-content>
              <v-list-tile-title>My Profile</v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
          <v-list-tile @click="logout()">
            <v-list-tile-content>
              <v-list-tile-title>Logout</v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
        </v-list>
      </v-card>
    </v-menu>
  </v-toolbar>
  <main>
    <v-layout>
      <v-flex xs12>
        <router-view></router-view>
      </v-flex>
    </v-layout>
    <vuedal></vuedal>
  </main>
  <query-service v-model="settings" from-file="settings" :extra-query-options="extraQueryOptions"></query-service>
</v-app>
</template>

<script>
import _ from "lodash";
import auth from "./utils/auth";
import setAppStore from "./utils/store";
export default {
  data: () => ({
    appStore: {},
    windowSize: {
      x: 0,
      y: 0
    },
    user: auth.user,
    drawer: true,
    menus: [
      {
        icon: "fa-gear",
        title: "Pengaturan",
        path: "pengaturan",
        roles: [1, 3]
      },
      {
        icon: "fa-shopping-cart",
        title: "Pembelian",
        path: "pembelian",
        roles: [1, 3, 4]
      },
      {
        icon: "fa-users",
        title: "Data Customer",
        path: "customer",
        roles: [1, 3, 4]
      },
      {
        icon: "fa-archive",
        title: "Penjualan",
        path: "penjualan",
        roles: [1, 3, 4]
      },
      {
        icon: "fa-folder",
        title: "Rekap Data",
        path: "rekap-data",
        roles: [1, 3, 4]
      },
      {
        icon: "fa-building",
        title: "Gudang",
        path: "gudang",
        roles: [1, 3, 4]
      }
    ],
    settings: {}
  }),
  created() {
    auth.getUserInfo(this);
    this.getActiveLink(this.menus);

    window.eventBus.$on("appStore", appStore => {
      this.appStore = appStore;
    });
  },
  methods: {
    onResize() {
      this.windowSize = { x: window.innerWidth, y: window.innerHeight };
    },
    goTo(path) {
      this.$router.push(path);
    },
    logout() {
      auth.logout(this);
    },
    getActiveLink(menus) {
      menus.forEach(item => {
        if (item.items) {
          this.getActiveLink(item.items);
          const activeFilter = _.filter(item.items, o => {
            return o.active;
          });
          if (activeFilter.length > 0) {
            item.active = true;
          } else {
            item.active = false;
          }
        } else {
          if ("/" + item.path === this.$route.path) {
            item.active = true;
          } else {
            item.active = false;
          }
        }
      });
    }
  },
  watch: {
    $route() {
      this.getActiveLink(this.menus);
    },
    settings: {
      handler() {
        if (this.settings[0].length > 0) {
          setAppStore("namaPT", this.settings[0][0]["value"]);
        }
      },
      deep: true
    }
  },
  computed: {
    extraQueryOptions() {
      let where = [
        {
          id: "nama_pt"
        }
      ];
      return where;
    }
  }
};
</script>


<style>
html {
  overflow: auto !important;
}

.toolbar__items .active-menu-header {
  background: #3949a3 !important;
}

.toolbar-icon {
  background-color: #ffffff;
}

a:hover {
  text-decoration: none;
}

.navigation-drawer
  > .list
  .list--group__container
  .list__tile--active
  .list__tile__title {
  color: black !important;
}

.list__tile--active {
  border-right: 3px solid #1976d2;
  background-color: #e0e0e0;
}

.list__tile:after {
  height: 0px !important;
}

.btn--small {
  font-size: 10px !important;
}

table.table tbody td,
table.table tbody th {
  height: auto !important;
  padding: 5px 24px !important;
}

.application--light .table tbody tr[active] {
  color: #ffffff;
  background: #205e9d !important;
  border-bottom: 1px solid #205fa7;
}
.pointer {
  cursor: pointer;
}

.detail .input-group--disabled label {
  color: rgba(85, 85, 85, 1) !important;
}

.detail .input-group input:disabled,
.detail .input-group textarea:disabled {
  color: rgba(0, 0, 0, 1) !important;
}

.header-left-toolbar {
  width: 300px;
  background-color: #ffffff;
  padding: 0 20px !important;
  margin-left: 0 !important;
  align-items: center;
}

.header-img {
  height: 40px;
}

.header-link {
  margin-left: 20px;
}

.header-link > .btn {
  font-weight: 300 !important;
}

.right-sidebar {
  padding-right: 20px;
}

.modal-content {
  align-items: center;
  height: 100%;
  justify-content: center;
  left: 0;
  position: fixed;
  top: 0;
  width: 100%;
}

.vuedal {
  padding: 0px !important;
  margin: 0px !important;
}

.full-modal {
  width: 100% !important;
  height: 100% !important;
  margin: 0 !important;
}

.input-error {
  color: #ff5252;
}

.bold {
  font-weight: bold !important;
}

.empty-room {
  margin-bottom: 200px !important;
}
.footer {
  background-color: transparent !important;
}
.footer-right {
  text-align: right !important;
}

.mx-datepicker {
  width: 100% !important;
}
.mx-input {
  font-size: 17px !important;
  padding-left: 1px !important;
  border: none !important;
  border-bottom: 1px solid rgba(0, 0, 0, 0.5) !important;
  border-radius: 0px !important;
  box-shadow: inset 0 0px 0px rgba(0, 0, 0, 0.075) !important;
}
.keterangan {
  margin-top: -20px;
  position: absolute;
}
.float-right {
  float: right;
}
.picture-preview-label {
  font-size: 12px !important;
}
.preview-container {
  margin: 3px 0 0 0 !important;
}
.preview-container .picture-preview {
  z-index: 1 !important;
  border: 4px solid slategrey !important;
}
.btn-row {
  margin-left: -2px !important;
}
</style>

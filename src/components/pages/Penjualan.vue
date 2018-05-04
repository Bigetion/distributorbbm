<template>
  <div>
    <v-toolbar class="grey lighten-3" light flat>
      <v-toolbar-title>Penjualan</v-toolbar-title>
    </v-toolbar>
    <div>
      <div v-if="state.isAdd || state.isEdit">
        <add-edit-penjualan 
          :data="state.isAdd ? {}: this.selectedRow[0]" 
          :is-edit="state.isEdit || !state.isAdd"
          :on-cancel="onCancel"
          :on-submitted="onSubmitted"
        ></add-edit-penjualan>
      </div>
      <div v-show="!(state.isAdd || state.isEdit)">
        <v-card flat class="pt-3 px-2">
          <v-layout row wrap>
            <v-flex md4 class="px-2">
              <vdatepicker 
                :editable="true" 
                label="Tanggal Jatuh Tempo" 
                v-model="filterInput.tanggalJatuhTempo" 
                :range="true"
              ></vdatepicker>
            </v-flex>
            <v-flex md4 class="px-2">
              <v-select
                multiple
                :items="['OK', 'Not OK']"
                v-model="filterInput.approveOwner"
                label="Approved Owner"
              ></v-select>
            </v-flex>
            <v-flex md4 class="px-2">
              <v-text-field label="Status Bayar" v-model="filterInput.statusBayar"></v-text-field>
            </v-flex>
          </v-layout>
          <v-layout row wrap>
            <v-btn dark class="teal" style="margin-top:-10px !important" @click="showFilter()">Filter</v-btn>
          </v-layout>
        </v-card>
        <v-card flat>
          <v-layout row wrap>
            <v-flex md12 class="pa-3">
              <!-- <v-text-field solo label="Search" append-icon="search" class="mb-2" v-model="q"></v-text-field> -->
              <table-view 
                from-file="penjualan" 
                :is-refresh="state.isRefresh"
                :is-delete="state.isDelete"
                :is-download="state.isDownload"
                :on-select="onSelect"
                :extra-query-options="extraQueryOptions"
              ></table-view>
            </v-flex>
          </v-layout>
        </v-card>
        <v-divider></v-divider>
        <v-card flat class="pa-2">
          <v-btn success @click="setIsAdd(true)">Tambah</v-btn>
          <v-btn v-if="selectedRow.length==1" primary  @click="setIsEdit(true)">Edit</v-btn>
          <v-btn dark class="deep-orange float-right" v-if="selectedRow.length==1 && selectedRow[0]['approved']=='1'" @click="onCetakManual()">Cetak 2</v-btn>
          <v-btn dark class="deep-orange float-right" v-if="selectedRow.length==1 && selectedRow[0]['approved']=='1'" @click="onCetak()">Cetak 1</v-btn>
          <v-btn dark class="teal float-right" v-if="selectedRow.length==1 && selectedRow[0]['approved']=='0' && user.idRole=='1'" default @click="onApprove()">Approve</v-btn>
        </v-card>
      </div>
    </div>
  </div>
</template>

<script>
import moment from "moment";
import { modal } from "./../../utils/modal";
import { confirm } from "./../../utils/modal";
import auth from "./../../utils/auth";

import AddEditPenjualan from "./forms/AddEditPenjualan.vue";
import FormCetakPenjualan from "./forms/FormCetakPenjualan.vue";
import FormCetakPenjualanManual from "./forms/FormCetakPenjualanManual.vue";

export default {
  components: { AddEditPenjualan },
  data: () => ({
    user: auth.user,
    state: {
      isAdd: false,
      isEdit: false,
      isRefresh: false,
      isDownload: false
    },
    q: "",
    selectedRow: [],
    input: {
      nama: ""
    },
    filterInput: {
      tanggalJatuhTempo: [],
      approveOwner: [],
      statusBayar: ""
    },
    filter: {
      tanggalJatuhTempo: [],
      approveOwner: [],
      statusBayar: ""
    }
  }),
  created() {},
  methods: {
    showFilter() {
      this.filter = Object.assign({}, this.filterInput);
    },
    onSelect(row) {
      this.selectedRow = row;
    },
    setIsAdd(condition) {
      this.state.isAdd = condition;
    },
    setIsEdit(condition) {
      this.state.isEdit = condition;
    },
    onCancel() {
      this.setIsAdd(false);
      this.setIsEdit(false);
    },
    onSubmitted() {
      this.onCancel();
      this.state.isRefresh = !this.state.isRefresh;
    },
    onApprove() {
      confirm(this, {
        title: "Konfirmasi Approve",
        message: "Apakah anda yakin?"
      }).then(() => {
        this.$http
          .post("base/service/executeMutation", {
            id: this.selectedRow[0]["id"],
            type: "update",
            name: "penjualan",
            data: {
              approved: 1
            }
          })
          .then(() => {
            this.state.isRefresh = !this.state.isRefresh;
          });
      });
    },
    onCetak() {
      modal(this, {
        name: "full-modal",
        props: {
          data: this.selectedRow[0]
        },
        dismissable: false,
        component: FormCetakPenjualan
      }).then(response => {});
    },
    onCetakManual() {
      modal(this, {
        name: "full-modal",
        props: {
          data: this.selectedRow[0]
        },
        dismissable: false,
        component: FormCetakPenjualanManual
      }).then(response => {});
    }
  },
  computed: {
    extraQueryOptions() {
      let extraQueryOptions = {};
      if (this.filter.tanggalJatuhTempo.length > 0) {
        extraQueryOptions = Object.assign(extraQueryOptions, {
          "jatuh_tempo[<>]": [
            moment(this.filter.tanggalJatuhTempo[0]).format("YYYY-MM-DD"),
            moment(this.filter.tanggalJatuhTempo[1]).format("YYYY-MM-DD")
          ]
        });
      }
      if (this.filter.approveOwner.length > 0) {
        let approved = [];
        this.filter.approveOwner.forEach(item => {
          if (item == "OK") approved.push("1");
          if (item == "Not OK") approved.push("0");
        });
        extraQueryOptions = Object.assign(extraQueryOptions, {
          approved: approved
        });
      }
      if (this.filter.statusBayar != "") {
        extraQueryOptions = Object.assign(extraQueryOptions, {
          status_bayar: this.filter.statusBayar
        });
      }
      return extraQueryOptions;
    }
  }
};
</script>

<style lang="css">

</style>

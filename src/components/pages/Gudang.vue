<template>
  <div>
    <v-toolbar class="grey lighten-3" light flat>
      <v-toolbar-title>Gudang</v-toolbar-title>
    </v-toolbar>
    <div>
      <div v-if="state.isAdd || state.isEdit">
        <add-edit-gudang 
          :data="state.isAdd ? {}: this.selectedRow[0]" 
          :is-edit="state.isEdit || !state.isAdd"
          :on-submitted="onSubmitted" 
          :on-cancel="onCancel" 
          :stok-opname="stokOpname"
          :nomor-referensi-options="nomorReferensiOptions"
        ></add-edit-gudang>
      </div>
      <div v-show="!(state.isAdd || state.isEdit)">
        <v-card flat>
          <v-layout row wrap>
            <v-flex md12 class="px-3 pt-3">
              <daterangepicker v-model="filterDate" from-label="Dari Tanggal" to-label="Ke Tanggal" value-format="DD MMMM YYYY"></daterangepicker>
              <v-btn primary class="btn-row" @click="filter()">Tampilkan</v-btn>
            </v-flex>
            <v-flex md12 class="pa-3">
              <table-view 
                from-file="inventory" 
                :is-refresh="state.isRefresh"
                :is-download="state.isDownload"
                :extra-query-options="tableExtraQuery"
                :get-total-rows="getTotalRows"
                :get-columns="getColumns"
                :on-select="onSelect"
              ></table-view>
            </v-flex>
          </v-layout>
        </v-card>
        <v-divider></v-divider>
        <v-card flat class="pa-2">
          <v-btn success @click="setIsAdd(true)">Tambah</v-btn>
          <v-btn v-if="selectedRow.length==1" primary @click="setIsEdit(true)">Edit</v-btn>
          <v-btn v-if="totalRows>0" success @click="exportExcel()">Eksport Excel</v-btn>
          <div class="float-right pr-2 pt-2">
            <span class="subheading">Jumlah Stok : </span> <span class="title ml-2">{{stokOpname}}</span>
          </div>
        </v-card>
      </div>
    </div>
    <query-service v-model="gudang" from-file="inventory" :extra-query-options="extraQueryOptions" :is-refresh="state.isRefresh"></query-service>
    <query-service v-model="nomorReferensiData" from-file="nomor_referensi"></query-service>
  </div>
</template>

<script>
import moment from "moment";
import { modal } from "./../../utils/modal";
import { excel } from "./../../utils/exportDownload";
import AddEditGudang from "./../pages/forms/AddEditGudang";
export default {
  components: { AddEditGudang },
  data: () => ({
    state: {
      isAdd: false,
      isEdit: false,
      isRefresh: false,
      isDownload: false
    },
    filterDate: {
      from: "",
      to: ""
    },
    fromDate: "",
    toDate: "",
    gudang: [],
    stok: 0,
    stokOpname: 0,
    totalRows: 0,
    columns: [],
    selectedRow: [],
    nomorReferensiData: [],
    nomorReferensiOptions: []
  }),
  created() {},
  methods: {
    onSelect(row) {
      this.selectedRow = row;
    },
    filter() {
      this.fromDate = this.filterDate.from;
      this.toDate = this.filterDate.to;
    },
    setIsAdd(condition) {
      this.state.isAdd = condition;
    },
    setIsEdit(condition) {
      this.state.isEdit = condition;
    },
    getTotalRows(totalRows) {
      this.totalRows = totalRows;
    },
    getColumns(columns) {
      this.columns = columns;
    },
    onCancel() {
      this.setIsAdd(false);
      this.setIsEdit(false);
    },
    onSubmitted() {
      this.onCancel();
      this.state.isRefresh = !this.state.isRefresh;
    },
    exportExcel() {
      this.$http
        .post("base/table/getData", {
          name: "inventory",
          where: this.tableExtraQuery
        })
        .then(response => {
          var exportedData = [
            {
              table: {
                title: "Data Gudang",
                fields: this.downloadFields,
                data: response.data.data
              }
            }
          ];
          excel(exportedData, "data_gudang");
        });
    }
  },
  computed: {
    extraQueryOptions() {
      let where = [
        {
          ORDER: {
            created: "DESC"
          },
          LIMIT: 1
        },
        {
          ORDER: {
            tanggal: "ASC"
          },
          LIMIT: 1
        },
        {
          ORDER: {
            tanggal: "DESC"
          },
          LIMIT: 1
        }
      ];
      return where;
    },
    tableExtraQuery() {
      let extraQueryOptions = false;
      if (this.fromDate != "") {
        extraQueryOptions = {
          "tanggal[<>]": [this.fromDate, this.toDate]
        };
      }
      return extraQueryOptions;
    },
    downloadFields() {
      let fields = [];
      this.columns.forEach(item => {
        fields.push({
          id: item.value,
          title: item.text
        });
      });
      return fields;
    }
  },
  watch: {
    gudang: {
      handler() {
        if (this.gudang[0].length > 0) {
          this.stokOpname = this.gudang[0][0]["stok_opname"];
        }
        if (this.gudang[1].length > 0) {
          this.filterDate.from = this.gudang[1][0]["tanggal"];
        }
        if (this.gudang[2].length > 0) {
          this.filterDate.to = this.gudang[2][0]["tanggal"];
        }
      },
      deep: true
    },
    nomorReferensiData: {
      handler() {
        this.nomorReferensiOptions = [];
        if (this.nomorReferensiData[0].length > 0) {
          this.nomorReferensiData[0].forEach(item => {
            this.nomorReferensiOptions.push({
              id: item["nomor_do"],
              value: item["nomor_do"]
            });
          });
        }
        if (this.nomorReferensiData[1].length > 0) {
          this.nomorReferensiData[1].forEach(item => {
            this.nomorReferensiOptions.push({
              id: item["nomor_po"],
              value: item["nomor_po"]
            });
          });
        }
      },
      deep: true
    }
  }
};
</script>

<style lang="css">

</style>

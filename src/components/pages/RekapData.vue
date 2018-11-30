<template>
  <div>
    <v-toolbar class="grey lighten-3" light flat>
      <v-toolbar-title>Rekap Data</v-toolbar-title>
    </v-toolbar>
    <div>
      <v-card flat class="px-3 pt-3">
        <v-layout row wrap>
          <v-flex md12>
            <daterangepicker v-model="filterDate" from-label="Dari Tanggal" to-label="Ke Tanggal" value-format="DD MMMM YYYY"></daterangepicker>
            <v-btn primary class="btn-row" @click="filter()">Tampilkan</v-btn>
          </v-flex>
        </v-layout>
      </v-card>
      <v-card flat class="pa-3" v-if="fromDate!=''">
        <v-tabs :scrollable="false" class="elevation-3" v-model="activeTab">
          <v-tabs-bar class="grey lighten-3">
            <v-tabs-slider class="orange"></v-tabs-slider>
            <v-tabs-item key="penjualan" href="#penjualan">Penjualan</v-tabs-item>
            <v-tabs-item key="pembelian" href="#pembelian">Pembelian</v-tabs-item>
          </v-tabs-bar>
          <v-tabs-items>
            <v-tabs-content key="penjualan" id="penjualan">
              <table-view
                class="elevation-0 mb-4"
                from-file="penjualan" 
                :extra-query-options="extraQueryOptionsPenjualan" 
                :get-columns="getColumnsPenjualan" 
                :get-total-rows="getTotalRowsPenjualan"
              ></table-view>
              <div class="px-2">
                <p>Total QTY : <span class="bold">{{penjualan.qty}} KL</span></p>
                <p>Total Penjualan : <span class="bold">{{penjualan.total}}</span></p>
              </div>
            </v-tabs-content>
            <v-tabs-content key="pembelian" id="pembelian">
              <table-view 
                class="elevation-0 mb-4"
                from-file="pembelian" 
                :extra-query-options="extraQueryOptionsPembelian" 
                :get-columns="getColumnsPembelian"
                :get-total-rows="getTotalRowsPembelian"
              ></table-view>
              <div class="px-2">
                <p>Total QTY : <span class="bold">{{pembelian.qty}} KL</span></p>
                <p>Total Pembelian : <span class="bold">{{pembelian.total}}</span></p>
              </div>
            </v-tabs-content>
          </v-tabs-items>
        </v-tabs>
        <v-btn v-show="activeTab=='penjualan'&&totalRowsPenjualan>0" success class="btn-row mt-3" @click="exportExcel()">Eksport Excel</v-btn>
        <v-btn v-show="activeTab=='pembelian'&&totalRowsPembelian>0" success class="btn-row mt-3" @click="exportExcel()">Eksport Excel</v-btn>
      </v-card>
    </div>
    <query-service v-model="rekap" from-file="rekap" :extra-query-options="extraQueryOptions"></query-service>
  </div>
</template>

<script>
import moment from "moment";
import { excel } from "./../../utils/exportDownload";
export default {
  data: () => ({
    filterDate: {
      from: new Date(),
      to: new Date()
    },
    fromDate: "",
    toDate: "",
    activeTab: "penjualan",
    columnsPenjualan: [],
    columnsPembelian: [],
    totalRowsPenjualan: 0,
    totalRowsPembelian: 0,
    penjualan: {
      qty: 0,
      total: 0
    },
    pembelian: {
      qty: 0,
      total: 0
    },
    rekap: []
  }),
  created() {},
  methods: {
    formatCurrency(value) {
      let val = (value / 1).toFixed(0).replace(".", ",");
      return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    },
    filter() {
      this.fromDate = this.filterDate.from;
      this.toDate = this.filterDate.to;
    },
    getTotalRowsPenjualan(totalRows) {
      this.totalRowsPenjualan = totalRows;
    },
    getTotalRowsPembelian(totalRows) {
      this.totalRowsPembelian = totalRows;
    },
    getColumnsPenjualan(columns) {
      this.columnsPenjualan = columns;
    },
    getColumnsPembelian(columns) {
      this.columnsPembelian = columns;
    },
    exportExcel() {
      this.$http
        .post("base/table/getData", {
          name: this.activeTab == "penjualan" ? "penjualan" : "pembelian",
          where:
            this.activeTab == "penjualan"
              ? this.extraQueryOptionsPenjualan
              : this.extraQueryOptionsPembelian
        })
        .then(response => {
          var exportedData = [
            {
              table: {
                title: `Data ${
                  this.activeTab == "penjualan" ? "Penjualan" : "Pembelian"
                }`,
                fields:
                  this.activeTab == "penjualan"
                    ? this.downloadFieldsPenjualan
                    : this.downloadFieldsPembelian,
                data: response.data.data
              }
            }
          ];
          excel(exportedData, `data_${this.activeTab}`);
        });
    }
  },
  computed: {
    extraQueryOptions() {
      let where = [
        {
          where:
            "tanggal_pembelian between '" +
            moment(this.fromDate).format("YYYY-MM-DD") +
            "' and '" +
            moment(this.toDate).format("YYYY-MM-DD") +
            "'"
        },
        {
          where:
            "tanggal_penjualan between '" +
            moment(this.fromDate).format("YYYY-MM-DD") +
            "' and '" +
            moment(this.toDate).format("YYYY-MM-DD") +
            "'"
        }
      ];
      return where;
    },
    extraQueryOptionsPenjualan() {
      let extraQueryOptions = false;
      if (this.fromDate != "") {
        extraQueryOptions = {
          "tanggal_penjualan[<>]": [this.fromDate, this.toDate]
        };
      }
      return extraQueryOptions;
    },
    extraQueryOptionsPembelian() {
      let extraQueryOptions = false;
      if (this.fromDate != "") {
        extraQueryOptions = {
          "tanggal_pembelian[<>]": [this.fromDate, this.toDate]
        };
      }
      return extraQueryOptions;
    },
    downloadFieldsPenjualan() {
      let fields = [];
      this.columnsPenjualan.forEach(item => {
        fields.push({
          id: item.value,
          title: item.text
        });
      });
      return fields;
    },
    downloadFieldsPembelian() {
      let fields = [];
      this.columnsPembelian.forEach(item => {
        fields.push({
          id: item.value,
          title: item.text
        });
      });
      return fields;
    }
  },
  watch: {
    rekap: {
      handler() {
        this.pembelian = {
          qty: this.rekap[0][0]["qty"] || 0,
          total: this.formatCurrency(this.rekap[0][0]["total"] || 0)
        };
        this.penjualan = {
          qty: this.rekap[1][0]["qty"] || 0,
          total: this.formatCurrency(this.rekap[1][0]["total"] || 0)
        };
      },
      deep: true
    }
  }
};
</script>

<style lang="css">

</style>

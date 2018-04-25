<template>
  <v-card>
    <v-data-table flat :headers="columns" :items="data" :search="search" v-bind:pagination.sync="paginationSort" hide-actions :loading="loading">
      <template slot="items" scope="props">
        <slot v-if="hasTemplate" name="items" :item="props.item" :index="props.index"></slot>
        <tr v-else :active="getActiveSelectedRow(props.item)" @click="selectRow(props, $event)" :style="{cursor:'pointer'}" v-hotkey="keymap">
          <td :style="{width:'80px'}">{{ (props.index) + ((pagination.page-1) * pagination.rowsPerPage) + 1 }}</td>
          <td v-for="(item, index) in columns" v-bind:key="item[primaryKey]" v-if="index>0" :style="{minWidth: `${item.width}px !important`, textAlign: item.align}">
            <div v-if="item.type">
              <span v-if="item.type=='date'">
                {{formatDate(props.item[item.value], item.options.format)}}
              </span>
              <span v-else-if="item.type=='currency'">
                {{formatCurrency(props.item[item.value])}}
              </span>
              <span v-else-if="item.type=='enum'">
                {{item.options.data[props.item[item.value]]}}
              </span>
              <span v-else>
                {{ props.item[item.value] }}
              </span>
            </div>
            <div v-else>{{ props.item[item.value] }}</div>
          </td>
        </tr>
      </template>
    </v-data-table>
    <v-divider></v-divider>
    <v-layout row wrap class="mt-2" v-show="totalRows > pagination.rowsPerPage">
      <v-flex xs12 md9>
        <div class="py-3">
          <v-pagination v-model="pagination.page" :length="pages" :total-visible="10"></v-pagination>
        </div>
      </v-flex>
      <v-flex xs12 md3>
        <div class="pa-2">
          <v-select class="mt-2" v-model="pagination.rowsPerPage" v-bind:items="[10, 25, 50, 100]" label="Rows per page"></v-select>
        </div>
      </v-flex>
    </v-layout>
  </v-card>
</template>

<script>
import _ from "lodash";
import moment from 'moment';

import { confirm, downloadExcel } from './../../utils/modal'

export default {
  props: {
    extraQueryOptions: {},
    fromFile: {
      type: String,
      required: true
    },
    isRefresh: {},
    isDelete: {},
    isRecoverDelete: {},
    isPermanentDelete: {},
    isDownload: {},
    onSelect: {},
    onDeleted: {},
    hasTemplate: {},
    getTotalRows: {},
    getItems: {},
    getColumns: {}
  },
  data() {
    return {
      primaryKey: "",
      data: [],
      pagination: {
        page: 1,
        sortBy: null,
        rowsPerPage: 25
      },
      totalRows: 0,
      paginationSort: {},
      queryOptionsLoaded: false,
      selectedRow: [],
      primaryKeySelectedId: [],
      lastClickIndex: 0,
      params: {},
      tableViewOptionsLoaded: false,
      loading: false
    };
  },
  methods: {
    getActiveSelectedRow(item) {
      const index = _.findIndex(this.selectedRow, o => {
        return o[this.primaryKey] === item[this.primaryKey];
      });
      return index >= 0 ? true : false;
    },
    selectAll(e){
      this.selectedRow = [];
      this.primaryKeySelectedId = [];
      this.data.forEach((item)=>{
        this.selectedRow.push(item);
        this.primaryKeySelectedId.push(item[this.primaryKey]);
      });
    },
    selectRow(props, e) {
      if(this.onSelect){
        document.onselectstart = function() {
          return false;
        }
        if(e.shiftKey) {
          this.selectedRow = [];
          let startIndex = 0;
          let endIndex = 0;
          if (this.lastClickIndex < props.index) {
            startIndex = this.lastClickIndex;
            endIndex = props.index;
          } else {
            startIndex = props.index;
            endIndex = this.lastClickIndex;
          }
          for(let i = startIndex; i <= endIndex; i++) {
            this.selectedRow.push(this.data[i])
          }
        } else {
          this.lastClickIndex = props.index;
          if (e.metaKey || e.ctrlKey) {
            const index = _.findIndex(this.selectedRow, o => {
              return o[this.primaryKey] === props.item[this.primaryKey];
            });
            if (index == -1) this.selectedRow.push(props.item);
            else this.selectedRow.splice(index, 1);
          } else {
            if(this.selectedRow.length == 1){
              if(this.selectedRow[0][this.primaryKey] === props.item[this.primaryKey]){
                this.selectedRow = [];
              }else{
                this.selectedRow = [];
                this.selectedRow.push(props.item);
              }
            }else{
              this.selectedRow = [];
              this.selectedRow.push(props.item);
            }
          }
        }
        this.primaryKeySelectedId = [];
        this.selectedRow.forEach((item)=>{
          this.primaryKeySelectedId.push(item[this.primaryKey]);
        })
      }
    },
    resetSelectedRow() {
      this.selectedRow = []
    },
    getTableViewOptions() {
      this.loading = true;
      this.$http
        .post("base/table/getTableViewOptions", { name: this.fromFile })
        .then(response => {
          this.columns = [
            {
              text: "#",
              align: "left",
              sortable: false
            }
          ];
          this.columns = this.columns.concat(response.data.columns);
          this.primaryKey = response.data.primary_key;
          this.tableViewOptions = response.data;
          this.tableViewOptionsLoaded = true;
          this.getData();
          if(this.getColumns) {
            this.getColumns(response.data.columns)
          }
          this.tableViewOptionsLoaded = true;
        });
    },
    getData() {
      this.loading = true;
      this.selectedRow = [];
      this.params = {
        name: this.fromFile
      };
      if (typeof this.tableViewOptions.query == "string") {
        if (typeof this.extraQueryOptions == "string") {
          this.params.where = this.extraQueryOptions;
        }else{
          this.params.where = Object.assign({}, this.extraQueryOptions);
        }
      } else {
        this.params.where = {
          ORDER: {
            [this.paginationSort.sortBy]: this.paginationSort.descending ? "DESC" : "ASC"
          },
          LIMIT: [
            (this.pagination.page - 1) * this.pagination.rowsPerPage, this.pagination.rowsPerPage
          ]
        };
        if (this.paginationSort.sortBy == null) {
          this.params.where.ORDER = null;
        }

        if(this.tableViewOptions.query.where){
          if(!this.params.where) this.params.where = {}
          this.params.where = Object.assign(this.params.where, this.tableViewOptions.query.where);
        }
        
        if (this.extraQueryOptions) {
          if(!this.params.where) this.params.where = {}
          this.params.where = Object.assign(this.params.where, this.extraQueryOptions);
        }
      }

      this.$http.post("base/table/getData", this.params).then(response => {
        this.loading = false;
        this.data = response.data.data;
        this.totalRows = response.data.total_rows;

        if(this.getTotalRows) this.getTotalRows(response.data.total_rows)
        if(this.getItems) this.getItems(this.data)
      });
    },
    formatDate(date, format){
      return moment(date).format(format)
    },
    formatCurrency(value) {
      let val = (value/1).toFixed(0).replace('.', ',')
      return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
    }
  },
  created() {
    this.getTableViewOptions();
    this.paginationSort = this.pagination;
  },
  watch: {
    pagination: {
      handler(newVal) {
        if (this.tableViewOptionsLoaded) {
          this.getData();
          this.paginationSort.rowsPerPage = this.pagination.rowsPerPage;
        }
      },
      deep: true
    },
    paginationSort: {
      handler() {
        if (this.tableViewOptionsLoaded) {
          this.getData();
        }
      },
      deep: true
    },
    extraQueryOptions: {
      handler() {
        if(this.tableViewOptionsLoaded)
        this.getData();
      },
      deep: true
    },
    selectedRow: {
      handler() {
        if(this.onSelect) this.onSelect(this.selectedRow);
      },
      deep: true
    },
    isRefresh: {
      handler() {
        this.selectedRow = {};
        this.getData();
      },
      deep: true
    },
    isDelete: {
      handler() {
        confirm(this, {
          message: 'Are you sure you want to delete?'
        }).then(()=> {
          this.$http.post("base/table/submitDelete", {table:this.tableViewOptions.query.table, where:{[this.primaryKey]: this.primaryKeySelectedId}}).then(response => {
            if (response.data.success_message) {
              if(this.onDeleted) this.onDeleted(this.primaryKeySelectedId);
              this.primaryKeySelectedId = [];
              this.getData();
            }
          });
        })
      },
      deep: true
    },
    isRecoverDelete: {
      handler() {
        confirm(this, {
          message: "Are you sure you want to recover deleted record?"
        }).then(()=> {
          this.$http.post("base/table/recoverDelete", {table:this.tableViewOptions.query.table, where:{[this.primaryKey]: this.primaryKeySelectedId}}).then(response => {
            if (response.data.success_message) {
              this.getData();
            }
          });
        })
      },
      deep: true
    },
    isPermanentDelete: {
      handler() {
        confirm(this, {
          message: "Are you sure you want to permanently delete?"
        }).then(()=> {
          this.$http.post("base/table/permanentDelete", {table:this.tableViewOptions.query.table, where:{[this.primaryKey]: this.primaryKeySelectedId}}).then(response => {
            if (response.data.success_message) {
              this.getData();
            }
          });
        })
      },
      deep: true
    },
    isDownload: {
      handler() {
        downloadExcel(this, {
          title: this.tableViewOptions.title || '',
          columns: this.tableViewOptions.columns,
          queryParams: this.params
        })
      },
      deep: true
    },
  },
  computed: {
    keymap() {
      return {
        'meta+a': this.selectAll,
        'ctrl+a': this.selectAll,
      }
    },
    pages() {
      let pages = Math.ceil(
        this.totalRows / this.pagination.rowsPerPage
      );
      if(this.pagination.page > pages) this.pagination.page = 1;
      return pages;
    }
  }
};
</script>

<style lang="css">
  td {
    max-width: 300px;
    overflow: hidden;
    text-overflow: ellipsis !important;
    white-space: nowrap;
  }
</style>

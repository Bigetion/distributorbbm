<template>
  <v-layout justify-center class="modal-content">
    <v-card class="white download-content">
      <v-card-title>
        <div class="headline">Download Excel</div>
      </v-card-title>
      <v-divider></v-divider>
      <v-card-text>
        <select-view class="mb-5" placeholder="Select Field" multiple v-model="selected" :options="columns" track-by="value" label="text"></select-view>
        <v-text-field label="Filename" v-model="filename"></v-text-field>
      </v-card-text>
      <v-divider></v-divider>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn v-show="filename!='' && downloadFields.length > 0" class="blue--text darken-1" flat="flat" @click="ok">Download</v-btn>
        <v-btn class="red--text darken-1" flat="flat" @click="cancel">Cancel</v-btn>
      </v-card-actions>
    </v-card>
  </v-layout>
</template>

<script>
import moment from 'moment'
import { excel } from './../../utils/exportDownload'
export default {
  props: {
    title: {
      type: String
    },
    columns: {
      type: Array
    },
    data: {
      type: Array
    },
    queryParams: {}
  },
  data() {
    return {
      selected: [],
      filename: moment().format('DD_MM_YYYY')
    }
  },
  created() {
    this.columns.forEach((item)=>{
      this.selected.push(item.value)
    })
    if(this.title) this.filename = `${this.title}_${moment().format('DD_MM_YYYY')}`
  },
  methods: {
    ok: function() {
      if(this.queryParams) {
        if(this.queryParams.where){
          if(this.queryParams.where.LIMIT){
            delete this.queryParams.where['LIMIT']
          }
        }
        this.$http.post("base/table/getData", this.queryParams).then(response => {
          var exportedData = [{
            table: {
              title: `Data ${this.title}`,
              fields: this.downloadFields,
              data: response.data.data
            }
          }];
          excel(exportedData, this.filename)
          this.$vuedals.close(true)
        })
      } else if(this.data) {
        var exportedData = [{
          table: {
            title: `Data ${this.title}`,
            fields: this.downloadFields,
            data: this.data
          }
        }];
        excel(exportedData, this.filename)
        this.$vuedals.close(true)
      }
    },
    cancel: function() {
      this.$vuedals.close(false)
    }
  },
  computed: {
    downloadFields() {
      let fields = []
      this.columns.forEach((item)=>{
        if(this.selected.indexOf(item.value) != -1){
          fields.push({
            id: item.value,
            title: item.text
          })
        }
      })
      return fields
    }
  }
}
</script>

<style lang="css">
.download-modal {
  top: 40%;
  width: 450px;
  margin: 0 auto;
  background-color: #ffffff
}
.download-content {
  width: 450px
}
</style>

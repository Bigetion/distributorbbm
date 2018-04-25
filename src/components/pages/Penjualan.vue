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
        <v-card flat>
          <v-layout row wrap>
            <v-flex md12 class="pa-3">
              <v-text-field solo label="Search" append-icon="search" class="mb-2" v-model="q"></v-text-field>
              <table-view 
                from-file="penjualan" 
                :is-refresh="state.isRefresh"
                :is-delete="state.isDelete"
                :is-download="state.isDownload"
                :on-select="onSelect"
              ></table-view>
            </v-flex>
          </v-layout>
        </v-card>
        <v-divider></v-divider>
        <v-card flat class="pa-2">
          <v-btn success @click="setIsAdd(true)">Tambah</v-btn>
          <v-btn v-if="selectedRow.length==1" primary  @click="setIsEdit(true)">Edit</v-btn>
        </v-card>
      </div>
    </div>
  </div>
</template>

<script>
import AddEditPenjualan from "./forms/AddEditPenjualan.vue";
export default {
  components: { AddEditPenjualan },
  data: () => ({
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
    }
  }),
  created() {},
  methods: {
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
    }
  }
};
</script>

<style lang="css">

</style>

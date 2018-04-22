<template>
  <div>
    <div v-if="state.isAdd || state.isEdit">
      <add-edit-user 
        :data="state.isAdd ? {}: this.selectedRow[0]" 
        :is-edit="state.isEdit || !state.isAdd"
        :on-cancel="onCancel"
        :on-submitted="onSubmitted"
      ></add-edit-user>
    </div>
    <div v-show="!(state.isAdd || state.isEdit)">
      <v-card flat class="pa-4">
        <table-view 
          from-file="pengguna" 
          :is-refresh="state.isRefresh"
          :is-delete="state.isDelete"
          :is-download="state.isDownload"
          :on-select="onSelect"
        ></table-view>
      </v-card>
      <v-divider></v-divider>
      <v-card flat class="pa-3">
        <v-btn success @click="setIsAdd(true)">Tambah</v-btn>
        <v-btn v-if="selectedRow.length==1" primary  @click="setIsEdit(true)">Edit</v-btn>
        <v-btn v-if="selectedRow.length > 0 && deletePermission" error @click.stop="state.isDelete = !state.isDelete">Hapus</v-btn>
      </v-card>
    </div>
  </div>
</template>

<script>
import _ from "lodash";
import auth from "./../../utils/auth";
import AddEditUser from "./forms/AddEditUser.vue";

export default {
  components: { AddEditUser },
  data: () => ({
    user: auth.user,
    state: {
      isAdd: false,
      isEdit: false,
      isRefresh: false,
      isDelete: false,
      isDownload: false
    },
    selectedRow: []
  }),
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
  },
  created() {},
  computed: {
    deletePermission() {
      let condition = false;
      if (this.selectedRow.length == 1) {
        if (
          this.selectedRow[0].id_user != "1" &&
          this.selectedRow[0].id_user != this.user.idUser
        ) {
          condition = true;
        }
      }
      if (this.selectedRow.length > 1) {
        condition = true;
        const a = _.filter(this.selectedRow, o => {
          return o.id_user == "1" || o.id_user == this.user.idUser;
        });
        if (a.length > 0) condition = false;
      }
      return condition;
    }
  }
};
</script>

<style lang="css">

</style>

<template>
  <div :style="{overview:'auto'}">
    <li>
      <div class="item">
        <span @click="toggle" v-if="isFolder" :style="{marginRight:'3px'}" class="pointer">[{{open ? '-' : '+'}}]</span> <span @click="onSelect(items)" :class="(( !value && items[primaryKey]==selectedId) || value==defaultParent) ? 'selected':''" class="pointer">{{items[valueKey]}}</span>
      </div>
      <ul v-show="open" v-if="isFolder && myItems.children">
        <tree-view v-for="myItems in myItems.children" v-bind:key="myItems[primaryKey]" :items="myItems" :selected-id="mySelectedId" :select-me="onSelect" :expand="expandAll"></tree-view>
      </ul>
    </li>
  </div>
</template>

<script>
import _ from "lodash"
export default {
  props: {
    value: {},
    items: {
      type: Object,
      default: function () { 
        return {
          id: "-1",
          name: "All",
          children: []
        } 
      }
    },
    fromFile:{
      type: String
    },
    selectMe: {},
    selectedId: {},
    defaultParent: {
      type: String,
      default: function () { 
        return "-1"
      }
    },
    modelIsRecursive: {
      type: Boolean
    },
    expand: {},
    expandAll: {}
  },
  data() {
    return {
      open: this.expandAll || this.expand,
      myItems: this.items,
      mySelectedId: this.selectedId,
      primaryKey: "id",
      parentKey: "parent",
      valueKey: "name"
    }
  },
  computed: {
    isFolder() {
      return this.myItems.children && this.myItems.children.length
    }
  },
  created() {
    if(this.fromFile){
      this.getTreeViewOptions();
    }
  },
  methods: {
    getTreeViewOptions() {
      this.$http.post("base/tree/getTreeViewOptions", { name: this.fromFile }).then(response => {
        this.treeViewOptions = response.data;
        this.primaryKey = this.treeViewOptions.primary_key || "id"
        this.parentKey = this.treeViewOptions.parent_key || "parent"
        this.valueKey = this.treeViewOptions.parent_key || "name"

        this.getData();
      });
    },
    getData() {
      let params = {
        name: this.fromFile
      }
      if(this.treeViewOptions.query.where){
        params.where = Object.assign({}, this.treeViewOptions.query.where);
      }
      this.$http.post("base/tree/getData", params).then(response => {
        this.myItems = {
          id: "-1",
          name: "All",
          children: this.getHierarchy(response.data.data)
        };
      });
    },
    getHierarchy(items) {
      let roots = []
      let all = {}
      let primaryKey = this.primaryKey
      let parentKey = this.parentKey

      if(items.length > 0){
        if(items[0].hasOwnProperty(parentKey)){
          items.forEach(function(item) {
            all[item[primaryKey]] = item
          })
          Object.keys(all).forEach(function (id) {
            let item = all[id]
            if (item[parentKey] === "-1") {
              roots.push(item)
            } else if (item[parentKey] in all) {
              let p = all[item[parentKey]]
              if (!("children" in p)) {
                p["children"] = []
              }
              p["children"].push(item)
            }
          })
        }else{
          items.forEach(function(item) {
            roots.push(item)
          })
        }
      }
      return roots
    },
    toggle() {
      if (this.isFolder) {
        this.open = !this.open
      }
    },
    onSelect(item) {
      this.mySelectedId = item.id
      if(this.selectMe) this.selectMe(item)

      let id = [];
      this.getId(item, id);
      if(this.selectedkeyArray) this.selectedkeyArray(id)
      if(this.modelIsRecursive){
        this.$emit("input", id)
      }else{
        this.$emit("input", this.mySelectedId)
      }
    },
    getId(item, itemArray){
      itemArray.push(item.id)
      if(item.children){
        item.children.forEach((item2)=>{
          this.getId(item2, itemArray)
        })
      }
      return itemArray
    }
  },
  watch : {
    selectedId: {
      handler() {
        this.mySelectedId = this.selectedId
      },
      deep: true
    }
  }
};
</script>

<style lang="css">
.item {
  text-transform: uppercase;
  padding-top: 8px;
  font-size: 11px;
}
.selected {
  padding: 3px;
  font-weight: bold;
  color: #FFFFFF;
  background: #205E9D !important;
}
</style>

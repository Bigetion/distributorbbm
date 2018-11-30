<template>
  <div></div>
</template>

<script>
export default {
  props: {
    value:{},
    extraQueryOptions: {},
    fromFile: {
      type: String,
      required: true
    },
    isRefresh: {}
  },
  data() {
    return {
      data: [],
      queryOptionsLoaded: false
    };
  },
  methods: {
    getQueryServiceOptions() {
      this.$http.post("base/service/getQueryServiceOptions", { name: this.fromFile }).then(response => {
        this.queryServiceOptions = response.data;
        this.getData();
      });
    },
    getData() {
      this.selectedRow = [];
      let params = {
        name: this.fromFile
      };

      if (this.extraQueryOptions) {
        params.where = this.extraQueryOptions;
      }

      this.$http.post("base/service/getData", params).then(response => {
        this.data = response.data.data;
        this.$emit('input', this.data);
      });
    }
  },
  created() {
    this.getData();
  },
  watch: {
    extraQueryOptions: {
      handler() {
        this.getData();
      },
      deep: true
    },
    isRefresh: {
      handler() {
        this.getData();
      },
      deep: true
    }
  },
  computed: {}
};
</script>

<style lang="css">
</style>

<template>
  <div :class="{'select-error': errorMessages.length>0, 'select-null': (selected==null), 'multiple': (multiple && selected.length > 0), 'input-select': true}">
    <div v-if="!multiple" class="multiselect__label">{{ (selected!=null) ? placeholder: ''}}</div>
    <div v-if="multiple" class="multiselect__label">{{ (selected.length > 0) ? placeholder: ''}}</div>
    <multiselect
      v-if="multiple"
      v-model="selected"
      :options="data"
      :track-by="trackBy || selectViewOptions.track_by"
      :label="label || selectViewOptions.label"
      :searchable="searchable"
      :multiple="true" 
      select-label="" deselect-label="" 
      :close-on-select="true" :hide-selected="true" :preserve-search="true"
      :placeholder="placeholder"
      :disabled="disabled"
      @search-change="asyncFind"
      >
    </multiselect>
    <multiselect
      v-else
      v-model="selected"
      :options="data"
      :track-by="trackBy || selectViewOptions.track_by"
      :label="label || selectViewOptions.label"
      :searchable="searchable"
      :multiple="false" 
      select-label="" deselect-label="" 
      :close-on-select="true" :hide-selected="false" :preserve-search="true"
      :placeholder="placeholder"
      :disabled="disabled"
      @search-change="asyncFind"
      >
    </multiselect>
    <div class="mb-4" v-show="errorMessages.length == 0"></div>
    <div class="input-group input-group__details" v-show="errorMessages.length>0">
      <div class="input-group__error">{{errorMessages[0]}}</div>
    </div>
  </div>
</template>

<script>
import _ from "lodash";
import { setTimeout } from "timers";
export default {
  props: {
    extraQueryOptions: {},
    value: {
      required: true
    },
    placeholder: {
      type: String
    },
    multiple: {
      type: Boolean
    },
    searchable: {
      type: Boolean
    },
    fromFile: {
      type: String
    },
    isRefresh: {},
    disabled: {
      type: Boolean,
      default: function() {
        return false;
      }
    },
    options: {
      type: Array
    },
    label: {
      type: String
    },
    trackBy: {
      type: String
    },
    onSelected: {},
    limitable: {},
    errorMessages: {
      type: Array,
      default: function() {
        return [];
      }
    }
  },
  data() {
    return {
      search: "",
      selected: "",
      data: [],
      selectViewOptions: {},
      loading: false
    };
  },
  created() {
    this.selected = this.multiple ? [] : null;
    if (this.fromFile) {
      this.getSelectViewOptions();
    } else {
      this.getData();
    }
  },
  methods: {
    asyncFind(q) {
      if (!q) q = "";
      if (this.limitable) {
        this.onSearch(q);
      }
    },
    getSelectViewOptions() {
      this.loading = true;
      this.$http
        .post("base/select/getSelectViewOptions", { name: this.fromFile })
        .then(response => {
          this.selectViewOptions = response.data;
          this.getData();
        });
    },
    getData() {
      if (this.fromFile) {
        this.selectedRow = {};
        let params = {
          name: this.fromFile
        };
        if (this.selectViewOptions.query.where) {
          params.where = Object.assign({}, this.selectViewOptions.query.where);
        }
        if (this.extraQueryOptions) {
          if (!params.where) params.where = {};
          params.where = Object.assign(params.where, this.extraQueryOptions);
        }
        if (this.limitable) {
          if (!params.where) params.where = {};
          params.where = Object.assign(params.where, {
            LIMIT: [0, 20]
          });
        }
        this.$http.post("base/select/getData", params).then(response => {
          this.data = response.data.data;
          setTimeout(() => {
            if (this.multiple) {
              this.selected = _.filter(this.data, o => {
                const index = _.findIndex(this.value, p => {
                  return p === o[this.selectViewOptions.value];
                });
                return index > -1;
              });
              if (this.limitable) {
                let limitableParams = {
                  name: this.fromFile
                };
                limitableParams.where = Object.assign(
                  {},
                  {
                    [`${this.label || this.selectViewOptions.label}`]: this.value
                  }
                );
                this.$http
                  .post("base/select/getData", limitableParams)
                  .then(response2 => {
                    if (response2.data.data) this.selected = response2.data.data;
                  });
              }
            } else {
              const selected = _.filter(this.data, o => {
                return this.value === o[this.selectViewOptions.value];
              });
              if (selected.length > 0) this.selected = selected[0];
            }
            if (!this.selected) this.selected = null;
            this.loading = false;
          }, 300);
        });
      } else {
        this.data = this.options;
        if (this.multiple) {
          this.selected = _.filter(this.data, o => {
            const index = _.findIndex(this.value, p => {
              return p === o[this.trackBy];
            });
            return index > -1;
          });
        } else {
          const selected = _.filter(this.data, o => {
            return this.value === o[this.selectViewOptions.value];
          });
          if (selected.length > 0) this.selected = selected[0];
        }
        if (!this.selected) this.selected = null;
        setTimeout(() => {
          this.loading = false;
        }, 300);
      }
    },
    onSearch(q) {
      let params = {
        name: this.fromFile
      };
      if (this.selectViewOptions.query.where) {
        params.where = Object.assign({}, this.selectViewOptions.query.where);
      }
      if (this.extraQueryOptions) {
        if (!params.where) params.where = {};
        params.where = Object.assign(params.where, this.extraQueryOptions);
      }
      if (this.limitable) {
        if (!params.where) params.where = {};
        params.where = Object.assign(params.where, {
          [`${this.label || this.selectViewOptions.label}[~]`]: q,
          LIMIT: [0, 20]
        });
      }
      this.$http.post("base/select/getData", params).then(response => {
        this.data = response.data.data;
      });
    }
  },
  watch: {
    value: {
      handler() {
        if (this.multiple) {
          this.selected = _.filter(this.data, o => {
            const index = _.findIndex(this.value, p => {
              return p === o[this.trackBy];
            });
            return index > -1;
          });
        } else {
          const selected = _.filter(this.data, o => {
            return this.value === o[this.selectViewOptions.value];
          });
          if (selected.length > 0) this.selected = selected[0];
        }
        if (this.onSelected) this.onSelected(this.selected);
      },
      deep: true
    },
    selected: {
      handler() {
        if (!this.loading) {
          if (this.multiple) {
            let value = [];
            this.selected.forEach(item => {
              value.push(item[this.trackBy || this.selectViewOptions.value]);
            });
            this.$emit("input", value);
          } else {
            if (this.selected)
              this.$emit(
                "input",
                this.selected[this.trackBy || this.selectViewOptions.value]
              );
            else this.$emit("input", this.selected);
          }
          if (this.onSelected) this.onSelected(this.selected);
        }
      },
      deep: true
    },
    isRefresh: {
      handler() {
        this.loading = true;
        this.getData();
      },
      deep: true
    },
    extraQueryOptions: {
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
.input-select {
  margin-top: 5px;
}

.input-select .multiselect__tags {
  border: none;
  border-radius: 0;
  border-bottom: 1px solid #707070;
  padding: 8px 40px 0 0px;
}

.input-select .multiselect__input,
.input-select .multiselect__single {
  font-size: 17px !important;
  margin-left: -10px;
}

.select-error .multiselect__tags {
  border-bottom: 1px solid #ff5252;
}

.select-error ::placeholder,
.select-error .multiselect__single {
  color: #ff5252 !important;
}

::placeholder,
.select-null ::placeholder,
.select-null .multiselect__single {
  color: rgba(0, 0, 0, 0.5);
}

.multiselect__label {
  font-size: 13px;
  color: rgba(0, 0, 0, 0.5);
}

.multiselect__input,
.multiselect__single {
  margin-left: -6px !important;
}

.multiple .multiselect__single {
  display: none !important;
}
</style>

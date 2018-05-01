<template>
  <div class="date-range-picker">
    <div :style="{float: 'left', marginRight: '10px'}" >
      <datepicker :label="fromLabel" v-model="value.from" :format="format" :value-format="valueFormat"></datepicker>
    </div>
    <div :style="{float: 'left'}" >
      <datepicker :label="toLabel" v-model="value.to" :format="format" :value-format="valueFormat"></datepicker>
    </div>
    <div :style="{clear: 'both'}"></div>
  </div>
</template>

<script>
import _ from "lodash";
export default {
  props: {
    value: {
      required: true,
      default: function() {
        return {
          from: new Date(),
          to: new Date()
        };
      }
    },
    fromLabel: {
      type: String,
      default: function() {
        return "From";
      }
    },
    toLabel: {
      type: String,
      default: function() {
        return "To";
      }
    },
    format: {
      type: String,
      default: function() {
        return "YYYY-MM-DD";
      }
    },
    valueFormat: {
      type: String,
      default: function() {
        return "DD/MM/YYYY";
      }
    }
  },
  data() {
    return {};
  },
  methods: {},
  created() {},
  watch: {
    value: {
      handler() {
        this.$emit("input", this.value);
      },
      deep: true
    }
  },
  computed: {}
};
</script>

<style lang="css">
.date-range-picker {
  max-width: 500px !important;
}
</style>

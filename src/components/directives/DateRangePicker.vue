<template>
  <div class="drp">
    <div :style="{float: 'left', marginRight: '10px'}" >
      <span :style="{margin: '5px 5px 0 5px', fontSize: '10px'}">{{fromLabel}}</span>
      <datepicker v-model="value.from" :format="format"></datepicker>
    </div>
    <div :style="{float: 'left'}" >
      <span :style="{margin: '5px 5px 0 5px', fontSize: '10px'}">{{toLabel}}</span>
      <datepicker v-model="value.to" :format="format"></datepicker>
    </div>
    <div :style="{clear: 'both'}"></div>
  </div>
</template>

<script>
import _ from 'lodash';
export default {
  props: {
    value: {
      required: true,
      default: function () { 
        return {
          from: new Date(),
          to: new Date()
        } 
      }
    },
    fromLabel: {
      type: String,
      default: function () { 
        return "From"
      }
    },
    toLabel: {
      type: String,
      default: function () { 
        return "To"
      }
    },
    format: {
      type: String,
      default: function () { 
        return "d MMMM yyyy"
      }
    }
  },
  data() {
    return {
      
    };
  },
  methods: {
    
  },
  created() {

  },
  watch: {
    value: {
      handler() {
        this.$emit('input', this.value)
      },
      deep: true
    }
  },
  computed: {

  }
};
</script>

<style lang="css">
  .drp .vdp-datepicker input {
    padding: 5px;
    border-bottom: 2px solid #707070;
    cursor: pointer;
    margin-bottom: 2px;
    font-weight: bold;
  }
</style>

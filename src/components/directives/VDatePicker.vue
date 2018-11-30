<template>
  <div :class="{'mt-2': true, 'mb-4': true, 'v-datepicker': true, 'v-datepicker-error': errorMessages.length>0}">
    <div class="caption v-datepicker-label">{{value==''?'': label||'Select date'}}</div>
    <vue-datepicker
      v-show="!range"
      :placeholder="label"
      v-model="mvalue"
      :format="format"
      lang="en"
    ></vue-datepicker>
    <vue-datepicker
      v-show="range"
      :placeholder="label"
      v-model="mvalue"
      range
      :range-separator="rangeSeparator"
      :format="format"
      lang="en"
    ></vue-datepicker>
    <div class="input-group input-group__details" v-show="errorMessages.length>0">
      <div class="input-group__error">{{errorMessages[0]}}</div>
    </div>
  </div>
</template>

<script>
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
    label: {
      type: String,
      default: function() {
        return "Select Date";
      }
    },
    range: {
      type: Boolean
    },
    rangeSeparator: {
      type: String,
      default: function() {
        return " - "
      }
    },
    format: {
      type: String,
      default: function() {
        return "dd/MM/yyyy";
      }
    },
    errorMessages: {
      type: Array,
      default: function() {
        return [];
      }
    }
  },
  data() {
    return {
      mvalue: this.value
    };
  },
  methods: {},
  created() {
    if (!this.range) {
      if(Array.isArray(this.value)) this.mvalue = this.value[0];
    }
  },
  watch: {
    mvalue: {
      handler() {
        this.$emit("input", this.mvalue);
      },
      deep: true
    },
    range: {
      handler() {
        if (!this.range) this.mvalue = this.value[0];
        else {
          this.mvalue = [this.value, this.value];
        }
      },
      deep: true
    }
  },
  computed: {}
};
</script>

<style lang="css">
.v-datepicker {
  margin-top: 15px !important;
  position: relative !important;
}
.v-datepicker .mx-input {
  font-family: 'Roboto', sans-serif !important;
  padding: 10px 30px 6px 0px !important;
}
.v-datepicker-error ::placeholder {
  color: #ff5252;
}
.v-datepicker-label {
  color: rgba(0, 0, 0, 0.6) !important;
  position: absolute;
  top: 0;
  z-index: 2 !important;
  margin-top: -12px !important;
}
.mx-datepicker-popup {
  font-family: 'Roboto', sans-serif !important;
}
.mx-datepicker-top {
  display: none !important;
}
</style>

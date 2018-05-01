<template>
  <v-layout row wrap>
    <v-flex>
      <v-menu
        offset-y
        full-width
        max-width="290px"
        :z-index="zIndex"
      >
        <v-text-field
          slot="activator"
          :label="label"
          :value="dateValue"
          :error-messages="errorMessages"
          :disabled="disabled"
          readonly
        ></v-text-field>
        <v-date-picker class="m-datepicker" v-model="date" no-title scrollable></v-date-picker>
      </v-menu>
    </v-flex>
  </v-layout>
</template>

<script>
import moment from "moment";
export default {
  props: {
    value: {
      required: true
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
    },
    label: {
      type: String,
      default: function() {
        return "Picker date";
      }
    },
    errorMessages: {
      type: Array,
      default: function() {
        return [];
      }
    },
    disabled: {},
    zIndex: {
      default: function() {
        return 6;
      }
    },
  },
  data() {
    return {
      date: "",
      dateValue: ""
    };
  },
  methods: {},
  created() {
    if(this.value!="") this.date = moment(this.value);
  },
  watch: {
    value: {
      handler() {
        this.date = moment(this.value);
      },
      deep: true
    },
    date: {
      handler() {
        this.$emit("input", moment(this.date).format(this.format));
        this.dateValue = moment(this.date).format(this.valueFormat);
      },
      deep: true
    }
  },
  computed: {}
};
</script>

<style lang="css">
.m-datepicker .btn__content {
  font-size: 12px !important;
}
</style>

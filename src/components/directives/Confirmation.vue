<template>
  <v-layout justify-center class="modal-content">
    <v-card class="white confirmation-content">
      <v-card-title>
        <div class="headline">Confirmation</div>
      </v-card-title>
      <v-card-text>{{message}}</v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn class="green--text darken-1" flat="flat" @click="ok">OK</v-btn>
        <v-btn class="red--text darken-1" flat="flat" @click="cancel">Cancel</v-btn>
      </v-card-actions>
    </v-card>
  </v-layout>
</template>

<script>
export default {
  props: ['message'],
  data() {
    return {}
  },
  methods: {
    ok: function() {
      this.$vuedals.close(true)
    },
    cancel: function() {
      this.$vuedals.close(false)
    }
  }
}
</script>

<style lang="css">
.confirmation-modal {
  top: 40%;
  margin: 0 auto;
  background-color: #ffffff
}
.confirmation-content {
  width: 300px;
}

</style>

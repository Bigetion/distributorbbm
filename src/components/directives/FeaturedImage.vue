<template>
  <v-layout transition="dialog-bottom-transition">
    <v-flex xs12 class="white">
      <v-toolbar>
        <v-toolbar-title>Featured Image</v-toolbar-title>
        <!-- <v-btn @click.native="chooseImage" dark>
          Add new image
        </v-btn> -->
        <v-spacer></v-spacer>
        <v-btn icon @click.native="cancelFn()" dark>
          <v-icon>close</v-icon>
        </v-btn>
      </v-toolbar>
      <v-container fluid grid-list-md class="featured-image-container">
        <v-layout row wrap>
          <v-flex xs12 sm12 md12>
            <v-layout row wrap>
              <v-flex
                xs12 sm4 md3
                v-for="img in imageList"
                :key="img"
              >
                <v-card flat tile v-bind:class="{ 'featured-image-selected': img == selectedImage }">
                  <p class="text-lg-right featured-image-checked" v-if=" img == selectedImage">
                    <v-icon>check_circle</v-icon>
                  </p>
                  <v-card-media
                    :src="baseUrl + 'thumbs/' + img"
                    height="150px"
                    @click="setImage(img)"
                  >
                  <v-btn flat error :style="{marginLeft:'5px', marginBottom:'25px'}" absolute bottom fab small @click.native.stop="deleteClick(img)">
                    <v-icon>delete</v-icon>
                  </v-btn>
                  </v-card-media>
                </v-card>
              </v-flex>
              <v-flex xs12 sm4 md3>
                <image-uploader @input="handleFileUpload" :value="src"></image-uploader>
              </v-flex>
            </v-layout>
          </v-flex>
          <!-- <v-flex xs12 sm6 md4>
            <image-uploader @input="handleFileUpload" :value="src"></image-uploader>
          </v-flex> -->
        </v-layout>
        <v-card class="featured-image-bottom-panel" v-if="selectedImage">
          <v-btn primary @click="okFn">Set Featured Image</v-btn>
        </v-card>
      </v-container>
    </v-flex>
  </v-layout>
</template>

<script>
import { confirm } from './../../utils/modal'
export default {
  data() {
    return {
      baseUrl: process.env.API_URL + "image/get/featured/",
      dialog: true,
      src: null,
      selectedImage: null,
      imageList: []
    };
  },
  methods: {
    getData() {
      this.$http.post("image/getAll", { path: "featured" }).then(response => {
        this.imageList = response.data.images;
      });
    },
    setImage(img) {
      this.selectedImage = img;
    },
    handleFileUpload(file) {
      let form = new FormData();
      form.append("image", file);
      this.$http.post("image/uploadImage", form).then(response => {
        this.src = null;
        file = null;
        this.getData();
      });
    },
    deleteClick(img) {
      confirm(this, {
        message: 'Are you sure you want to delete?'
      }).then(()=> {
        this.$http.post("image/deleteImage", {
          path: "featured",
          img: img
        }).then(response => {
          this.getData();
        });
      })
    },
    okFn() {
      this.$emit("$ok", this.$el, this.selectedImage);
    },
    cancelFn() {
      this.$emit("$cancel", this.$el, null);
    }
  },
  mounted() {
    this.getData();
  }
};
</script>

<style>
.featured-image-container {
  height: 100%;
  overflow: auto;
  padding-bottom: 150px !important;
}
.featured-image-checked {
  position: absolute;
  z-index: 20;
  top: 5px;
  right: 5px;
  color: #519edb;
}
.featured-image-selected {
  border: 1px solid white;
  outline: 3px solid #519edb;
}
.featured-image-bottom-panel {
  width: 100%;
  position: absolute;
  bottom: 0;
  left: 0;
  padding: 10px;
}
</style>

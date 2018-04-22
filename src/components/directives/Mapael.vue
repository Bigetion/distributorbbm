<template>
  <div class="container mapael-content">
    <div class="map"></div>
  </div>
</template>

<script>
require("./../../utils/maps/indonesia.js");
require("jquery-mapael");

import _ from 'lodash'
import { indonesia } from './../../utils/maps/details'
export default {
  props: {
    onSelect: {}
  },
  data() {
    return {
      selectedCode: [],
      selected: [],
      details: []
    };
  },
  created() {
    this.details = indonesia();
    window.eventBus.$on("onClickMapael", (id) => {
      let index = this.selectedCode.indexOf(id)
      if(index == -1) {
        this.selectedCode.push(id)
      }else{
        this.selectedCode.splice(index, 1)
      }

      index = _.findIndex(this.selected, {code: id})
      const item = _.filter(this.details, {code: id})
      if(index == -1) {
        if(item.length > 0) this.selected.push(item[0])
      }else{
        this.selected.splice(index, 1)
      }

      if(this.onSelect) this.onSelect(this.selected)
    });
  },
  mounted() {
    this.getMapael();
  },
  methods: {
    getMapael() {
      $(".container").mapael({
        map: {
          name: "indonesia",
          zoom: {
            enabled: true
          },
          defaultPlot: {
            attrs: {
              fill: "#004a9b",
              opacity: 0.6
            },
            attrsHover: {
              opacity: 1
            },
            text: {
              attrs: {
                fill: "#505444"
              },
              attrsHover: {
                fill: "#000"
              }
            }
          },
          defaultArea: {
            attrs: {
              fill: "#D9D9DC",
              stroke: "#242424"
            },
            attrsHover: {
              fill: "#3D55C0"
            },
            text: {
              attrs: {
                fill: "#505444"
              },
              attrsHover: {
                fill: "#000"
              }
            },
            eventHandlers: {
              click(e, id, mapElem, textElem) {
                var newData = {
                  areas: {}
                };
                if (mapElem.originalAttrs.fill == "#3D55C0") {
                  newData.areas[id] = {
                    attrs: {
                      fill: "#D9D9DC"
                    }
                  };
                } else {
                  newData.areas[id] = {
                    attrs: {
                      fill: "#3D55C0"
                    }
                  };
                }
                window.eventBus.$emit("onClickMapael", id);
                $(".container").trigger("update", [{ mapOptions: newData }]);
              }
            }
          }
        },
        areas: {}
      });
    }
  }
};
</script>

<style>
.mapael .map {
  position: relative;
  padding: 10px;
  border: 1px dashed dimgray;
}
/* For all zoom buttons */
.mapael .zoomButton {
  background-color: #fff;
  border: 1px solid #ccc;
  color: #000;
  width: 15px;
  height: 15px;
  line-height: 15px;
  text-align: center;
  border-radius: 3px;
  cursor: pointer;
  position: absolute;
  top: 0;
  font-weight: bold;
  left: 10px;
  -webkit-user-select: none;
  -khtml-user-select: none;
  -moz-user-select: none;
  -o-user-select: none;
  user-select: none;
}
/* Reset Zoom button first */
.mapael .zoomReset {
  top: 10px;
}
/* Then Zoom In button */
.mapael .zoomIn {
  top: 30px;
}
/* Then Zoom Out button */
.mapael .zoomOut {
  top: 50px;
}
.mapael .mapTooltip {
  position: absolute;
  background-color: #474c4b;
  opacity: 0.7;
  filter: alpha(opacity=70);
  border-radius: 10px;
  padding: 10px;
  z-index: 1000;
  max-width: 200px;
  display: none;
  color: #fff;
}
</style>

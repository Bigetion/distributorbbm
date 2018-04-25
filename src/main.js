import Vue from 'vue'
import Router from 'vue-router'
import Resource from 'vue-resource'
import App from './App'
import VeeValidate from 'vee-validate'
import VueHotkey from 'v-hotkey'
import {default as Vuedals, Component as Vuedal, Bus as VuedalsBus} from 'vuedals';

import ElementUI from 'element-ui'

require('assets/css/grid.css')

// Require Froala Editor js file.
require('froala-editor/js/froala_editor.pkgd.min')

// Require Froala Editor css files.
require('froala-editor/css/froala_editor.pkgd.min.css')
require('font-awesome/css/font-awesome.css')
require('froala-editor/css/froala_style.min.css')

require('assets/js/pdfmake.min.js')
require('assets/js/vfs_fonts.js')

// Import and use Vue Froala lib.
import VueFroala from 'vue-froala-wysiwyg'

import 'vue-croppa/dist/vue-croppa.css'
import Croppa from 'vue-croppa'

import PictureInput from 'vue-picture-input'

import 'vue-multiselect/dist/vue-multiselect.min.css'
import 'element-ui/lib/theme-chalk/index.css'

import './stylus/main.styl'
import Vuetify from 'vuetify'

import Modal from 'vuejs-modal'
import Multiselect from 'vue-multiselect'
import Toasted from 'vue-toasted'
import VueDatePicker from 'vue2-datepicker'

// Import components
import Datepicker from './components/directives/Datepicker.vue'
import VDatepicker from './components/directives/VDatepicker.vue'
import Mapael from './components/directives/Mapael.vue'
import Histats from './components/directives/Histats.vue'
import VQueryService from './components/directives/QueryService.vue'
import VTreeView from './components/directives/TreeView.vue'
import VSelectView from './components/directives/SelectView.vue'
import VTableView from './components/directives/TableView.vue'
import VDateRangePicker from './components/directives/DateRangePicker.vue'
import ImageUploader from './components/directives/ImageUploader.vue'

import froala from './utils/froala'
import auth from './utils/auth'
import router from './router'

auth.checkAuth()

Vue.use(Vuetify)
Vue.use(ElementUI)
Vue.use(VeeValidate)
Vue.use(Resource)
Vue.use(Router)
Vue.use(VueHotkey)
Vue.use(Vuedals)
Vue.use(VueFroala)
Vue.use(Croppa)
Vue.use(Toasted)
Vue.component('mapael', Mapael)
Vue.component('histats', Histats)
Vue.component('datepicker', Datepicker)
Vue.component('vue-datepicker', VueDatePicker)
Vue.component('vdatepicker', VDatepicker)
Vue.component('image-uploader', ImageUploader)
Vue.component('query-service', VQueryService)
Vue.component('tree-view', VTreeView)
Vue.component('select-view', VSelectView)
Vue.component('table-view', VTableView)
Vue.component('daterangepicker', VDateRangePicker)
Vue.component('multiselect', Multiselect)
Vue.component('vuedal', Vuedal)
Vue.component('picture-input', PictureInput)

Vue.http.options.root = process.env.API_URL
Vue.http.headers.common['Accept'] = 'application/json'

window._ = require('lodash')
if (localStorage.getItem('token')) {
  Vue.http.headers.common['Authorization'] = 'Bearer ' + localStorage.getItem('token')

  froala.config.requestHeaders = {
    'Authorization': 'Bearer ' + localStorage.getItem('token')
  }
}

window.eventBus = new Vue({})
//Build app into #app div
const app = new Vue({
  router,
  render: (h) => h(App)
}).$mount('#app')

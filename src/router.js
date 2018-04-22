import Router from 'vue-router'
import auth from './utils/auth'

import Login from './components/pages/Login.vue'
import Beranda from './components/pages/Beranda.vue'
import Profile from './components/pages/Profile.vue'
import Pengaturan from './components/pages/Pengaturan.vue'
import Pembelian from './components/pages/Pembelian.vue'
import Customer from './components/pages/Customer.vue'
import Penjualan from './components/pages/Penjualan.vue'
import RekapData from './components/pages/RekapData.vue'
import Gudang from './components/pages/Gudang.vue'

let router = new Router({
  mode: 'history',
  routes: [{
    path: '/',
    name: 'beranda',
    component: Beranda,
    meta: {
      requiresAuth: true
    }
  },{
    path: '/login',
    name: 'login',
    component: Login,
    meta: {
      checksAuth: true
    }
  },{
    path: '/profile',
    name: 'profile',
    component: Profile,
    meta: {
      requiresAuth: true
    }
  },{
    path: '/pengaturan',
    name: 'pengaturan',
    component: Pengaturan,
    meta: {
      requiresAuth: true
    }
  },{
    path: '/pembelian',
    name: 'pembelian',
    component: Pembelian,
    meta: {
      requiresAuth: true
    }
  },{
    path: '/customer',
    name: 'customer',
    component: Customer,
    meta: {
      requiresAuth: true
    }
  },{
    path: '/penjualan',
    name: 'penjualan',
    component: Penjualan,
    meta: {
      requiresAuth: true
    }
  },{
    path: '/rekap-data',
    name: 'rekapData',
    component: RekapData,
    meta: {
      requiresAuth: true
    }
  },{
    path: '/gudang',
    name: 'gudang',
    component: Gudang,
    meta: {
      requiresAuth: true
    }
  }]
})

router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (!auth.user.authenticated) {
      next({
        path: '/login',
        query: {
          redirect: to.fullPath
        }
      })
    } else {
      next()
    }
  }

  if (to.matched.some(record => record.meta.checksAuth)) {
    if (auth.user.authenticated) {
      next({
        path: '/',
        query: {
          redirect: to.fullPath
        }
      })
    } else {
      next()
    }
  } else {
    next()
  }
})

export default router;

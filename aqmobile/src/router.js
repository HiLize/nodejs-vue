import Vue from 'vue'
import Router from 'vue-router'
import index from './pages/index.vue'
import aqform from './pages/aqform.vue'
import score from './pages/score.vue'
import newrank from './pages/newrank.vue'
import currentaq from './pages/currentaq.vue'


Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      name: 'index',
      component: index
    },
    {
      path: '/aqform',
      name: 'aqform',
      component: aqform
    },
    {
      path: '/score',
      name: 'score',
      component: score
    },
    {
      path: '/newrank',
      name: 'newrank',
      component: newrank
    },
    {
      path: '/currentaq',
      name: 'currentaq',
      component: currentaq
    },
  ]
})

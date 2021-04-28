import Vue from 'vue'
import Router from 'vue-router'
import Datapoint from '@/components/Datapoint'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Datapoint',
      component: Datapoint
    }
  ]
})

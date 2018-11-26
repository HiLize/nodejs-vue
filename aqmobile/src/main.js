// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './vuex/store'
import {ToastPlugin} from 'vux'

Vue.use(ToastPlugin);
import {init} from 'bh-mobile-sdk'


if (process.env.NODE_ENV !== 'production') {
}
Vue.config.productionTip = false;

// router.beforeEach(function (to, from, next) {
//   store.commit('sysconfig/SET_LOADING_STATE', true);
//   next()
// });
//
// router.afterEach(function (to) {
//   store.commit('sysconfig/SET_LOADING_STATE', false);
// });

window.userInfo = null;
init(() => {
  window.BH_MOBILE_SDK.cpdaily.getUserInfo(res => {
    window.userInfo = res;
    console.log('*********userinfo*************')
    console.log(res)
    if (process.env.NODE_ENV !== 'production') {
      // window.userInfo = {
      //   studentNo: '88888891',
      //   name: '测试人员4',
      //   collegeId: '10000',
      //   academy: '计算机学院',
      // };
    }
    console.log(JSON.stringify(res));
    new Vue({
      el: '#app',
      router,
      store,
      template: '<App/>',
      components: {App}
    });
  });
  const FastClick = require('fastclick');
  FastClick.attach(document.body);
});

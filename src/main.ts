import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
// @ts-ignore

import BootstrapVue from 'bootstrap-vue';

Vue.use(BootstrapVue);

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app');

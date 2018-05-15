import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import "bootstrap/dist/css/bootstrap.min.css";
import api from "./api"
Vue.config.productionTip = false;


api.auth().onAuthStateChanged(user => {
  new Vue({
    router,
    render: h => h(App)
  }).$mount("#app");

  
});


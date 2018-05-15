import Vue from "vue";
import Router from "vue-router";
import Home from "./views/Home.vue";
import About from "./views/About.vue";
import Signup from "./components/Signup.vue";
import Admin from "./components/Admin.vue";
import api from "./api"
Vue.use(Router);

let router = new Router({
  mode: "history",
  routes: [
    {
      path: "/",
      name: "home",
      component: Admin,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: "/about",
      name: "about",
      component: About
    },
    {
      path: "/signup",
      name: "Signup",
      component: Signup
    },
  ]
});

router.beforeEach((to, from,next)=> {
  let currentUser = api.auth().currentUser;
  let requiresAuth = to.matched.some(record => record.meta.requiresAuth)

  if (requiresAuth && !currentUser) next('signup')
  else if (!requiresAuth && currentUser) next('')
  else next()

})
export default router
<template>
    <div class="container">
        <div  v-if="authUser">
            <div class="row">
                <div class="col-md">
                    <h2>Sesión iniciada como {{ authUser.email }}</h2>         
                </div>
            </div>
            <div class="row">
                <div class="col-md">
                    <button @click="signOut" class="btn btn-primary">Sign out</button>
                </div>
            </div>
        </div>
        <div v-else>
            <div class="row">
                <div class="col-md">
                    <h1>ReportX</h1>
                </div>
            </div>
            <div class="row">
                <div class="col-md">
                    <div class="row">
                        <div class="col-md">
                            <h2>Únirme ahora a ReportX</h2>
                        </div>
                    </div>
                    <div class="row">
                        <dir class="col-md">
                            <form @submit.prevent="register" class="form-action">
                                <input type="submit" value="Registrarme usando Google" class="btn btn-primary">
                                <div>o</div>
                                <div>Regístrate usando correo:</div>
                                <input type="text" class="form-control" placeholder="Nombre completo" >
                                <input type="text" class="form-control" v-model="email" placeholder="Correo" required>
                                <input type="password" class="form-control" v-model="password" placeholder="Contraseña" required>
                                <input type="text" class="form-control" placeholder="Confirmar contraseña">
                                <input type="submit" value="Regístrate" class="btn btn-primary">
                            </form>
                        </dir>
                    </div>
                </div>
            <!-- </div> -->
            <!-- <div class="row"> -->
                <div class="col-md">
                    <h3>Iniciar sesión</h3>
                    <form @submit.prevent="signIn" class="form-action">
                        <input type="submit" value="Iniciar sesión usando Google" class="btn btn-primary">
                        <div>Iniciar sesión:</div>
                        <input type="text" class="form-control" v-model="email" placeholder="Correo" required>
                        <input type="password" class="form-control" v-model="password" placeholder="Contraseña" required>
                        <input type="submit" value="Iniciar sesión" class="btn btn-primary">
                    </form>
                </div>
            </div>
        </div>
    
    </div>
</template>

<script>
import api from "../api";
export default {
  name: "Signup",
  data() {
    return {
      email: "",
      password: "",
      authUser: null
    };
  },
  mounted: function() {},
  methods: {
    register() {
        api.auth().createUserWithEmailAndPassword(this.email, this.password);
    },
    signIn() {
        api.auth().signInWithEmailAndPassword(this.email,this.password);
    },
    signOut() {
        api.auth().signOut();
    }
  },
  created() {
    api.auth().onAuthStateChanged(user => {
      this.authUser = user;
    });
  }
};
</script>

<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>

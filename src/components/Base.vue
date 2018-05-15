<template>
    <div class="container">
        <div v-if="loadingPage">
            <div class="loadingPage">
                <h3>Cargando...</h3>
            </div>
        </div>
        <div  v-else>
            <div class="row" v-if="!proyect" >
                <div class="col-md">
                    <h2>Bienvenido a Reportx {{ authUser.displayName || authUser.email }}</h2>
                    <p>Primero ¿Cuál es el nombre de tú organización?</p>
                    <form @submit.prevent="createProyect" class="form-action">
                        <input type="text" class="form-control" v-model="proyectName"  placeholder="Organización fulana de tal" required>
                        <input type="submit" value="Guardar y continuar" class="btn btn-primary">
                    </form>
                </div>
            </div>
            <div class="row" v-else >
                <div class="col-md">
                    <div class="row">
                        <div class="col-md">
                            <h1>{{proyect.name}}</h1>
                    
                                

                        </div>
                    </div>
                    <router-link class="flexin" to="/">Reportes</router-link>
                    <router-link class="flexin" to="/usuarios">Administrar usuarios</router-link>
                    <router-link class="badge badge-success" to="">Administrar instalaciones</router-link>
                    <router-link class="flexin" to="">Configuración de la organización</router-link>
                </div>
            </div>
            <div class="row">
                <div class="col-md">
                    
                </div>
            </div>

            <div class="row">
                <div class="col-md">
                    <p><a href="#" class="btn btn-outline-danger" @click="signOut">Cerrar Sesión</a></p>
                </div>
            </div>
        </div>
    
    </div>
</template>

<script>
import api from "../api";
export default {
  name: "Base",
  data() {
    return {
      loadingPage: true,
      authUser: null,
      proyect: null,
      proyectName: "",
    };
  },
  methods: {
    signOut() {
      api.auth().signOut();
      this.$router.go();
    }
  },
  created() {
    api.auth().onAuthStateChanged(user => {
      this.authUser = user;
      if (user) {
        this.displayName = user.displayName;
        this.photoURL = user.photoURL;
        api
          .db("proyects")
          .child(user.uid)
          .once("value", snapshot => {
            this.loadingPage = false;
            if (snapshot.val()) {
              for (let key in snapshot.val()) {
                if (!this.proyect) {
                  this.proyect = snapshot.val()[key];
                }
              }
            }
          });
      }
    });
  }
};
</script>

<style scoped>

</style>

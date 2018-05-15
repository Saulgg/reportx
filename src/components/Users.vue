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
                    <router-link class="badge badge-success" to="">Administrar usuarios</router-link>
                    <router-link class="flexin" to="/instalaciones">Administrar instalaciones</router-link>
                    <router-link class="flexin" to="">Configuración de la organización</router-link>
                </div>
            </div>
            <div class="row">
                <div class="col-md">
                    <h2>Añadir usuario</h2>
                    <form @submit.prevent="addUser" class="form-action">
                        <div class="form-row">
                            <div class="col-md-11">
                                <input type="text" class="form-control" ref="email" v-model="userEmail" placeholder="E-mail" required>
                            </div>
                             <div class="col-md-1">
                                <input type="submit" value="Añadir" class="btn btn-primary">

                            </div>
                        </div>
                    </form>
                </div>
            </div>
            <div class="row">
                <div class="col-md" v-if="!usersCheck">
                    <h2>Aún no hay usuarios</h2>
                </div>
                <div class="col-md" v-else >
                    <div class="row" v-for="user in users" :key="user.key">
                        <div class="col-md">
                            <h4>{{user.email}}</h4>

                        </div>

                    </div>
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
  name: "Users",
  data() {
    return {
      loadingPage: true,
      usersCheck: false,
      email: "",
      password: "",
      displayName: null,
      userUID: null,
      photoURL: null,
      authUser: null,
      proyect: null,
      proyectName: "",
      userEmail: "",
      projectKey: "",
      users: []
    };
  },
  methods: {
    signOut() {
      api.auth().signOut();
      this.$router.go();
    },
    addUser() {
      this.usersCheck = true;
      api
        .db("proyects")
        .child(`/${this.authUser.uid}/users/`)
        .push({ email: this.userEmail });
      this.userEmail = "";
      this.$refs.email.focus();
    },
    fetchUsers() {}
  },
  created() {
    api.auth().onAuthStateChanged(user => {
      this.authUser = user;
      if (user) {
        this.displayName = user.displayName;
        this.photoURL = user.photoURL;
        this.userUID = user.uid;
        api
          .db("proyects")
          .child(`/${this.authUser.uid}/users/`)
          .on("child_added", snapshot => {
            this.usersCheck = true;
            this.users.push(snapshot.val());
          });
        api
          .db("proyects")
          .child(user.uid)
          .once("value", snapshot => {
            this.loadingPage = false;
            if (snapshot.val()) {
              for (let key in snapshot.val()) {
                if (!this.proyect) {
                  this.proyect = snapshot.val()[key];
                  this.proyectKey = key;
                }
              }
            }
          });
      }
    });
  },
  mounted() {
    this.fetchUsers();
  }
};
</script>

<style scoped>

</style>

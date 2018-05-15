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
                    <router-link class="badge badge-success" to="">Reportes</router-link>
                    <router-link class="flexin" to="/usuarios">Administrar usuarios</router-link>
                    <router-link class="flexin" to="/instalaciones">Administrar instalaciones</router-link>
                    <router-link class="flexin" to="">Configuración de la organización</router-link>
                </div>
            </div>
            <div class="row">
                <div class="col-md">
                    <router-link class="badge badge-primary" to="">Prioridad Inmediata</router-link>
                    <router-link class="flexin" to="">Prioridad Alta</router-link>
                    <router-link class="flexin" to="">Prioridad Media</router-link>
                    <router-link class="flexin" to="">Prioridad Baja</router-link>
                </div>
            </div>
            <div class="row" v-if="!ticketCheck">
                <div class="col-md">
                    <h3>¡Vaya! Parece que no hay tickets...</h3>
                    <p>Sí es la primera vez que entras recuerda agregar usuarios al proyecto en la pestaña de administrar usuarios.</p>
                </div>
            </div>
            <div class="row" v-else v-for="ticket in tickets" :key="ticket.key">
                <div class="col-md">
                    <div class="card">
                        <div class="card-body">
                            <div class="card-title">
                                <h3><div class="card-title">Ticket de: {{ticket.name}}</div></h3><hr>
                            </div>
                           <div class="card-text">
                               <p>Mensaje: {{ticket.message}}</p>
                               <p>Lugar: {{ticket.building}}-{{ticket.room}}</p>
                               <p class="alert alert-warning">Estado: {{ticket.working}}</p>
                               <p class="alert alert-danger">Prioridad: {{ticket.priority}}</p>
                            </div>
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
  name: "Admin",
  data() {
    return {
      loadingPage: true,
      ticketCheck: false,
      email: "",
      password: "",
      displayName: null,
      userUID: null,
      photoURL: null,
      authUser: null,
      proyect: null,
      proyectName: "",
      tickets: []
    };
  },
  mounted: function() {},
  methods: {
    signOut() {
      api.auth().signOut();
      this.$router.go();
    },
    createProyect() {
      api
        .db("proyects")
        .child(this.authUser.uid)
        .push({ name: this.proyectName })
        .then(this.$router.go());
    }
  },
  created() {
    api.auth().onAuthStateChanged(user => {
      this.authUser = user;
      if (user) {
        this.displayName = user.displayName;
        this.photoURL = user.photoURL;
        api.db("proyects")
        .child(`${user.uid}/tickets/`)
        .on("child_added", snapshot=> {
            this.tickets.push(snapshot.val());
            if(snapshot.val()){
                this.ticketCheck = true
            }
            
        })
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
  }
};
</script>

<style scoped>

</style>

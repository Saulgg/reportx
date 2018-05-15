<template>
    <div class="container">
        <div v-if="loading">
            <div class="loading">
                <h3>Cargando...</h3>
            </div>
        </div>
        <div  v-else>
            <div class="row" v-if="!proyect" >
                <div class="col-md">
                    <h2>Bienvenido a Reportx {{ authUser.displayName }}</h2>
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
                    <router-link class="flexin" to="">Reportes</router-link>
                    <router-link class="flexin" to="">Administrar usuarios</router-link>
                    <router-link class="flexin" to="">Administrar instalaciones</router-link>
                    <router-link class="flexin" to="">Configuración de la organización</router-link>
                </div>
            </div>
            <div class="row">
                <div class="col-md">
                    <p><a href="#" @click="signOut">Cerrar Sesión</a></p>
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
        loading: true,
        email: "",
        password: "",
        displayName: null,
        userUID: null,
        photoURL: null,
        authUser: null,
        proyect: null,
        proyectName: ''
      
    };
  },
  mounted: function() {},
  methods: {
    signOut() {
        api.auth().signOut();
        this.$router.go()
    },
    createProyect() {
        api.db('proyects').child(this.authUser.uid).push({name: this.proyectName}).then(this.$router.go())
    }
  },
  created() {
    api.auth().onAuthStateChanged(user => {
      this.authUser = user;
      if (user) {
            this.displayName = user.displayName;
            this.photoURL = user.photoURL;
            api.db('proyects').child(user.uid).once('value', snapshot => {
                this.loading=false;
                if (snapshot.val()){
                    for (let key in snapshot.val()){
                        this.proyect = snapshot.val()[key]
                        console.log(snapshot.val()[key])
                    }
                    
                    
                }
            })
      }
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

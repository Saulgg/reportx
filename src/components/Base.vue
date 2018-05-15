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
                    <h2>Instalaciones</h2>
                </div>
            </div>
            <div class="row">
                <div class="col-md">
                    <form @submit.prevent="addBuilding" class="form-action">
                        <div class="form-row">
                            <div class="col-md-11">
                                <input type="text" class="form-control" ref="building" v-model="buildingName" placeholder="Nombre" required>
                            </div>
                             <div class="col-md-1">
                                <input type="submit" value="Añadir" class="btn btn-primary">
                            </div>
                        </div>
                    </form>
                   
                    
                </div>
            </div>
            <br>
            <h2>Edificios</h2>
            <hr>
            <div class="row" v-for="building in buildings" :key="building.key">
                <div class="col-md">
                    <div class="card">
                        <div class="card-body">
                            <div class="card-title">
                                <h3>{{building.name}}</h3>
                            </div>
                            <form @submit.prevent="addRoom(building.id,form.parent_id[building.id])" class="form-action">
                                <div class="form-row">
                                    <div class="col-md-11">
                                        <input type="text" class="form-control" v-model="form.parent_id[building.id]" placeholder="Área" required>

                                    </div>
                                    <div class="col-md-1">
                                        <button class="btn btn-outline-primary">Añadir</button>

                                    </div>
                                </div>
                            </form>
                            <div class="card-text">
                                
                                <div class="row">
                                    
                                    <div class="col-md">
                                  <br>
                                        <h4>Área</h4>
                                    </div>
                                    
                                </div>
                                <div clas="row" v-for="room in building.rooms" :key="room.key">
                                    <div class="col-md">
                                        {{room.name}}
                                    </div>
                                </div>
                                
                            </div>
                         

                        </div>
                    </div>
                    <hr>

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
      buildingName: '',
      buildings: [],
      form: {
          parent_id: []
      }
    };
  },
  methods: {
    signOut() {
      api.auth().signOut();
      this.$router.go();
    },
    addBuilding() {
        api
        .db("proyects")
        .child(`/${this.authUser.uid}/buildings/`)
        .push({ name: this.buildingName});
      this.buildingName = "";
      this.$refs.building.focus();
    },
    addRoom(id,room) {
        api
        .db("proyects")
        .child(`/${this.authUser.uid}/rooms/`)
        .push({ name: room, building: id});
        this.form.parent_id[id] = "";
    },
    fetchRooms(){
       
    }
  },
  mounted(){
      
    

  },
  created() {
    api.auth().onAuthStateChanged(user => {
      this.authUser = user;
      if (user) {
        this.displayName = user.displayName;
        this.photoURL = user.photoURL;
        api.db("proyects").child(`${user.uid}/buildings`).on("child_added", snapshot => {
            let snapval = snapshot.val()
            let snkey = snapshot.key
            snapshot.forEach((key) => {
                // console.log(snapshot.key)
                let snapkey =[]
                 
                api.db("proyects").child(`${user.uid}/rooms`).orderByChild('building').equalTo(`${snapshot.key}`).on("child_added", snapshot => {
                    //  console.log(snapshot.val().name,snapkey)
                     snapkey.push({name:snapshot.val().name,id:snapshot.key})
                })
                this.buildings.push({...snapval, id:snkey,rooms:snapkey})
                console.log(snapkey)
            })
            
            // console.log(this.buildings)
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
.card-body{

}
</style>

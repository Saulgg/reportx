<template>
    <div class="container">
        <div v-if="loadingPage">
            <div class="loadingPage">
                <h3>Cargando...</h3>
            </div>
        </div>
        <div  v-else>
           
 
            <div class="row">
                <div class="col-md">
                    <form @submit.prevent="createTicket" class="form-action">
                        <div class="form-row">
                            <div class="col-md-11">
                                <input type="text" class="form-control" v-model="name" placeholder="nombre" required>
                                <input type="text" class="form-control" v-model="priority" placeholder="prioridad" required>
                                <select v-model="priority" >
                                    <option v-for="prioritys in priorities" :key="prioritys.key" :value="prioritys">{{prioritys}}</option>
                                </select>
                                <input type="text" class="form-control" v-model="message" placeholder="mensaje" required>
                          
                                <select v-model="building" v-on:input="getRooms($event.target.value)" >
                                    <option v-for="building in buildings" :key="building.key" :value="building.name">{{building.name}}</option>
                                </select>
                                <select v-model="room" >
                                    <option v-for="room in rooms" :key="room.key" :value="room.name">{{room.name}}</option>
                                </select>
                            </div>
                            <div class="col-md-1">
                                <button class="btn btn-outline-primary">Añadir</button>

                            </div>
                        </div>
                    </form>
                </div>
            </div>
  
            <div class="row">
                <div class="col-md">
                    <router-link class="btn btn-outline-primary" to="/">Volver</router-link>
                </div>
            </div>
        </div>
    
    </div>
</template>

<script>
import api from "../api";
export default {
  name: "Ticket",
  data() {
    return {
      loadingPage: true,
      name: '',
      priority: '',
      message: '',
      building: '',
      room: '',
      authUser: null,
      proyect: null,
      buildings: [],
      rooms: [],
      priorities: {
          0: 'baja',
          1: 'media',
          2: 'alta',
          3: 'inmediata'
      }
    };
  },
  mounted: function() {},
  methods: {
      getRooms(room) {
  
        this.buildings.forEach(({name,rooms},index) =>{
            if(name===room){
                this.rooms = rooms
      
            }
        })
      },
      createTicket(){
          api
        .db("proyects")
        .child(`/${this.authUser.uid}/tickets/`)
        .push({ name: this.name, priority: this.priority, building: this.building, room: this.room, working:'Sin asignar', message: this.message});
      }
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
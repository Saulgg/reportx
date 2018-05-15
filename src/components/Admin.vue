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
                    <img :src="authUser.photoURL" alt="" height="150">
                    <p>{{authUser.displayName || authUser.email}}</p>
                </div>
            </div>
            <div class="row">
                <div class="col-md">
                    <button @click="signOut" class="btn btn-primary">Cerrar sesión</button>
                </div>
            </div>
            <div class="row">
                <div class="col-md">
                    <form @submit.prevent="updateProfile">
                        <h2>Actualizar perfil</h2>
                        <input v-model="displayName" placeholder="Tú nombre">
                        <input v-model="photoURL" placeholder="URL de tú foto">
                        <button>Actualizar</button>
                    </form>
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
      email: "",
      password: "",
      displayName: null,
      photoURL: null,
      authUser: null
    };
  },
  mounted: function() {},
  methods: {
    register() {
        api.auth().createUserWithEmailAndPassword(this.email, this.password).catch(error => alert(error.message));
    },
    signIn() {
        api.auth().signInWithEmailAndPassword(this.email,this.password).catch(error => alert(error.message));
    },
    signOut() {
        api.auth().signOut();
        this.$router.go()
    },
    signInWithGoogle() {
        const provider = new api.googleauth.GoogleAuthProvider()
        api.auth().signInWithPopup(provider)
        .then(data => console.log(data.user, data.credential.accessToken))
        .catch(error => alert(error.message))
    },
    updateProfile() {
        this.authUser.updateProfile({
            displayName: this.displayName,
            photoURL: this.photoURL
        })
    }
  },
  created() {
    api.auth().onAuthStateChanged(user => {
      this.authUser = user;
      if (user) {
          this.displayName = user.displayName;
          this.photoURL = user.photoURL;
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

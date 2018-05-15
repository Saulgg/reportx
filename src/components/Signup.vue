<template>
    <div class="container">
        <div>
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
                            <button @click="signInWithGoogle" class="btn btn-primary">Registrarme con Google</button>
                            <form @submit.prevent="register" class="form-action">
                                
                                <div>o</div>
                                <div>Regístrate usando correo:</div>
                                <input type="text" class="form-control" v-model="email" placeholder="Correo" required>
                                <input type="password" class="form-control" v-model="password" placeholder="Contraseña" required>
                                <input type="submit" value="Regístrate" class="btn btn-primary">
                            </form>
                        </dir>
                    </div>
                </div>
            <!-- </div> -->
            <!-- <div class="row"> -->
                <div class="col-md">
                    <h3>Iniciar sesión</h3>
                    <button @click="signInWithGoogle" class="btn btn-primary">Iniciar sesión con Google</button>
                    <form @submit.prevent="signIn" class="form-action">
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
      displayName: null,
      photoURL: null,
      authUser: null
    };
  },
  mounted: function() {},
  methods: {
    register() {
        api.auth().createUserWithEmailAndPassword(this.email, this.password)
        .then(data =>  this.$router.go())
        .catch(error => alert(error.message));
    },
    signIn() {
        api.auth().signInWithEmailAndPassword(this.email,this.password).catch(error => alert(error.message));
    },
    signOut() {
        api.auth().signOut();
    },
    signInWithGoogle() {
        const provider = new api.googleauth.GoogleAuthProvider()
        api.auth().signInWithPopup(provider)
        .then(data =>  this.$router.go())
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
